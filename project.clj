(defproject taxicab "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/clojurescript "0.0-3195" :exclusions [org.apache.ant/ant]]
                 [org.clojure/core.match  "0.3.0-alpha4"]
                 [org.clojure/core.async "0.1.346.0-17112a-alpha"]
                 [cljsjs/virtual-dom "0.1.0-0"]
                 [vdom "0.1.0-SNAPSHOT"]]
  :plugins [[lein-cljsbuild "0.3.2"]
            [lein-figwheel  "0.3.7"]]
  :cljsbuild {:builds {:dev {:source-paths ["src"]
                             :incremental true
                             :jar true
                             :assert true
                             :figwheel {:on-jsload "taxicab.core/figwheel-reload"}
                             :compiler {:main taxicab.core
                                        :output-to "out/js/taxicab-dev.js"
                                        :output-dir "out/js"
                                        :warnings true
                                        :elide-asserts true
                                        :optimizations :none
                                        :source-map "out/js/taxicab-dev.js.map"
                                        :pretty-print true
                                        :output-wrapper false}}
                       :prod {:source-paths ["src"]
                              :incremental true
                              :jar true
                              :assert true
                              :compiler {:output-to "out/js/taxicab.js"
                                         :warnings true
                                         :elide-asserts true
                                         :externs ["externs/vdom.js" "externs/svg.js"]
                                         :optimizations :advanced
                                         :pretty-print false
                                         :output-wrapper false}}}})
