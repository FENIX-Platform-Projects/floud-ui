/*global define*/

define(function () {

    'use strict';

    return {

        "FAOSTAT_QC": {

            download: {
                "target": "o_zip_one.zip"
            },

            filter: [
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "title": "Year",
                    "components": [
                        {
                            "type": "time",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Year"},
                            "name": "year",
                            config: {
                                "defaultsource": [
                                    {"value": "2015", "label": "2015", "selected": true},
                                    {"value": "2010", "label": "2010", "selected": false},
                                    {"value": "2005", "label": "2005", "selected": false},
                                    {"value": "2000", "label": "2000", "selected": false},
                                    {"value": "1990", "label": "1990", "selected": false}
                                ]
                            }
                        }
                    ]
                },
                {
                    "type": "distinct",
                    "uid": "FAOSTAT_QC",
                    "column": "country",
                    "containerType": "baseContainer",
                    "title": "Country",
                    "defaultCodes": ["33"],
                    "components": [
                        {
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Distinct"},
                            // name is the ID output in tehe filter getValues()
                            "name": "country",
                            "config": {
                                "defaultsource": []
                            }
                        }
                    ]
                },
                {
                    "type": "distinct",
                    "uid": "FAOSTAT_QC",
                    "column": "element",
                    "containerType": "baseContainer",
                    "title": "Element",
                    "defaultCodes": ["5312"],
                    "components": [
                        {
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Distinct"},
                            // name is the ID output in tehe filter getValues()
                            "name": "element",
                            "config": {
                                "defaultsource": []
                            }
                        }
                    ]
                },
                {
                    "type": "distinct",
                    "uid": "FAOSTAT_QC",
                    "column": "item",
                    "containerType": "baseContainer",
                    "title": "Item",
                    "defaultCodes": ["1717"],
                    "components": [
                        {
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Distinct"},
                            // name is the ID output in tehe filter getValues()
                            "name": "item",
                            "config": {
                                "defaultsource": []
                            }
                        }
                    ]
                },


            ],
            dashboard: {
                //data cube's uid
                uid: "FAOSTAT_QC",

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


                items:  [

                    {
                        id: 'faostat-QC-1',
                        type: 'map',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#faostat-QC-1",
                        config: {
                            container: "#faostat-QC-1",
                            leaflet: {
                                zoomControl: false,
                                attributionControl: true,
                                scrollWheelZoom: false
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['element', 'item', 'year'],
                        forbiddenValues: {
                            year: {time: [{from: 2015, to: 2015}]},
                            domain: {removeFilter: true}
                        },
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2013,
                                                    "to": 2013
                                                }
                                            ]
                                        },
                                        "element": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Elements",
                                                    "codes": [
                                                        "5312"
                                                    ]
                                                }
                                            ]
                                        },
                                        "item": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_FAOSTAT_ITEM",
                                                    "codes": [
                                                        "1717"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        ]
                    }

                ]

            }

        },

        "FAOSTAT_2": {
            filter: [],
            dashboard: {
                //data cube's uid
                uid: "FLUDE_TOPIC_2",

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
                        allowedFilter: ['year'],
                        filter: [
                            {
                                "name": "simpleFilter",
                                "parameters": {
                                    "filter": {
                                        "rows": {
                                            "year": {
                                                "time": [
                                                    {
                                                        "from": 2005,
                                                        "to": 2005
                                                    }
                                                ]
                                            },
                                            "indicator": {
                                                "codes": [
                                                    {
                                                        "uid": "FLUDE_INDICATORS",
                                                        "codes": [
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
                        allowedFilter: ['year'],
                        filter: [
                            {
                                "name": "simpleFilter",
                                "parameters": {
                                    "filter": {
                                        "rows": {
                                            "year": {
                                                "time": [
                                                    {
                                                        "from": 2015,
                                                        "to": 2015
                                                    }
                                                ]
                                            },
                                            "indicator": {
                                                "codes": [
                                                    {
                                                        "uid": "FLUDE_INDICATORS",
                                                        "codes": [
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
                                "name": "simpleFilter",
                                "parameters": {
                                    "filter": {
                                        "rows": {
                                            "year": {
                                                "time": [
                                                    {
                                                        "from": 2015,
                                                        "to": 2015
                                                    }
                                                ]
                                            },
                                            "indicator": {
                                                "codes": [
                                                    {
                                                        "uid": "FLUDE_INDICATORS",
                                                        "codes": [
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
                                "name": "simpleFilter",
                                "parameters": {
                                    "filter": {
                                        "rows": {
                                            "year": {
                                                "time": [
                                                    {
                                                        "from": 2015,
                                                        "to": 2015
                                                    }
                                                ]
                                            },
                                            "indicator": {
                                                "codes": [
                                                    {
                                                        "uid": "FLUDE_INDICATORS",
                                                        "codes": [
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
            }
        }

    }
});