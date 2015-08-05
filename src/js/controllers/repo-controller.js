/*global define*/
define([
    'controllers/base/controller',
    'views/repo-view'
], function (Controller, View) {
    'use strict';

    var RepoController = Controller.extend({

        show: function (params) {

            this.view = new View({
                region: 'main'
            });
        }
    });

    return RepoController;
});
