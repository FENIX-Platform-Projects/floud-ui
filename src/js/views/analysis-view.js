/*global define, amplify*/
define([
    'views/base/view',
    'fx-ds/start',
    'text!templates/analysis/analysis.hbs',
    'i18n!nls/analysis',
    'config/Events',
    'amplify'
], function (View, Dashboard, template, i18nLabels, E) {

    'use strict';

    var s = {
        DASHBOARD_CONTAINER: '#dashboard-container'
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
                layout : "injected"
            });

        },

        _renderComponents: function () {

            this.fludeDashboard.render({
                //data cube's uid
                uid : "FAOSTAT_fertilizer_test",

                //data base filter
                filter : [],

                //bridge configuration
                bridge : {

                    type : "d3p"

                },

                /*
                * in case bridge is WDS this is the cube metadata.
                * if bridge is D3P this is ignored
                * */
                metadata : {

                },

                items: [
                    {
                        id: 1,
                        type : 'chart',
                        class: "SIMONCINO E DANIELONE",
                        //needed if layout = injected
                        container : "#test-1"

                    },
                    {
                        id: 2,
                        type : 'chart',
                        container : "#test-2"
                    }, {
                        id: 3,
                        type : 'chart',
                        container : "#test-3"
                    }
                ]
            });

        }
    });

    return AnalysisView;
});
