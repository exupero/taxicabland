(ns taxicab.events)

(defn without-propagation [f]
  (fn [evt]
    (.stopPropagation evt)
    (f)))
