(ns taxicab.core
  (:require-macros [cljs.core.async.macros :refer [go]]
                   [taxicab.macros :refer [spy]])
  (:require [cljs.core.async :as async :refer [chan put! <! timeout]]
            [cljs.core.match :refer-macros [match]]
            [clojure.walk :as walk]
            [vdom.elm :refer [foldp render!]]
            [taxicab.tools :as tools]
            [taxicab.shapes :as shapes]))

(enable-console-print!)

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

(defn point? [{t :type}]
  (= :point t))

(defn kernel [shape]
  (dissoc shape :id :type))

(defn actualize [shapes shape]
  (walk/postwalk
    #(if (symbol? %)
       (kernel (shapes %))
       %)
    (kernel shape)))

(defn ui [actions]
  (let [emit (partial put! actions)]
    (fn [{:keys [shapes holding history anti-history relationships? tool]}]
      [:main {}
       [:section {:className "sidebar"}
        [:div {:className "inside"}
         [:a {:id "explain" :href "https://en.wikipedia.org/wiki/Taxicab_geometry"} "What is taxicab geometry?"]
         (for [{text :name :keys [id] :as a-tool} tools/tools
               :let [selected? (-> tool :id (= id))]]
           [:div {:className "tool-container"}
            [:button {:id (str "tool-" (name id))
                      :className (str "tool" (when selected? " selected"))
                      :onclick #(emit [:tool a-tool])}
             text]
            (when selected?
              [:div {:className "description"}
               (:description a-tool)])])
         [:hr]
         [:div {:id "meta"}
          (if relationships?
            [:button {:onclick #(emit :hide-relationships)} "Hide Relationships"]
            [:button {:onclick #(emit :show-relationships)} "Show Relationships"])
          [:button {:onclick #(emit :save-image)} "Save Image"]
          [:button {:onclick #(emit :clear)} "Clear Workspace"]
          (if (seq history) [:button {:onclick #(emit :undo)} "Undo"])
          (if (seq anti-history) [:button {:onclick #(emit :redo)} "Redo"])]]]
       [:section {:className "main"}
        [:div {:className "maximize"}
         [:svg {:id "workspace"
                :onmousemove #(when holding (emit [:move (pos %)]))
                :onmousedown #(emit [:add-point (pos %)])
                :attributes {:data-relationships relationships?}}
          (when-let [svg (.getElementById js/document "workspace")]
            (let [[w h] (size svg)
                  spacing 15]
              [:g {}
               (for [i (range 1 w spacing)]
                 [:line {:class "grid" :x1 i :x2 i :y2 "100%"}])
               (for [i (range 1 h spacing)]
                 [:line {:class "grid" :x2 "100%" :y1 i :y2 i}])]))
          (for [{t :type :as sh} (remove point? (vals shapes))]
            (shapes/render t emit (actualize shapes sh)))
          (for [sh (vals shapes)
                :when (point? sh)]
            (shapes/render :point emit sh))]]
        [:a {:href "https://github.com/exupero/taxicab-geometry"}
         [:img {:style {:position "absolute" :top 0 :right 0 :border 0}
                :src "https://camo.githubusercontent.com/a6677b08c955af8400f44c6298f40e7d19cc5b2d/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677261795f3664366436642e706e67"
                :alt "Fork me on GitHub"
                :attributes {:data-canonical-src "https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png"}}]]]])))

(defn add-shape [model {:keys [id] :as shape}]
  (if shape
    (assoc-in model [:shapes id] shape)
    model))

(defn apply-tool [{{tool :handler} :tool :as model} point]
  (let [[t sh] (tool point)]
    (-> model
      (assoc-in [:tool :handler] t)
      (add-shape sh))))

(defn reposition [pt x y]
  (assoc pt :x x :y y))

(defn snapshot [m]
  (select-keys m [:points :shapes]))

(defn push-history [m]
  (update m :history conj (snapshot m)))

(defn shift-history [m from to]
  (let [hist (from m)
        snap (snapshot m)]
    (-> m
      (merge (peek hist))
      (assoc from (pop hist))
      (update to conj snap))))

(defn step [model action]
  (match action
    :no-op model
    :clear (assoc model :points {} :shapes {})
    :show-relationships (assoc model :relationships? true)
    :hide-relationships (assoc model :relationships? false)
    :save-image (do
                  (js/saveSvgAsPng (workspace) "taxicab.png" (clj->js {:scale 3}))
                  model)
    :undo (shift-history model :history :anti-history)
    :redo (shift-history model :anti-history :history)
    [:tool tool] (assoc model :tool tool)
    [:add-point loc] (let [id (gensym "point")]
                       (-> model
                         push-history
                         (add-shape {:id id
                                     :type :point
                                     :x (.-x loc)
                                     :y (.-y loc)})
                         (assoc :holding id)
                         (apply-tool id)))
    [:hold id] (-> model
                 (assoc :holding id)
                 (apply-tool id))
    [:move loc] (if-let [holding (:holding model)]
                  (update-in model [:shapes holding] reposition (.-x loc) (.-y loc))
                  model)
    [:release id] (assoc model :holding nil)))

(def initial-model
  {:shapes {}
   :holding nil
   :relationships? false
   :tool (first tools/tools)
   :history []
   :anti-history []})

(defonce actions (chan))

(defonce models (foldp step initial-model actions))

(render! (async/map (ui actions) [models]) js/document.body)

(defonce setup
  (do
    (aset js/window "onresize" #(put! actions :no-op))
    (go
      ; Give DOM time to render and re-render once
      ; elements have actual dimensions.
      (<! (timeout 30))
      (put! actions :no-op))))

(defn figwheel-reload []
  (put! actions :no-op))
