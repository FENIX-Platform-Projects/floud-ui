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
    'fx-filter/Fx-filter-configuration-creator',
    'handlebars',
    'amplify',
    'jstree'
], function (View, Dashboard, Filter, template, topicsFludeTemplate, topicsFaostatTemplate, i18nLabels, topicFludeLabels, topicFaostatLabels, E, LateralMenuFludeConfig, LateralMenuFaostatConfig, TopicFludeConfig,TopicFaostatConfig, FilterConfCreator, Handlebars) {

    'use strict';

    var s = {
        DASHBOARD_FLUDE_CONTAINER: '#dashboard-flude-container',
        DASHBOARD_FAOSTAT_CONTAINER: '#dashboard-faostat-container',
        FILTER_FLUDE_CONTAINER: "filter-flude-container",
        FILTER_FAOSTAT_CONTAINER: "#filter-faostat-container",
        LATERAL_MENU_FLUDE: "#lateral-menu-flude",
        LATERAL_MENU_FAOSTAT: "#lateral-menu-faostat",
        TOPIC_CONTENT_FLUDE: "#topic-content-flude",
        TOPIC_CONTENT_FAOSTAT: "#topic-content-faostat",

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


            this.$filterFludeFilterBtn = this.$el.find("#filter-flude-btn");
            console.log(this.$filterFludeFilterBtn.length);
            this.$filterFludeFilterBtn.on('click', function (e, data) {
                var filter = {};
                var values = self.filter.getValues();
                _.each(values, function(f, key) {
                    if (values[key].length > 0)
                        filter[key] = f;
                });
                // TODO: it's an array
                self.fludeDashboard.filter([values]);
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

            this._renderFludeFilter(filterConfig);
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

        _renderFludeFilter: function (config) {

            var self = this;

            this.filterConfCreator = new FilterConfCreator();

            this.filterConfCreator.getConfiguration(config)
                .then(function (c) {

                    self.filter = new Filter();

                    self.filter.init({
                        container: s.FILTER_FLUDE_CONTAINER,
                        layout: 'fluidGrid'
                    });

                    var adapterMap = {};

                    self.filter.add(c, adapterMap);

            });

        }

    });

    return AnalysisView;
});
