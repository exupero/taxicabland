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

(defmulti render (fn [t _ _] t))

(defmethod render :point [_ emit {:keys [id x y] :as pt}]
  [:circle {:class "point"
            :cx x :cy y :r 5
            :onmousedown #(do
                            (.stopPropagation %)
                            (emit [:hold id]))
            :onmouseup #(do
                          (.stopPropagation %)
                          (emit [:release id]))}])

(defmethod render :line [_ emit {:keys [p1 p2]}]
  [:g {:class "line"}
   [:path {:class "stroke"
           :d (path [(extended p2 p1)
                     (extended p1 p2)])}]])

(defmethod render :line-segment [_ emit {:keys [p1 p2]}]
  [:g {:class "line-segment"}
   [:path {:class "stroke"
           :d (path [p1 p2])}]])

(defmethod render :ray [_ emit {:keys [p1 p2]}]
  [:g {:class "ray"}
   (sweep p1 p2)])

(defmethod render :parallel [_ emit {:keys [p1 p2 k]}]
  (let [k' (step k 1 (geo/slope p1 p2))]
    [:g {:class "line"}
     [:path {:class "stroke"
             :d (path [(extended k k')
                       (extended k' k)])}]]))

(defmethod render :midset [_ emit {:keys [p1 p2]}]
  (let [eq #(geo/eq? (dist p1 %) (dist p2 %))
        m (midpoint p1 p2)
        d (dist p1 m)
        [c1 c2] (filter eq (concat (cardinal p1 d) (cardinal p2 d)))
        ex #(filter eq (cardinal % 1))]
    [:g {:class "midset"}
     [:path {:class "relationship"
             :d (str (path [m p1]) (path [m p2]))}]
     [:path {:class "stroke join"
             :d (path [c1 c2])}]
     (apply sweep c1 (ex c1))
     (when (not= c1 c2)
       (apply sweep c2 (ex c2)))]))

(defmethod render :perpendicular [_ emit {:keys [p1 p2 k]}]
  (let [i (geo/nearest k [p1 p2])]
    [:g {:class "perpendicular"}
     [:path {:class "relationship"
             :d (str (path [p1 k] [k p2]))}]
     (sweep k (extended i k) (extended k i)) ]))

(defmethod render :bisect [_ emit {:keys [r1 v r2]}]
  (let [intersect (fn [r]
                    (first
                      (filter #(geo/on-ray? [v r] %)
                        (geo/intersections-circle [v r] v 100))))
        c1 (intersect r1)
        c2 (intersect r2)
        m (midpoint c1 c2)]
    [:g {:class "bisect"}
     [:path {:class "relationship"
             :d (str (path [r1 m]) (path [r2 m]))}]
     (sweep v m)]))

(defmethod render :circle [_ emit {:keys [c r]}]
  [:g {:class "circle"}
   [:path {:class "relationship"
           :d (path [c r])}]
   [:path {:class "stroke"
           :d (path (cardinal c (dist c r)) true)}]])

(defmethod render :ellipse [_ emit {:keys [f1 f2 k]}]
  (let [{x1 :x y1 :y} f1
        {x2 :x y2 :y} f2
        [x1 x2] (sort [x1 x2])
        [y1 y2] (sort [y1 y2])
        r (-> (dist f1 k)
            (+ (dist f2 k))
            (- (dist f1 f2))
            (/ 2))]
    [:g {:class "ellipse"}
     [:path {:class "relationship"
             :d (path [f1 k f2])}]
     [:path {:class "stroke"
             :d (path [{:x (- x1 r) :y y1}
                       {:x (- x1 r) :y y2}
                       {:x x1 :y (+ y2 r)}
                       {:x x2 :y (+ y2 r)}
                       {:x (+ x2 r) :y y2}
                       {:x (+ x2 r) :y y1}
                       {:x x2 :y (- y1 r)}
                       {:x x1 :y (- y1 r)}
                       {:x (- x1 r) :y y1}])}]]))

(defmethod render :parabola [_ emit {:keys [f d1 d2]}]
  (let [eq #(geo/eq? (dist % f) (geo/dist-line % [d1 d2]))]
    (if (= 1 (geo/abs (geo/slope d1 d2)))
      (let [m1 (midpoint f (geo/intersection [d1 d2] [f (step f 1 0)]))
            m2 (midpoint f (geo/intersection [d1 d2] [f (step f 0 1)]))
            [c1] (filter eq (cardinal m1 1))
            [c2] (filter eq (cardinal m2 1))]
        [:g {:class "parabola"}
         [:path {:class "relationship"
                 :d (str (path [f m1]) (path [d1 m1]) (path [d2 m1]))}]
         [:path {:class "stroke"
                 :d (path [(extended m1 c1) m1 m2 (extended m2 c2)])}]])
      (let [m (midpoint f (geo/nearest f [d1 d2]))
            i1 (geo/intersection [d1 d2] [f (step f 1 1)])
            i2 (geo/intersection [d1 d2] [f (step f 1 -1)])
            [c1] (filter eq (geo/corners f i1))
            [c2] (filter eq (geo/corners f i2))]
        [:g {:class "parabola"}
         [:path {:class "relationship"
                 :d (str (path [f m]) (path [d1 m]) (path [d2 m]))}]
         [:path {:class "stroke"
                 :d (path [(extended i1 c1) c1 m c2 (extended i2 c2)])}]]))))

(defmethod render :hyperbola [_ emit {:keys [f1 f2 k]}]
  (let [metric #(geo/abs (- (dist % f1) (dist % f2)))
        d (metric k)
        r (-> (dist f1 f2) (- d) (/ 2))
        eq #(geo/eq? d (metric %))
        hyp #(->> (cardinal % 5)
               (filter eq)
               (apply sweep %))]
    [:g {:class "hyperbola"}
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
                        [:path {:class "stroke join"
                                :d (path exs)}]
                        (map hyp exs))))]
         (list (wing f1 f2) (wing f2 f1))))]))

(defmethod render :mindist [_ emit {:keys [points]}]
  [:g {:class "mindist"}
   (if (even? (count points))
     (let [[m1 m2] (geo/middle-2 points)
           {m1x :x m1y :y} m1
           {m2x :x m2y :y} m2
           m (midpoint m1 m2)]
       (list
         [:path {:class "relationship"
                 :d (apply str (map #(path [m %]) points))}]
         [:path {:class "area"
                 :d (path [{:x m1x :y m1y}
                           {:x m1x :y m2y}
                           {:x m2x :y m2y}
                           {:x m2x :y m1y}
                           {:x m1x :y m1y}])}]))
     (let [{:keys [x y]} (geo/middle points)]
       (list
         [:path {:class "relationship"
                 :d (apply str (map #(path [{:x x :y y} %]) points))}]
         [:circle {:class "point"
                   :cx x :cy y :r 5}])))])
