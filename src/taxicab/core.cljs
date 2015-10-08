(ns taxicab.core
  (:require-macros [cljs.core.async.macros :refer [go]]
                   [taxicab.macros :refer [spy]])
  (:require [cljs.core.async :as async :refer [chan put! <! timeout]]
            [cljs.core.match :refer-macros [match]]
            [vdom.elm :refer [foldp render!]]
            [taxicab.tools :as tools]
            [taxicab.ui :as ui]))

(enable-console-print!)

(defn color? [{t :type}]
  (not (contains? #{:point :line :line-segment :ray :parallel} t)))

(defn add-shape [{[color] :colors :as model} {:keys [id] :as shape}]
  (cond
    (nil? shape)
    model

    (and (nil? (get-in model [:shapes id])) (color? shape))
    (-> model
      (update :colors rest)
      (assoc-in [:shapes id] (assoc shape :color color)))

    (get-in model [:shapes id])
    (let [c (get-in model [:shapes id :color])]
      (assoc-in model [:shapes id] (assoc shape :color c)))

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
  (js/saveSvgAsPng (ui/workspace) "taxicab.png" (clj->js {:scale scale})))

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

(render! (async/map #(ui/main % actions) [models]) js/document.body)

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
