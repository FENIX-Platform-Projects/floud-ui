/*global define, amplify*/
define([
    'jquery',
    'chaplin',
    'underscore',
    'config/Config',
    'config/Events',
    'globals/State',
    'views/base/view',
    'fx-menu/start',
    'globals/AuthManager',
    'i18n!nls/site',
    'text!templates/site.hbs'
], function ($, Chaplin, _, C, E, State, View, Menu, AuthManager, i18nLabels, template) {

    'use strict';

    var s = {
        TOP_MENU_CONTAINER: '#top-menu-container',
        BREADCRUMB_CONTAINER: "#breadcrumb-container",
        FOOTER_MENU_CONTAINER: "#footer-menu-container"
    };

    var SiteView = View.extend({

        container: '.fx-sandbox',

        id: 'site-container',

        regions: {
            main: '#main-container'
        },

        template: template,

        getTemplateData: function () {
            return $.extend(true, {}, C, i18nLabels);
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this.bindEventListeners();

            this.initComponents();
        },

        bindEventListeners: function () {
            amplify.subscribe(E.STATE_CHANGE, this, this.onStateUpdate);
        },

        initComponents: function () {

            this.authManager = AuthManager.init({
                modal : {
                    keyboard: false,
                    backdrop: 'static'
                },
                onLogin: _.bind(function () {
                    Chaplin.utils.redirectTo({controller: 'analysis', action: 'show'});
                }, this),
                onLogout: _.bind(function () {
                    Chaplin.utils.redirectTo({controller: 'login', action: 'show'});
                }, this)
            });

        },

        onMenuRendered: function () {

            this.onMenuUpdate();

            amplify.subscribe(E.MENU_UPDATE, this, this.onMenuUpdate);
        },

        onStateUpdate: function (s) {

            State = $.extend(true, State, s);

            amplify.publish(E.MENU_UPDATE);
        },

        onMenuUpdate: function () {

            this.topMenu.select(State.menu);
        }
    });

    return SiteView;
});
