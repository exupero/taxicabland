(ns taxicab.ui
  (:require-macros [taxicab.macros :refer [spy]])
  (:require [clojure.walk :as walk]
            [cljs.core.async :as async :refer [put!]]
            [taxicab.tools :as tools]
            [taxicab.geo :as geo :refer [extended]]
            [taxicab.shapes :as shapes]
            [taxicab.events :refer [without-propagation]]))

(defn cursor [svg x y]
  (let [c (.createSVGPoint svg)]
    (aset c "x" x)
    (aset c "y" y)
    (.matrixTransform c (-> svg .getScreenCTM .inverse))))

(defn size [el]
  (let [box (.getBoundingClientRect el)]
    [(.-width box) (.-height box)]))

(def workspace #(.getElementById js/document "workspace"))

(defn pos [e]
  (cursor (workspace) (.-clientX e) (.-clientY e)))

(def loc-xy (juxt #(.-x %) #(.-y %)))

(defn point? [{t :type}]
  (= :point t))

(defn tools-bar [tool-seq curr-tool emit]
  [:div {:id "tools"}
   (for [{text :name :keys [id] :as this-tool} tool-seq
         :let [selected? (-> curr-tool :id (= id))]]
     [:div {:className "tool-container"}
      [:button {:id (str "tool-" (name id))
                :className (str "tool" (when selected? " selected"))
                :onclick #(emit [:tool this-tool])}
       text]
      (when selected?
        [:div {:className "description"}
         (:description this-tool)])])])

(defn options [{:keys [history anti-history show-labels? grid-spacing]} emit]
  [:div {:id "options"}
   (if (seq history) [:button {:onclick #(emit :undo)} "Undo"])
   (if (seq anti-history) [:button {:onclick #(emit :redo)} "Redo"])
   (if show-labels?
     [:button {:onclick #(emit [:show-labels false])} "Hide labels"]
     [:button {:onclick #(emit [:show-labels true])} "Show labels"])
   [:button {:onclick #(emit :save-image)} "Save Image"]
   [:button {:onclick #(emit :clear)} "Clear Workspace"]
   [:div {:className "widget"}
    "Grid"
    [:input {:type "range" :min 0 :max 40 :step 5 :value grid-spacing
             :onmousemove #(this-as input (emit [:grid (int (.-value input))]))}]]])

(defn grid [space spacing]
  (when (and space (< 2 spacing))
    (let [[w h] (size space)]
      [:g {:class "grid"}
       (for [i (range 0 w spacing)]
         [:line {:x1 i :x2 i :y2 "100%"}])
       (for [i (range 0 h spacing)]
         [:line {:x2 "100%" :y1 i :y2 i}])])))

(defn actualize [shapes {:keys [id] :as shape}]
  (let [actual #(if (symbol? %) (dissoc (shapes %) :id) %)]
    (as-> shape x
      (dissoc x :id)
      (walk/postwalk actual x)
      (assoc x :id id))))

(defn pair [[x y]]
  (str x "," y))

(def xy (juxt :x :y))

(defn append [x xs]
  (concat xs [x]))

(defn path
  ([pts]
   (when (seq pts)
     (->> pts
       (map xy)
       (map pair)
       (interpose "L")
       (apply str "M"))))
  ([pts close?]
   (when (seq pts)
     (->> pts
       (map xy)
       (map pair)
       (interpose "L")
       (append "Z")
       (apply str "M")))))

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

(defn shape->svg [{:keys [points] :as shape} {t :type :keys [id color selected?]} emit]
  (let [select-this (without-propagation #(emit [:select id]))]
    [:g {:class (str (if (not= :point t) "shape") " "
                     (name t) " "
                     (if color (name color)))}
     (for [{:keys [x y label]} points]
       (stroked [:text {:class "label" :x x :y y :dy -10} label]))
     (for [a (shape :areas)]
       [:path {:class "area" :d (path a)
               :onmousedown select-this}])
     (for [s (shape :sweeps)]
       (assoc-in (apply sweep (flatten s)) [1 :onmousedown] select-this))
     (for [s (shape :strokes)]
       [:path {:class "stroke" :d (path s)
               :onmousedown select-this}])
     (for [l (shape :loops)]
       [:path {:class "stroke" :d (path l true)
               :onmousedown select-this}])
     (for [{:keys [x y draggable?]} points
           :let [events (if draggable?
                          {:onmousedown (without-propagation #(emit [:hold id]))
                           :onmouseup #(emit :release)}
                          {:onmousedown (without-propagation #(emit [:select id]))})]]
       [:circle (merge events {:class "area" :r 5 :cx x :cy y})])
     (when selected?
       (for [{:keys [x y role] :as p} (shape :defining-points)]
         (list
           (stroked [:text {:class "role" :x x :y y :dy 21} role]))))]))

(defn shape->guides [shape _ _]
  (for [g (shape :guides)]
    [:path {:class "guide" :d (path g)}]))

(defn shape->point-highlight [shape {t :type :keys [color]} _]
  [:g {:class (str "highlight " (name t))}
   (for [{:keys [x y role] :as p} (shape :defining-points)]
     [:circle {:class "point" :r 7 :cx x :cy y}])])

(defn main [{:keys [shapes holding selected tool grid-spacing show-labels?] :as model} actions]
  (let [emit (partial put! actions)]
    [:main {:className (if show-labels? "labeled")}
     [:section {:className "sidebar"}
      [:div {:className "inside"}
       [:h1 {} "Taxicabland"]
       [:a {:id "explain" :href "https://en.wikipedia.org/wiki/Taxicab_geometry"} "What is taxicab geometry?"]
       [:div {:id "tip"} "Select shapes to see what points define them."]
       (tools-bar tools/tools tool emit)
       (options model emit)
       [:a {:id "source" :href "https://github.com/exupero/taxicabland"} "GitHub"]]]
     [:section {:className "main"}
      [:div {:className "maximize"}
       [:svg {:id "workspace"
              :onmousemove #(when holding (emit [:move (pos %)]))
              :onmouseup #(emit :release)
              :onmousedown #(emit [:add-point (loc-xy (pos %))])}
        (grid (workspace) grid-spacing)
        (let [shape (fn [sh]
                      (when (sh :id)
                        (shape->svg (shapes/shape sh) sh emit)))
              shapes (map (partial actualize shapes) (vals shapes))]
          (list
            (map shape (->> shapes (remove point?) (remove :selected?)))
            (when-let [sh (first (filter :selected? shapes))]
              (when (sh :type)
                (let [sel (shapes/shape sh)]
                  (list
                    (shape->guides sel sh emit)
                    (shape->svg sel sh emit)
                    (shape->point-highlight sel sh emit)))))
            (map shape (filter point? shapes))))]]]]))
