(defproject taxicab "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.11.1"]
                 [org.clojure/clojurescript "1.11.60" :exclusions [org.apache.ant/ant]]
                 [org.clojure/core.match "0.3.0-alpha4"]
                 [org.clojure/core.async "0.1.346.0-17112a-alpha"]
                 [vdom "0.1.1-SNAPSHOT"]]
  :plugins [[lein-cljsbuild "1.1.8"]
            [lein-figwheel "0.4.0"]]
  :cljsbuild {:builds {:dev {:source-paths ["src"]
                             :incremental true
                             :jar true
                             :assert true
                             :figwheel {:on-jsload "taxicab.core/figwheel-reload"}
                             :compiler {:main "taxicab.core"
                                        :output-to "resources/public/js-dev/taxicab.js"
                                        :output-dir "resources/public/js-dev"
                                        :asset-path "js-dev"
                                        :warnings true
                                        :elide-asserts true
                                        :optimizations :none
                                        :source-map true
                                        :pretty-print true
                                        :output-wrapper false}}
                       :prod {:source-paths ["src"]
                              :incremental true
                              :jar true
                              :assert true
                              :compiler {:output-to "resources/public/js/taxicab.js"
                                         :warnings true
                                         :elide-asserts true
                                         :externs ["externs/svg.js"]
                                         :optimizations :advanced
                                         :pretty-print false
                                         :output-wrapper false}}}}
  :figwheel {:css-dirs ["resources/public/css"]})
