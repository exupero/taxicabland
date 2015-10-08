(ns taxicab.ui
  (:require-macros [taxicab.macros :refer [spy]])
  (:require [clojure.walk :as walk]
            [cljs.core.async :as async :refer [put!]]
            [taxicab.tools :as tools]
            [taxicab.shapes :as shapes]))

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

(def xy (juxt #(.-x %) #(.-y %)))

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

(defn shape->svg [{t :type :keys [color] :as sh}]
  [:g {:class (str (if (= :point t) "point" "shape") " "
                   (name t) " "
                   (if color (name color)))}
   (shapes/shape sh)])

(defn main [{:keys [shapes holding selected tool grid-spacing show-labels?] :as model} actions]
  (let [emit (partial put! actions)]
    [:main {:className (if show-labels? "labeled")}
     [:section {:className "sidebar"}
      [:div {:className "inside"}
       [:h1 {} "Taxicabland"]
       [:a {:id "explain" :href "https://en.wikipedia.org/wiki/Taxicab_geometry"} "What is taxicab geometry?"]
       [:div {:id "tip"} "Drag points with the Point tool."]
       (tools-bar tools/tools tool emit)
       (options model emit)]]
     [:section {:className "main"}
      [:div {:className "maximize"}
       [:svg {:id "workspace"
              :onmousemove #(when holding (emit [:move (pos %)]))
              :onmouseup #(emit :release)
              :onmousedown #(emit [:add-point (xy (pos %))])}
        (grid (workspace) grid-spacing)
        (let [selection (actualize shapes (shapes selected))
              shapes (map (partial actualize shapes) (vals shapes))
              shape (fn [{t :type :keys [id color] :as sh}]
                      (if id
                        (shape->svg sh)))]
          (list
            (map shape (->> shapes (remove point?) (remove :selected?)))
            (shape selection)
            (map shape (filter point? shapes))))]]]]))
