(ns taxicab.shapes
  (:require-macros [taxicab.macros :refer [spy]])
  (:require [taxicab.geo :as geo :refer [path extended midpoint dist step cardinal]]
            [taxicab.events :refer [without-propagation]]))

(defn sweep
  ([v r]
   [:path {:class "stroke"
           :d (path [v (extended v r)])}])
  ([v r1 r2]
   (if (geo/collinear? v r1 r2)
     [:path {:class "stroke"
             :d (path [(extended v r1) (extended v r2)])}]
     [:path {:class "area"
             :d (path (geo/area v r1 r2) true)}])))

(defn stroked [x]
  [:g {:class "stroked"} x x])

(defmulti shape (fn [{t :type} _] t))

(defmethod shape :point [{:keys [id x y label] :as pt}]
  [:g {:transform (str "translate(" x "," y ")")}
   (stroked [:text {:dy -10} label])
   [:circle {:r 5}]])

(defmethod shape :line [{:keys [id p1 p2]}]
  [:path {:class "stroke"
          :d (path [(extended p2 p1)
                    (extended p1 p2)])}])

(defmethod shape :line-segment [{:keys [p1 p2]}]
  [:path {:class "stroke"
          :d (path [p1 p2])}])

(defmethod shape :ray [{:keys [p1 p2]}]
  (sweep p1 p2))

(defmethod shape :parallel [{:keys [p1 p2 k]}]
  (let [k' (step k 1 (geo/slope p1 p2))]
    [:path {:class "stroke"
            :d (path [(extended k k')
                      (extended k' k)])}]))

(defmethod shape :midset [{:keys [p1 p2]}]
  (let [eq #(geo/eq? (dist p1 %) (dist p2 %))
        m (midpoint p1 p2)
        d (dist p1 m)
        [c1 c2] (filter eq (concat (cardinal p1 d) (cardinal p2 d)))
        ex #(filter eq (cardinal % 1))]
    (list
      [:path {:class "stroke join"
              :d (path [c1 c2])}]
      (apply sweep c1 (ex c1))
      (when (not= c1 c2)
        (apply sweep c2 (ex c2))))))

(defmethod shape :perpendicular [{:keys [p1 p2 k]}]
  (let [slope (geo/slope p1 p2)]
    (cond
      (= 1 slope)
      (list
        (sweep k (step k 1 0) (step k 0 -1))
        (sweep k (step k -1 0) (step k 0 1)))

      (= -1 slope)
      (list
        (sweep k (step k -1 0) (step k 0 -1))
        (sweep k (step k 1 0) (step k 0 1)))

      :else
      (let [i (geo/nearest k [p1 p2])]
        (sweep k (extended i k) (extended k i))))))

(defmethod shape :bisect [{:keys [r1 v r2]}]
  (let [intersect (fn [r]
                    (first
                      (filter #(geo/on-ray? [v r] %)
                        (geo/intersections-circle [v r] v 100))))
        c1 (intersect r1)
        c2 (intersect r2)
        m (midpoint c1 c2)]
    (sweep v m)))

(defmethod shape :circle [{:keys [c r]}]
  [:path {:class "stroke"
          :d (path (cardinal c (dist c r)) true)}])

(defmethod shape :ellipse [{:keys [f1 f2 k]}]
  (let [{x1 :x y1 :y} f1
        {x2 :x y2 :y} f2
        [x1 x2] (sort [x1 x2])
        [y1 y2] (sort [y1 y2])
        r (-> (dist f1 k)
            (+ (dist f2 k))
            (- (dist f1 f2))
            (/ 2))]
    [:path {:class "stroke"
            :d (path [{:x (- x1 r) :y y1}
                      {:x (- x1 r) :y y2}
                      {:x x1 :y (+ y2 r)}
                      {:x x2 :y (+ y2 r)}
                      {:x (+ x2 r) :y y2}
                      {:x (+ x2 r) :y y1}
                      {:x x2 :y (- y1 r)}
                      {:x x1 :y (- y1 r)}
                      {:x (- x1 r) :y y1}])}]))

(defmethod shape :parabola [{:keys [f d1 d2]}]
  (let [eq #(geo/eq? (dist % f) (geo/dist-line % [d1 d2]))]
    (if (= 1 (geo/abs (geo/slope d1 d2)))
      (let [m1 (midpoint f (geo/intersection [d1 d2] [f (step f 1 0)]))
            m2 (midpoint f (geo/intersection [d1 d2] [f (step f 0 1)]))
            [c1] (filter eq (cardinal m1 1))
            [c2] (filter eq (cardinal m2 1))]
        [:path {:class "stroke"
                :d (path [(extended m1 c1) m1 m2 (extended m2 c2)])}])
      (let [m (midpoint f (geo/nearest f [d1 d2]))
            i1 (geo/intersection [d1 d2] [f (step f 1 1)])
            i2 (geo/intersection [d1 d2] [f (step f 1 -1)])
            [c1] (filter eq (geo/corners f i1))
            [c2] (filter eq (geo/corners f i2))]
        [:path {:class "stroke"
                :d (path [(extended i1 c1) c1 m c2 (extended i2 c2)])}]))))

(defmethod shape :hyperbola [{:keys [f1 f2 k]}]
  (let [metric #(geo/abs (- (dist % f1) (dist % f2)))
        d (metric k)
        r (-> (dist f1 f2) (- d) (/ 2))
        eq #(geo/eq? d (metric %))
        hyp #(->> (cardinal % 5)
               (filter eq)
               (apply sweep %))]
    (if (zero? r)
      (list (hyp f1) (hyp f2))
      (let [wing (fn [a b]
                   (let [[dx dy] (map (partial * r) (geo/direction a b))
                         exs (->> (geo/bounding f1 f2)
                               (geo/intersections [(step a dx 0) (step a 0 dy)])
                               (filter #(and (eq %) (geo/eq? r (dist a %)))))]
                     (list
                       [:path {:class "stroke join"
                               :d (path exs)}]
                       (map hyp exs))))]
                       (list (wing f1 f2) (wing f2 f1))))))

(defmethod shape :mindist [{:keys [points]}]
  (if (even? (count points))
    (let [[m1 m2] (geo/middle-2 points)
          {m1x :x m1y :y} m1
          {m2x :x m2y :y} m2
          m (midpoint m1 m2)]
      [:path {:class "area"
              :d (path [{:x m1x :y m1y}
                        {:x m1x :y m2y}
                        {:x m2x :y m2y}
                        {:x m2x :y m1y}
                        {:x m1x :y m1y}])}])
    (let [{:keys [x y]} (geo/middle points)]
      [:circle {:class "area"
                :cx x :cy y :r 5}])))
