/*global define, amplify*/
define([
    'views/base/view',
    'fx-ds/start',
    'fx-filter/start',
    'text!templates/analysis/analysis.hbs',
    //'text!templates/analysis/topics.hbs',
    'i18n!nls/analysis',
    //'i18n!nls/topics',
    'config/Events',
    'amplify'
], function (View, Dashboard, Filter, template, i18nLabels, E) {

    'use strict';

    var s = {
        DASHBOARD_CONTAINER: '#dashboard-container',
        FILTER_CONTAINER: "#filter-container"
    };

    var AnalysisView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'analysis',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {menu: 'analysis'});

            this._initComponents();

            this._renderComponents();

        },

        _initComponents: function () {

            this.fludeDashboard = new Dashboard({

                //Ignored if layout = injected
                container: s.DASHBOARD_CONTAINER,

                //layout : "fluid",
                layout: "injected"
            });

            this.filter = new Filter();

/*
 this.filter.init({
                container: s.FILTER_CONTAINER,
                plugin_prefix: '',
                layout: 'fluidGrid'
                //  plugin_subdir: 'FENIX-plugin'
            });
*/

        },

        _renderComponents: function () {


            this._renderDashboard();

            //this._renderFilter();
        },

        _renderDashboard: function () {

            this.fludeDashboard.render({
                //data cube's uid
                uid: "FLUDE_TOPIC_1",

                //data base filter
                filter: [],

                //bridge configuration
                bridge: {

                    type: "d3p"

                },

                /*
                 * in case bridge is WDS this is the cube metadata.
                 * if bridge is D3P this is ignored
                 * */
                metadata: {},

                items: [
                    {
                        id: 'timeseries-chart-example',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#test-1",
                        config: {
                            container: "#test-1",
                            adapter: {
                                type: "standard",
                                xDimensions: 'time',
                                yDimensions: 'Unit',
                                valueDimensions: 'value',
                                seriesDimensions: []
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        crosshairs: "mixed",
                                        shared: true
                                    }
                                }
                            }
                        },
                        filter: [
                            {
                                "name":"simpleFilter",
                                "parameters":{
                                    "filter":{
                                        "rows":{
                                            "year":{
                                                "time":[
                                                    {
                                                        "from":2015,
                                                        "to":2015
                                                    }
                                                ]
                                            },
                                            "indicator":{
                                                "codes":[
                                                    {
                                                        "uid":"FLUDE_INDICATORS",
                                                        "codes":[
                                                            "Forest"
                                                        ]
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {
                        id: 'fx-table-example',
                        type: 'table',
                        class: "fx-table-chart",
                        //needed if layout = injected
                        container: "#test-3",
                        config: {
                            container: "#test-3"
                        },
                        filter: [
                            {
                                "name":"simpleFilter",
                                "parameters":{
                                    "filter":{
                                        "rows":{
                                            "year":{
                                                "time":[
                                                    {
                                                        "from":2015,
                                                        "to":2015
                                                    }
                                                ]
                                            },
                                            "indicator":{
                                                "codes":[
                                                    {
                                                        "uid":"FLUDE_INDICATORS",
                                                        "codes":[
                                                            "Forest"
                                                        ]
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        ]

                    },
                    {
                        id: 'map-chart-example',
                        type: 'map',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#test-2",
                        config: {
                            container: "#test-2"
                        },
                        filter: [
                            {
                                "name":"simpleFilter",
                                "parameters":{
                                    "filter":{
                                        "rows":{
                                            "year":{
                                                "time":[
                                                    {
                                                        "from":2015,
                                                        "to":2015
                                                    }
                                                ]
                                            },
                                            "indicator":{
                                                "codes":[
                                                    {
                                                        "uid":"FLUDE_INDICATORS",
                                                        "codes":[
                                                            "Forest"
                                                        ]
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        ]

                    },
                    {
                        id: 'pie-chart-example',
                        type: 'chart',
                        class: "fx-pie-chart",
                        //needed if layout = injected
                        container: "#test-4",
                        config: {
                            container: "#test-4",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['geo']
                            },
                            template: {},
                            creator: {}
                        },
                        filter: [
                            {
                                "name":"simpleFilter",
                                "parameters":{
                                    "filter":{
                                        "rows":{
                                            "year":{
                                                "time":[
                                                    {
                                                        "from":2015,
                                                        "to":2015
                                                    }
                                                ]
                                            },
                                            "indicator":{
                                                "codes":[
                                                    {
                                                        "uid":"FLUDE_INDICATORS",
                                                        "codes":[
                                                            "Forest"
                                                        ]
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        ]

                    }

                ]
            });

        },

        _renderFilter: function () {
            //FENIX List Example : 1 component "sourceType": "timeList", 1 component "sourceType": "period"
            var configuration = [
                {
                    "containerType": "fluidGridBaseContainer",
                    "title": "List Test Timelist",
                    "components": [
                        {
                            "componentType": "timeList-FENIX",
                            "lang": "EN",
                            "title": {
                                "EN": "Time List For Fenix",
                                "ES": "Time List For Fenix",
                                "DE": "Time List For Fenix",
                                "FR": "Time List For Fenix"
                            },
                            "name": "timeListForFenix",
                            "component": {
                                "source": {
                                    "uid": "GAUL_ReferenceArea",
                                    "version": "1.0"
                                },
                                "sourceType": "timeList",
                                "defaultsource": [1986, 2015, 1997, 2000, 2002, 2003, 2005, 2007, 2010]
                            }
                        }
                    ]
                },
                {
                    "containerType": "fluidGridBaseContainer",
                    "title": "List Test Period",
                    "components": [
                        {
                            "componentType": "timeList-FENIX",
                            "lang": "EN",
                            "title": {
                                "EN": "Time List For Fenix",
                                "ES": "Time List For Fenix",
                                "DE": "Time List For Fenix",
                                "FR": "Time List For Fenix"
                            },
                            "name": "periodForFenix",
                            "component": {
                                "sourceType": "period",
                                "defaultsource": [{"from": 1983, "to": 1994}, {"from": 1996, "to": 1998}, {
                                    "from": 2002,
                                    "to": 2005
                                }, {"from": 2007, "to": 2011}]
                            }
                        }
                    ]
                }
            ];
            var adapterMap = {};

            this.filter.add(configuration, adapterMap);

        }

    });

    return AnalysisView;
});
