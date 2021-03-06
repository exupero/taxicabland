(ns taxicab.shapes
  (:require-macros [taxicab.macros :refer [spy]])
  (:require [taxicab.geo :as geo :refer [extended midpoint dist step cardinal]]
            [taxicab.events :refer [without-propagation]]))

(defmulti shape (fn [{t :type} _] t))

(defmethod shape :point [{:keys [id x y label] :as pt}]
  {:points [{:x x :y y :label label :draggable? true}]})

(defmethod shape :line [{:keys [id p1 p2]}]
  {:strokes [[(extended p2 p1) (extended p1 p2)]]
   :defining-points [p1 p2]})

(defmethod shape :line-segment [{:keys [p1 p2]}]
  {:strokes [[p1 p2]]
   :defining-points [p1 p2]})

(defmethod shape :ray [{:keys [p1 p2]}]
  {:strokes [[p1 (extended p1 p2)]]
   :defining-points [p1 p2]})

(defmethod shape :parallel [{:keys [p1 p2 k]}]
  {:strokes [(geo/parallel p1 p2 k)]
   :defining-points [p1 p2 k]
   :guides [[(extended p1 p2) (extended p2 p1)]]})

(defmethod shape :midset [{:keys [p1 p2]}]
  (let [eq #(geo/eq? (dist p1 %) (dist p2 %))
        m (midpoint p1 p2)
        d (dist p1 m)
        [c1 c2] (filter eq (concat (cardinal p1 d) (cardinal p2 d)))
        ex #(filter eq (cardinal % 1))]
    {:strokes [[c1 c2]]
     :sweeps [[c1 (ex c1)]
              (when (not= c1 c2)
                [c2 (ex c2)])]
     :defining-points [p1 p2]
     :guides [[p1 p2]]}))

(defmethod shape :perpendicular [{:keys [p1 p2 k]}]
  (let [slope (geo/slope p1 p2)]
    {:sweeps (cond
               (= 1 slope)
               [[k (step k 1 0) (step k 0 -1)]
                [k (step k -1 0) (step k 0 1)]]

               (= -1 slope)
               [[k (step k -1 0) (step k 0 -1)]
                [k (step k 1 0) (step k 0 1)]]

               :else
               (let [i (geo/nearest k [p1 p2])]
                 [[k (extended i k) (extended k i)]]))
     :defining-points [p1 p2 k]
     :guides [[(extended p1 p2) (extended p2 p1)]]}))

(defmethod shape :bisect [{:keys [r1 v r2]}]
  (let [parallels (fn [a b s]
                   (let [p (geo/parallel a b (step a s 0))]
                     (if (geo/close? s (geo/dist-line a p))
                       [p
                        (geo/parallel a b (step a (- s) 0))]
                       [(geo/parallel a b (step a 0 s))
                        (geo/parallel a b (step a 0 (- s)))])))
        interior? (fn [ray l]
                    (geo/on-ray? ray (geo/intersection ray l)))
        parallel (fn [v r1 r2]
                   (->> (parallels v r1 1)
                     (filter (partial interior? [v r2]))
                     first))
        i (geo/intersection (parallel v r1 r2) (parallel v r2 r1))]
    {:strokes [[(extended v i) (extended i v)]]
     :defining-points [r1 v r2]
     :guides [[(extended r1 v) (extended v r1)]
              [(extended r2 v) (extended v r2)]]}))

(defmethod shape :circle [{:keys [c r]}]
  {:loops [(cardinal c (dist c r))]
   :defining-points [(assoc c :role "Center") r]})

(defmethod shape :ellipse [{:keys [f1 f2 k]}]
  (let [{x1 :x y1 :y} f1
        {x2 :x y2 :y} f2
        [x1 x2] (sort [x1 x2])
        [y1 y2] (sort [y1 y2])
        r (-> (dist f1 k)
            (+ (dist f2 k))
            (- (dist f1 f2))
            (/ 2))]
    {:loops [[{:x (- x1 r) :y y1}
              {:x (- x1 r) :y y2}
              {:x x1 :y (+ y2 r)}
              {:x x2 :y (+ y2 r)}
              {:x (+ x2 r) :y y2}
              {:x (+ x2 r) :y y1}
              {:x x2 :y (- y1 r)}
              {:x x1 :y (- y1 r)}
              {:x (- x1 r) :y y1}]]
     :defining-points [(assoc f1 :role "Focus")
                       (assoc f2 :role "Focus")
                       k]}))

(defmethod shape :parabola [{:keys [f d1 d2]}]
  (let [eq #(geo/eq? (dist % f) (geo/dist-line % [d1 d2]))]
    {:strokes (if (= 1 (geo/abs (geo/slope d1 d2)))
                (let [m1 (midpoint f (geo/intersection [d1 d2] [f (step f 1 0)]))
                      m2 (midpoint f (geo/intersection [d1 d2] [f (step f 0 1)]))
                      [c1] (filter eq (cardinal m1 1))
                      [c2] (filter eq (cardinal m2 1))]
                  [[(extended m1 c1) m1 m2 (extended m2 c2)]])
                (let [m (midpoint f (geo/nearest f [d1 d2]))
                      i1 (geo/intersection [d1 d2] [f (step f 1 1)])
                      i2 (geo/intersection [d1 d2] [f (step f 1 -1)])
                      [c1] (filter eq (geo/corners f i1))
                      [c2] (filter eq (geo/corners f i2))]
                  [[(extended i1 c1) c1 m c2 (extended i2 c2)]]))
     :defining-points [(assoc f :role "Focus") d1 d2]
     :guides [[(extended d1 d2) (extended d2 d1)]]}))

(defmethod shape :hyperbola [{:keys [f1 f2 k]}]
  (let [metric #(geo/abs (- (dist % f1) (dist % f2)))
        d (metric k)
        r (-> (dist f1 f2) (- d) (/ 2))
        eq #(geo/eq? d (metric %))
        hyp #(->> (cardinal % 5)
               (filter eq)
               (vector %))
        dp [(assoc f1 :role "Focus")
            (assoc f2 :role "Focus")]]
    (if (zero? r)
      {:sweeps [(hyp f1) (hyp f2)]
       :defining-points dp}
      (let [wing (fn [a b]
                   (let [[dx dy] (map (partial * r) (geo/direction a b))
                         exs (->> (geo/bounding f1 f2)
                               (geo/intersections [(step a dx 0) (step a 0 dy)])
                               (filter #(and (eq %) (geo/eq? r (dist a %)))))]
                     {:strokes [exs]
                      :sweeps (map hyp exs)}))]
        (merge (merge-with concat (wing f1 f2) (wing f2 f1))
               {:defining-points dp})))))

(defmethod shape :mindist [{:keys [points]}]
  (merge {:defining-points points}
         (if (even? (count points))
           (let [[m1 m2] (geo/middle-2 points)
                 {m1x :x m1y :y} m1
                 {m2x :x m2y :y} m2
                 vert (= m1x m2x)
                 horiz (= m1y m2y)]
             (cond
               (and vert horiz) {:points [m1]}
               (or vert horiz)  {:strokes [[m1 m2]]}
               :else            {:areas [[{:x m1x :y m1y}
                                          {:x m1x :y m2y}
                                          {:x m2x :y m2y}
                                          {:x m2x :y m1y}
                                          {:x m1x :y m1y}]]}))
           {:points [(geo/middle points)]})))
