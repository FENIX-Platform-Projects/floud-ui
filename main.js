/*global require*/

var projectRoot = "//fenixrepo.fao.org/cdn/test/flude";


require.config({
    config: {
        text: {
            useXhr: function (url, protocol, hostname, port) {
                return true;
            }
        }
    },
    paths : {
        //compilerPaths : projectRoot + '/submodules/fenix-ui-common/js/Compiler',
        compilerPaths : './submodules/fenix-ui-common/js/Compiler',
        commonPaths : projectRoot + '/submodules/fenix-ui-common/js/paths',
        menuPaths: projectRoot + '/submodules/fenix-ui-menu/js/paths',
        dashboardPaths :projectRoot + '/submodules/fenix-ui-dashboard/src/js/paths',
        chartPaths :projectRoot + '/submodules/fenix-ui-chart-creator/src/js/paths',
        mapPaths :projectRoot + '/submodules/fenix-ui-map-creator/src/js/paths',
        tablePaths : projectRoot + '/submodules/fenix-ui-table-creator/src/js/paths',
        filterPaths :projectRoot + '/submodules/fenix-ui-filter/src/js/paths'
    }
});

require([
    "compilerPaths",
    "commonPaths",
    "menuPaths",
    "dashboardPaths",
    "chartPaths",
    "mapPaths",
    "tablePaths",
    "filterPaths"
], function (Compiler, Common, Menu, Dashboard, Chart, Map, Table, Filter) {

    'use strict';

    var submodules_path = projectRoot + '/submodules';

    var commonConfig = Common;
    commonConfig.baseUrl = submodules_path + '/fenix-ui-common/js';

    var menuConfig = Menu;
    menuConfig.baseUrl = submodules_path + '/fenix-ui-menu/js';

    var dashboardConfig = Dashboard;
    dashboardConfig.baseUrl = submodules_path + '/fenix-ui-dashboard/src/js';

    var chartConfig = Chart;
    chartConfig.baseUrl = submodules_path + '/fenix-ui-chart-creator/src/js';

    var mapConfig = Map;
    mapConfig.baseUrl = submodules_path + '/fenix-ui-map-creator/src/js';

    var tableConfig = Table;
    tableConfig.baseUrl = submodules_path + '/fenix-ui-table-creator/src/js';

    var filterConfig = Filter;
    filterConfig.baseUrl = submodules_path + '/fenix-ui-filter/';

    Compiler.resolve([commonConfig, menuConfig, dashboardConfig, chartConfig, tableConfig, mapConfig, filterConfig],
        {
            placeholders: {
                "FENIX_CDN": "//fenixrepo.fao.org/cdn"
                //"FENIX_CDN": "http://lprapp16.fao.org/external/fenixrepo/cdn"
            },

            config: {

                //Set the config for the i18n
                i18n: {
                    locale: 'en'
                },

                // The path where your JavaScripts are located
                baseUrl: projectRoot + '/src/js',

                // Specify the paths of vendor libraries
                paths: {
                    bootstrap: "{FENIX_CDN}/js/bootstrap/3.3.4/js/bootstrap.min",
                    underscore: "{FENIX_CDN}/js/underscore/1.7.0/underscore.min",
                    backbone: "{FENIX_CDN}/js/backbone/1.1.2/backbone.min",
                    handlebars: "{FENIX_CDN}/js/handlebars/2.0.0/handlebars",
                    chaplin: "{FENIX_CDN}/js/chaplin/1.0.1/chaplin.min",
                    domReady: "{FENIX_CDN}/js/requirejs/plugins/domready/2.0.1/domReady",
                    i18n: "{FENIX_CDN}/js/requirejs/plugins/i18n/2.0.4/i18n",
                    text: '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',
                    rsvp: '{FENIX_CDN}/js/rsvp/3.0.17/rsvp',
                    select2 : '{FENIX_CDN}/js/select2/3.5.4/select2.min',

                    amplify: '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',

                    'fx-c-c/config/creators/highcharts_template' : projectRoot + '/config/submodules/fx-chart/highcharts_template',

                    'fx-ds/config/config' : projectRoot + "/config/submodules/fx-dashboard/Config",

                    'fenix-ui-map' : projectRoot + '/submodules/fenix-ui-map/dist/fenix-ui-map.src',
                    'fenix-ui-map-config' : projectRoot + '/config/submodules/fx-map/Config' ,

                    'fx-m-c/config/config' : projectRoot + '/config/submodules/fx-chart-creator/Config' ,

                    'fx-filter/config/config' : projectRoot + '/config/submodules/fx-filter/Config' ,

                    nls: projectRoot + "/i18n",
                    config: projectRoot + "/config",
                    json: projectRoot + "/json",

                    'fx-common/config/auth_users' :  projectRoot + '/config/auth_users.json'
                },

                // Underscore and Backbone are not AMD-capable per default,
                // so we need to use the AMD wrapping of RequireJS
                shim: {
                    bootstrap: {
                        deps: ["jquery"]
                    },
                    select2: {
                        deps: ["jquery"]
                    },
                    underscore: {
                        exports: '_'
                    },
                    backbone: {
                        deps: ['underscore', 'jquery'],
                        exports: 'Backbone'
                    },
                    handlebars: {
                        exports: 'Handlebars'
                    }
                }
                // For easier development, disable browser caching
                // Of course, this should be removed in a production environment
                //, urlArgs: 'bust=' +  (new Date()).getTime()
            }
        });

    console.log(requirejs.s.contexts)

    // Bootstrap the application
    require([
        'application',
        'routes',
        'config/Config',
        'domReady!'
    ], function (Application, routes, C) {

        var app = new Application({
            routes: routes,
            controllerSuffix: C.CHAPLINJS_CONTROLLER_SUFFIX,
            root: C.CHAPLINJS_PROJECT_ROOT,
            pushState: C.CHAPLINJS_PUSH_STATE,
            scrollTo: C.CHAPLINJS_SCROLL_TO
        });
    });
});