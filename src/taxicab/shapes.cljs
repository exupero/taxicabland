(ns taxicab.shapes
  (:require-macros [taxicab.macros :refer [spy]])
  (:require [taxicab.geo :as geo :refer [path extended midpoint dist step cardinal]]))

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

(defn classed [cls dom]
  (update-in dom [1 :class] str " " cls))

(defn point [emit {:keys [id x y] :as pt}]
  [:circle {:class "point"
            :cx x :cy y :r 5
            :onmousedown #(do
                            (.stopPropagation %)
                            (emit [:hold id]))
            :onmouseup #(do
                          (.stopPropagation %)
                          (emit [:release id]))}])

(defn line [emit {:keys [p1 p2]}]
  [:path {:class "line stroke"
          :d (path [(extended p2 p1)
                    (extended p1 p2)])}])

(defn line-segment [emit {:keys [p1 p2]}]
  [:path {:class "line-segment stroke"
          :d (path [p1 p2])}])

(defn ray [emit {:keys [p1 p2]}]
  (classed "ray" (sweep p1 p2)))

(defn parallel [emit {:keys [p1 p2 k]}]
  (let [k' (step k 1 (geo/slope p1 p2))]
    [:path {:class "line stroke"
            :d (path [(extended k k')
                      (extended k' k)])}]))

(defn midset [emit {:keys [p1 p2]}]
  (let [eq #(geo/eq? (dist p1 %) (dist p2 %))
        m (midpoint p1 p2)
        d (dist p1 m)
        [c1 c2] (filter eq (concat (cardinal p1 d) (cardinal p2 d)))
        ex #(filter eq (cardinal % 1))]
    (list
      [:path {:class "relationship"
              :d (str (path [m p1]) (path [m p2]))}]
      [:path {:class "midset stroke join"
              :d (path [c1 c2])}]
      (classed "midset" (apply sweep c1 (ex c1)))
      (when (not= c1 c2)
        (classed "midset" (apply sweep c2 (ex c2)))))))

#_(defn perpendicular [emit {:keys [p1 p2 k]}]
  (let [d (+ 5 (geo/dist-line k [p1 p2]))
        [i1 i2] (filter #(geo/eq? d (dist k %))
                  (intersections [p1 p2] (cardinal k d)))]
    (midset emit {:p1 i1 :p2 i2})))

(defn bisect [emit {:keys [r1 v r2]}]
  (let [intersect (fn [r]
                    (first
                      (filter #(geo/on-ray? [v r] %)
                        (geo/intersections-circle [v r] v 100))))
        c1 (intersect r1)
        c2 (intersect r2)
        m (midpoint c1 c2)]
    (list
      [:path {:class "relationship"
              :d (str (path [r1 m]) (path [r2 m]))}]
      (classed "bisect" (sweep v m)))))

(defn circle [emit {:keys [c r]}]
  (list
    [:path {:class "relationship"
            :d (path [c r])}]
    [:path {:class "circle stroke"
            :d (path (cardinal c (dist c r)) true)}]))

(defn ellipse [emit {:keys [f1 f2 k]}]
  (let [{x1 :x y1 :y} f1
        {x2 :x y2 :y} f2
        [x1 x2] (sort [x1 x2])
        [y1 y2] (sort [y1 y2])
        r (-> (dist f1 k)
            (+ (dist f2 k))
            (- (dist f1 f2))
            (/ 2))]
    (list
      [:path {:class "relationship"
              :d (path [f1 k f2])}]
      [:path {:class "ellipse stroke"
              :d (path [{:x (- x1 r) :y y1}
                        {:x (- x1 r) :y y2}
                        {:x x1 :y (+ y2 r)}
                        {:x x2 :y (+ y2 r)}
                        {:x (+ x2 r) :y y2}
                        {:x (+ x2 r) :y y1}
                        {:x x2 :y (- y1 r)}
                        {:x x1 :y (- y1 r)}
                        {:x (- x1 r) :y y1}])}])))

(defn parabola [emit {:keys [f d1 d2]}]
  (let [eq #(geo/eq? (dist % f) (geo/dist-line % [d1 d2]))]
    (if (= 1 (geo/abs (geo/slope d1 d2)))
      (let [m1 (midpoint f (geo/intersection [d1 d2] [f (step f 1 0)]))
            m2 (midpoint f (geo/intersection [d1 d2] [f (step f 0 1)]))
            [c1] (filter eq (cardinal m1 1))
            [c2] (filter eq (cardinal m2 1))]
        (list
          [:path {:class "relationship"
                  :d (str (path [f m1]) (path [d1 m1]) (path [d2 m1]))}]
          [:path {:class "parabola stroke"
                  :d (path [(extended m1 c1) m1 m2 (extended m2 c2)])}]))
      (let [m (midpoint f (geo/nearest f [d1 d2]))
            i1 (geo/intersection [d1 d2] [f (step f 1 1)])
            i2 (geo/intersection [d1 d2] [f (step f 1 -1)])
            [c1] (filter eq (geo/corners f i1))
            [c2] (filter eq (geo/corners f i2))]
        (list
          [:path {:class "relationship"
                  :d (str (path [f m]) (path [d1 m]) (path [d2 m]))}]
          [:path {:class "parabola stroke"
                  :d (path [(extended i1 c1) c1 m c2 (extended i2 c2)])}])))))

(defn hyperbola [emit {:keys [f1 f2 k]}]
  (let [metric #(geo/abs (- (dist % f1) (dist % f2)))
        d (metric k)
        r (-> (dist f1 f2) (- d) (/ 2))
        eq #(geo/eq? d (metric %))
        hyp #(->> (cardinal % 5)
               (filter eq)
               (apply sweep %)
               (classed "hyperbola"))]
    (list
      [:path {:class "relationship"
              :d (path [f1 k f2])}]
      (if (zero? r)
        (list (hyp f1) (hyp f2))
        (let [wing (fn [a b]
                     (let [[dx dy] (map (partial * r) (geo/direction a b))
                           exs (->> (geo/bounding f1 f2)
                                 (geo/intersections [(step a dx 0) (step a 0 dy)])
                                 (filter #(and (eq %) (geo/eq? r (dist a %)))))]
                       (list
                         [:path {:class "hyperbola stroke join"
                                 :d (path exs)}]
                         (map hyp exs))))]
          (list (wing f1 f2) (wing f2 f1)))))))

(defn mindist [emit {:keys [points]}]
  (if (even? (count points))
    (let [[m1 m2] (geo/middle-2 points)
          {m1x :x m1y :y} m1
          {m2x :x m2y :y} m2
          m (midpoint m1 m2)]
      (list
        [:path {:class "relationship"
                :d (apply str (map #(path [m %]) points))}]
        [:path {:class "mindist area"
                :d (path [{:x m1x :y m1y}
                          {:x m1x :y m2y}
                          {:x m2x :y m2y}
                          {:x m2x :y m1y}
                          {:x m1x :y m1y}])}]))
    (let [{:keys [x y]} (geo/middle points)]
      (list
        [:path {:class "relationship"
                :d (apply str (map #(path [{:x x :y y} %]) points))}]
        [:circle {:class "mindist mindist-point"
                  :cx x :cy y :r 5}]))))

(def renderers
  {:point point
   :line line
   :line-segment line-segment
   :ray ray
   :parallel parallel
   :midset midset
   :bisect bisect
   :circle circle
   :ellipse ellipse
   :parabola parabola
   :hyperbola hyperbola
   :mindist mindist})

(defn render [t emit sh]
  (let [f (renderers t)]
    (f emit sh)))