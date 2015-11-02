(ns taxicab.geo
  (:require-macros [taxicab.macros :refer [spy]]))

(def abs #(.abs js/Math %))

(defn slope [{x1 :x y1 :y} {x2 :x y2 :y}]
  (/ (- y2 y1) (- x2 x1)))

(defn intercept [m {:keys [x y]}]
  (- y (* m x)))

(defn line [m b]
  #(+ (* m %) b))

(defn line-inverse [m b]
  #(/ (- % b) m))

(defn nearest [{:keys [x y]} [p1 p2]]
  (let [m (slope p1 p2)
        am (abs m)
        b (intercept m p1)]
    (cond
      (= js/Infinity am) {:x (p1 :x) :y y}
      (< 1 am)           {:x ((line-inverse m b) y) :y y}
      :else              {:x x :y ((line m b) x)})))

(defn dist
  ([a b]
   (+ (dist :x a b)
      (dist :y a b)))
  ([f a b]
   (abs (- (f a) (f b)))))

(defn dist-line [p l]
  (dist p (nearest p l)))

(defn avg [& xs]
  (/ (reduce + xs) (count xs)))

(defn eq? [a b]
  (< (- a 0.01) b (+ a 0.01)))

(defn collinear? [a b c]
  (let [m1 (slope a b)
        m2 (slope b c)]
    (or (and (= (abs m1) js/Infinity)
             (= (abs m2) js/Infinity))
        (and (eq? m1 m2)
             (eq? (intercept m1 a)
                  (intercept m2 b))))))

(defn ordered? [& ps]
  (let [xs (map :x ps)
        ys (map :y ps)]
    (and (or (apply <= xs)
             (apply >= xs))
         (or (apply <= ys)
             (apply >= ys)))))

(defn on-ray? [[v r] p]
  (and (collinear? v r p)
       (or (ordered? v r p)
           (ordered? v p r))))

(defn midpoint [{x1 :x y1 :y} {x2 :x y2 :y}]
  {:x (avg x1 x2) :y (avg y1 y2)})

(defn middle [points]
  (let [n (-> points count (/ 2) int)
        xs (sort (map :x points))
        ys (sort (map :y points))]
    {:x (nth xs n) :y (nth ys n)}))

(defn middle-2 [points]
  (let [n (-> points count (/ 2) int)
        xs (sort (map :x points))
        ys (sort (map :y points))]
    [{:x (nth xs (dec n)) :y (nth ys (dec n))}
     {:x (nth xs n) :y (nth ys n)}]))

(def high 10000)

(defn extended [from to]
  (let [{fx :x fy :y} from
        {tx :x ty :y} to
        dx (- fx tx)]
    (if (zero? dx)
      {:x fx :y (if (< ty fy) 0 high)}
      (let [m (slope from to)
            b (intercept m from)
            x (if (< tx fx) 0 high)
            y (if (< ty fy) 0 high)
            [x y] (if (< 1 (abs m))
                    [(/ (- y b) m) y]
                    [x (+ b (* m x))])]
        {:x x :y y}))))

(defn corners [{x1 :x y1 :y} {x2 :x y2 :y}]
  [{:x x1 :y y2}
   {:x x2 :y y1}])

(defn bounding [a b]
  (let [[c d] (corners a b)]
    [a c b d]))

(defn off? [{:keys [x y]}]
  (and (or (<= x 0) (<= high x))
       (or (<= y 0) (<= high y))))

(defn area [v r1 r2]
  (let [a (extended v r1)
        b (extended v r2)
        [corner] (filter off? (corners a b))]
    [v a corner b]))

(defn step [p dx dy]
  (-> p
    (update :x + dx)
    (update :y + dy)))

(defn cardinal [{:keys [x y] :as c} r]
  [(step c (- r) 0)
   (step c 0 (- r))
   (step c r 0)
   (step c 0 r)])

(def vertical? #(= (:x %1) (:x %2)))

(defn intersection [[a b] [c d]]
  (cond
    (and (vertical? a b) (vertical? c d)) nil
    (vertical? a b) (let [x (:x a)
                          m (slope c d)
                          b (intercept m c)]
                      {:x x :y ((line m b) x)})
    (vertical? c d) (let [x (:x c)
                          m (slope a b)
                          b (intercept m a)]
                      {:x x :y ((line m b) x)})
    (= (slope a b) (slope c d)) nil
    :else (let [m1 (slope a b)
                m2 (slope c d)
                b1 (intercept m1 a)
                b2 (intercept m2 c)
                x (/ (- b2 b1) (- m1 m2))]
            {:x x :y ((line m1 b1) x)})))

(defn intersections [[a b] verts]
  (remove nil?
    (map #(intersection [a b] %)
      (map vector
        verts
        (drop 1 (cycle verts))))))

(defn intersections-circle [l c r]
  (filter #(eq? r (dist c %))
          (intersections l (cardinal c r))))

(defn direction [{x1 :x y1 :y} {x2 :x y2 :y}]
  (let [dx (- x2 x1)
        dy (- y2 y1)]
    [(/ dx (abs dx)) (/ dy (abs dy))]))

(defn parallel [a b k]
  (let [m (slope a b)
        k' (if (= js/Infinity (abs m))
             (step k 0 1)
             (step k 1 m))]
    [(extended k k') (extended k' k)]))

(defn close?
  ([a b] (close? a b 0.001))
  ([a b t]
   (<= (- a t) b (+ a t))))
