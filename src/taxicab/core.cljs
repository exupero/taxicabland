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

(def xy (juxt #(.-x %) #(.-y %)))

(defn point? [{t :type}]
  (= :point t))

(defn kernel [shape]
  (dissoc shape :id :type))

(defn actualize [shapes {:keys [id] :as shape}]
  (let [core (walk/postwalk
               #(if (symbol? %)
                  (kernel (shapes %))
                  %)
               (kernel shape))]
    (assoc core :id id)))

(defn shapify [sh color]
  (update-in sh [1 :class] str " shape " (if color (name color) "")))

(defn ui [actions]
  (let [emit (partial put! actions)]
    (fn [{:keys [shapes holding history anti-history tool grid-spacing show-labels?]}]
      [:main {:className (if show-labels? "labeled")}
       [:section {:className "sidebar"}
        [:div {:className "inside"}
         [:h1 {} "Taxicabland"]
         [:a {:id "explain" :href "https://en.wikipedia.org/wiki/Taxicab_geometry"} "What is taxicab geometry?"]
         [:div {:id "tip"} "Drag points with the Point tool."]
         [:div {:id "tools"}
          (for [{text :name :keys [id] :as a-tool} tools/tools
                :let [selected? (-> tool :id (= id))]]
            [:div {:className "tool-container"}
             [:button {:id (str "tool-" (name id))
                       :className (str "tool" (when selected? " selected"))
                       :onclick #(emit [:tool a-tool])}
              text]
             (when selected?
               [:div {:className "description"}
                (:description a-tool)])])]
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
                    :onmousemove #(this-as input (put! actions [:grid (int (.-value input))]))}]]]]]
       [:section {:className "main"}
        [:div {:className "maximize"}
         [:svg {:id "workspace"
                :onmousemove #(when holding (emit [:move (pos %)]))
                :onmouseup #(emit :release)
                :onmousedown #(emit [:add-point (xy (pos %))])}
          (when-let [svg (.getElementById js/document "workspace")]
            (when (< 2 grid-spacing)
              (let [[w h] (size svg)]
                [:g {}
                 (for [i (range 0 w grid-spacing)]
                   [:line {:class "grid" :x1 i :x2 i :y2 "100%"}])
                 (for [i (range 0 h grid-spacing)]
                   [:line {:class "grid" :x2 "100%" :y1 i :y2 i}])])))
          (for [{t :type :as sh} (remove point? (vals shapes))]
            (as-> sh x
              (actualize shapes x)
              (shapes/render t emit x)
              (shapify x (:color sh))))
          (for [sh (vals shapes)
                :when (point? sh)]
            (shapes/render :point emit sh))]]
        [:a {:href "https://github.com/exupero/taxicab-geometry"}
         [:img {:style {:position "absolute" :top 0 :right 0 :border 0}
                :src "https://camo.githubusercontent.com/a6677b08c955af8400f44c6298f40e7d19cc5b2d/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677261795f3664366436642e706e67"
                :alt "Fork me on GitHub"
                :attributes {:data-canonical-src "https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png"}}]]]])))

(defn color? [{t :type}]
  (not (contains? #{:point :line :line-segment :ray :parallel} t)))

(defn add-shape [model {:keys [id] :as shape}]
  (cond
    (nil? shape)
    model

    (and (nil? (get-in model [:shapes id])) (color? shape))
    (assoc-in (update model :colors rest) [:shapes id]
              (assoc shape :color (first (model :colors))))

    :else
    (assoc-in model [:shapes id] shape)))

(defn apply-tool [{{tool :handler} :tool :as model} point]
  (let [[t sh] (tool point)]
    (-> model
      (assoc-in [:tool :handler] t)
      (add-shape sh))))

(defn reposition [pt x y]
  (assoc pt :x x :y y))

(defn capture [scale]
  (js/saveSvgAsPng (workspace) "taxicab.png" (clj->js {:scale scale})))

(defn history-snapshot [m]
  (select-keys m [:shapes]))

(defn push-history [m]
  (update m :history conj (history-snapshot m)))

(defn shift-history [m from to]
  (let [hist (from m)
        snap (history-snapshot m)]
    (-> m
      (merge (peek hist))
      (assoc from (pop hist))
      (update to conj snap))))

(defn snap [spacing]
  (if (< spacing 2)
    identity
    #(as-> % x
       (/ x spacing)
       (.round js/Math x)
       (* x spacing))))

(defn map-vals [m f]
  (zipmap (keys m) (map f (vals m))))

(defn clear-selection [{:keys [selected] :as model}]
  (if selected
    (-> model
      (update-in [:shapes selected] dissoc :selected?)
      (assoc :selected nil))
    model))

(defn toggle-selection [model id selected]
  (if (not= id selected)
    (-> model
      clear-selection
      (assoc :selected id)
      (assoc-in [:shapes id :selected?] true))
    model))

(defn add-point [model x y]
  (let [id (gensym "point")
        sn (snap (:grid-spacing model))]
    (-> model
      push-history
      clear-selection
      (add-shape {:id id
                  :type :point
                  :label (first (model :labels))
                  :x (sn x)
                  :y (sn y)})
      (assoc :holding id)
      (update :labels rest)
      (apply-tool id))))

(defn step [model action]
  (match action
    :no-op model
    :clear (-> model
             push-history
             (assoc :shapes {}))
    :save-image (do (capture 3) model)
    :undo (shift-history model :history :anti-history)
    :redo (shift-history model :anti-history :history)
    [:show-labels v] (assoc model :show-labels? v)
    [:grid size] (assoc model :grid-spacing size)
    [:tool tool] (assoc model :tool tool)
    [:add-point [x y]] (add-point model x y)
    [:hold id] (-> model
                 push-history
                 (assoc :holding id)
                 (apply-tool id))
    [:move loc] (if-let [holding (:holding model)]
                  (let [sn (snap (:grid-spacing model))]
                    (update-in model [:shapes holding] reposition
                               (sn (.-x loc))
                               (sn (.-y loc))))
                  model)
    :release (assoc model :holding nil)
    [:release id] (let [current (model :selected)]
                    (-> model
                      (assoc :holding nil)
                      clear-selection
                      (toggle-selection id current)))
    [:select id] (let [current (model :selected)]
                    (-> model
                    clear-selection
                    (toggle-selection id current)))))

(def initial-model
  {:shapes {}
   :holding nil
   :selected nil
   :tool (first tools/tools)
   :colors (cycle (map #(keyword (str "color" %)) (range 1 10)))
   :labels (cycle "ABCDEFGHIJKLMNOPQRSTUVWXYZ")
   :show-labels? true
   :grid-spacing 15
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
