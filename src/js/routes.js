/*global define*/
define(function () {
    'use strict';

    // The routes for the application. This module returns a function.
    // `match` is match method of the Router
    return function (match) {
        match('', 'login#show');
        match('index', 'login#show');
        match('home', 'login#show');
        match('login', 'login#show');
        match('analysis', 'analysis#show');
        match('*anything', '404#show');
    };
});
