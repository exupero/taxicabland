(ns taxicab.tools
  (:require-macros [taxicab.macros :refer [spy]]))

(enable-console-print!)

(defn shape [t attrs]
  (merge attrs {:id (gensym (name t)) :type t}))

(defn point [p]
  [point])

(defn multipoint
  ([t ks]
   (first (multipoint t ks [])))
  ([t ks ps]
   (if (= (count ks) (count ps))
     [(multipoint t ks) (shape t (zipmap ks ps))]
     [(fn [p] (multipoint t ks (conj ps p)))])))

(defn mindist
  ([p] (mindist (gensym "mindist") #{p}))
  ([id ps]
   [(fn [p] (mindist id (conj ps p)))
    {:id id :type :mindist :points ps}]))

(def ordinals ["1st" "2nd" "3rd"])

(defn usage [& pts]
  [:ul {}
   (for [[n p] (map vector ordinals pts)]
     [:li {}
      [:strong {} (str n " point")]
      " — "
      p])])

(def tools
  [{:id :point
    :name "Point"
    :handler point
    :description
    [:p {} "Create a point."]}

   {:id :line
    :name "Line"
    :handler (multipoint :line [:p1 :p2])
    :description
    (list
      [:p {} "Create a line."]
      (usage
         "the start of the line"
         "the end of the line")
      [:p {} "A line is the collinear set of points through two points."])}

   {:id :line-segment
    :name "Line Segment"
    :handler (multipoint :line-segment [:p1 :p2])
    :description
    (list
      [:p {} "Create a line segment."]
      (usage
        "the start of the line segment"
        "the end of the line segment")
      [:p {} "A line segment is the set of points between two points."])}

   {:id :ray
    :name "Ray"
    :handler (multipoint :ray [:p1 :p2])
    :description
    (list
      [:p {} "Create a ray."]
      (usage
        "the start of the ray"
        "the line through which the ray passes"))}

   {:id :parallel
    :name "Parallel"
    :handler (multipoint :parallel [:p1 :p2 :k])
    :description
    (list
      [:p {} "Create a line parallel to the line between two points."]
      (usage
        "a point on the line"
        "another point on the line"
        "a point through which the parallel line passes"))}

   {:id :midset
    :name "Midset"
    :handler (multipoint :midset [:p1 :p2])
    :description
    (list
      [:p {} "Create a midset."]
      (usage
        "the first point"
        "the second point")
      [:p {} "A midset is the set of points equidistant from two points."])}

   {:id :perpendicular
    :name "Perpendicular"
    :handler (multipoint :perpendicular [:p1 :p2 :k])
    :description
    (list
      [:p {} "Create a perpendicular."]
      (usage
        "a point on the line"
        "another point on the line"
        "a point through which the perpendicular passes")
      [:p {} "A perpendicular is the shortest line between a point and a line, extended indefinitely."])}

   {:id :bisect
    :name "Bisect"
    :handler (multipoint :bisect [:r1 :v :r2])
    :description
    (list
      [:p {} "Show the line that bisects an angle."]
      (usage
        "a point on the first ray"
        "the vertex of the rays"
        "a point on the second ray")) }

   {:id :circle
    :name "Circle"
    :handler (multipoint :circle [:c :r])
    :description
    (list
      [:p {} "Create a circle."]
      (usage
        "the center of the circle"
        "the point through which the circumference passes")
      [:p {} "A circle is the set of points a constant distance from another point."])}

   {:id :ellipse
    :name "Ellipse"
    :handler (multipoint :ellipse [:f1 :f2 :k])
    :description
    (list
      [:p {} "Create an ellipse."]
      (usage
        "one focus"
        "another focus"
        "a point through which the circumference passes")
      [:p {} "An ellipse is the set of points a constant total distance from two points."])}

   {:id :parabola
    :name "Parabola"
    :handler (multipoint :parabola [:f :d1 :d2])
    :description
    (list
      [:p {} "Create a parabola."]
      (usage
        "the focus"
        "a point on the directrix"
        "another point on the directrix")
      [:p {} "A parabola is the set of points equidistant from a point and a line."])}

   {:id :hyperbola
    :name "Hyperbola"
    :handler (multipoint :hyperbola [:f1 :f2 :k])
    :description
    (list
      [:p {} "Create a hyperbola."]
      (usage
        "a focus"
        "another focus"
        "a point that defines the ratio"))}

   {:id :mindist
    :name "Minimum Distance"
    :handler mindist
    :description
    (list
      [:p {} "Create an area with minimum distance from multiple points."]
      [:p {} "A minimum distance is the area that's the least total distance from multiple points."])}])
