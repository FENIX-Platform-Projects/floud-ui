/*global define, amplify*/
define([
    'views/base/view',
    'fx-ds/start',
    'fx-filter/start',
    'text!templates/analysis/analysis.hbs',
    'text!templates/analysis/topics-flude.hbs',
    'text!templates/analysis/topics-faostat.hbs',
    'i18n!nls/analysis',
    'i18n!nls/topics-flude',
    'i18n!nls/topics-faostat',
    'config/Events',
    'text!config/analysis/lateral-menu-flude.json',
    'text!config/analysis/lateral-menu-faostat.json',
    'config/analysis/topics-flude',
    'config/analysis/topics-faostat',
    'handlebars',
    'amplify',
    'jstree'
], function (View, Dashboard, Filter, template, topicsFludeTemplate, topicsFaostatTemplate, i18nLabels, topicFludeLabels, topicFaostatLabels, E, LateralMenuFludeConfig, LateralMenuFaostatConfig, TopicFludeConfig,TopicFaostatConfig, Handlebars) {

    'use strict';

    var s = {
        DASHBOARD_FLUDE_CONTAINER: '#dashboard-flude-container',
        DASHBOARD_FAOSTAT_CONTAINER: '#dashboard-faostat-container',
        FILTER_FLUDE_CONTAINER: "#filter-flude-container",
        FILTER_FAOSTAT_CONTAINER: "#filter-faostat-container",
        LATERAL_MENU_FLUDE: "#lateral-menu-flude",
        LATERAL_MENU_FAOSTAT: "#lateral-menu-faostat",
        TOPIC_CONTENT_FLUDE: "#topic-content-flude",
        TOPIC_CONTENT_FAOSTAT: "#topic-content-faostat"
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

            this.$lateralMenuFlude = this.$el.find(s.LATERAL_MENU_FLUDE);
            this.$lateralMenuFaostat = this.$el.find(s.LATERAL_MENU_FAOSTAT);

            this.$topicContentFlude = this.$el.find(s.TOPIC_CONTENT_FLUDE);
            this.$topicContentFaostat = this.$el.find(s.TOPIC_CONTENT_FAOSTAT);

        },

        _bindEventListeners: function () {

            var self = this;

            this.$lateralMenuFlude.on('changed.jstree', function (e, data) {

                self._onFludeTopicChange(data.selected[0]);
            });

            this.$lateralMenuFaostat.on('changed.jstree', function (e, data) {

                self._onFaostatTopicChange(data.selected[0]);
            });

        },

        _onFludeTopicChange: function (topic) {

            this._showFludeTopic(topic);

        },

        _onFaostatTopicChange: function (topic) {

            this._showFaostatTopic(topic);

        },

        _showFludeTopic: function (topic) {

            //Inject HTML
            var source = $(topicsFludeTemplate).find("[data-topic='" + topic + "']"),
                template = Handlebars.compile(source.prop('outerHTML')),
                html = template(topicFludeLabels[topic]);

            this.$topicContentFlude.html(html);

            this._renderFludeComponents(topic);

        },

        _showFaostatTopic: function (topic) {

            //Inject HTML
            var source = $(topicsFaostatTemplate).find("[data-topic='" + topic + "']"),
                template = Handlebars.compile(source.prop('outerHTML')),
                html = template(topicFaostatLabels[topic]);

            this.$topicContentFaostat.html(html);

            this._renderFaostatComponents(topic);

        },

        _initComponents: function () {

            var self = this;

            // Lateral menu
            this.$lateralMenuFlude.jstree(JSON.parse(LateralMenuFludeConfig))
                //select first node
                .on("ready.jstree", function () {
                    self.$lateralMenuFlude.jstree(true).select_node('ul > li:first');
                });

            // Lateral menu
            this.$lateralMenuFaostat.jstree(JSON.parse(LateralMenuFaostatConfig))
                //select first node
                .on("ready.jstree", function () {
                    self.$lateralMenuFaostat.jstree(true).select_node('ul > li:first');
                });

        },

        _renderFludeComponents: function (topic) {

            var config = TopicFludeConfig[topic];

            if (!config || !config.dashboard || !config.filter) {
                alert("Impossible to find configuration for topic: " + topic);
                return;
            }

            var dashboardConfig = config.dashboard,
                filterConfig = config.filter;

            this._renderFludeDashboard(dashboardConfig);

            //this._renderFilter(filterConfig);
        },

        _renderFaostatComponents: function (topic) {

            var config = TopicFaostatConfig[topic];

            if (!config || !config.dashboard || !config.filter) {
                alert("Impossible to find configuration for topic: " + topic);
                return;
            }

            var dashboardConfig = config.dashboard,
                filterConfig = config.filter;

            this._renderFaostatDashboard(dashboardConfig);

            //this._renderFilter(filterConfig);
        },


        _renderFludeDashboard: function (config) {

            if (this.fludeDashboard && this.fludeDashboard.destroy) {
                this.fludeDashboard.destroy();
            }

            this.fludeDashboard = new Dashboard({

                //Ignored if layout = injected
                container: s.DASHBOARD_FLUDE_CONTAINER,
                layout: "injected"
            });

            this.fludeDashboard.render(config);

        },

        _renderFaostatDashboard: function (config) {

            if (this.faostatDashboard && this.faostatDashboard.destroy) {
                this.faostatDashboard.destroy();
            }

            this.faostatDashboard = new Dashboard({

                //Ignored if layout = injected
                container: s.DASHBOARD_FAOSTAT_CONTAINER,

                layout: "injected"
            });

            this.faostatDashboard.render(config);

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
