/*global define, amplify*/
define([
    'views/base/view',
    'fx-ds/start',
    'fx-filter/start',
    'text!templates/analysis/analysis.hbs',
    'text!templates/analysis/topics.hbs',
    'i18n!nls/analysis',
    'i18n!nls/topics',
    'config/Events',
    'text!config/analysis/lateral-menu.json',
    'config/analysis/topics',
    'handlebars',
    'amplify',
    'jstree'
], function (View, Dashboard, Filter, template, topicsTemplate, i18nLabels, topicLabels, E, LateralMenuConfig, TopicConfig, Handlebars) {

    'use strict';

    var s = {
        DASHBOARD_CONTAINER: '#dashboard-container',
        FILTER_CONTAINER: "#filter-container",
        LATERAL_MENU: "#lateral-menu",
        TOPIC_CONTENT: "#topic-content"
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

            this._initVariables();

            this._initComponents();

            this._bindEventListeners();

        },

        _initVariables: function () {

            this.$lateralMenu = this.$el.find(s.LATERAL_MENU);

            this.$topicContent = this.$el.find(s.TOPIC_CONTENT);

        },

        _bindEventListeners: function () {

            var self = this;

            this.$lateralMenu.on('changed.jstree', function (e, data) {

                self._onTopicChange(data.selected[0]);
            });

        },

        _onTopicChange: function (topic) {

            this._showTopic(topic);

        },

        _showTopic: function (topic) {

            //Inject HTML
            var source = $(topicsTemplate).find("[data-topic='" + topic + "']"),
                template = Handlebars.compile(source.prop('outerHTML')),
                html = template(topicLabels[topic]);

            this.$topicContent.html(html);

            this._renderComponents(topic);

        },

        _initComponents: function () {

            var self = this;

            // Lateral menu
            this.$lateralMenu.jstree(JSON.parse(LateralMenuConfig))
                //select first node
                .on("ready.jstree", function () {
                    self.$lateralMenu.jstree(true).select_node('ul > li:first');
                })

        },

        _renderComponents: function (topic) {

            var config = TopicConfig[topic];

            if (!config || !config.dashboard || !config.filter) {
                alert("Impossible to find configuration for topic: " + topic);
                return;
            }

            var dashboardConfig = config.dashboard,
                filterConfig = config.filter;

            this._renderDashboard(dashboardConfig);

            //this._renderFilter(filterConfig);
        },

        _renderDashboard: function (config) {

            if (this.fludeDashboard && this.fludeDashboard.destroy) {
                this.fludeDashboard.destroy();
            }

            this.fludeDashboard = new Dashboard({

                //Ignored if layout = injected
                container: s.DASHBOARD_CONTAINER,

                layout: "injected"
            });

            this.fludeDashboard.render(config);

        },

        _renderFilter: function (config) {






            /*   this.filter = new Filter();
             this.filter.init({
             container: s.FILTER_CONTAINER,
             plugin_prefix: '',
             layout: 'fluidGrid'
             //  plugin_subdir: 'FENIX-plugin'
             });
             */

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
