/*global define*/
define(function () {
    'use strict';

    // The routes for the application. This module returns a function.
    // `match` is match method of the Router
    return function (match) {
        match('', 'analysis#show');
        match('index', 'analysis#show');
        match('home', 'analysis#show');
        //match('login', 'login#show');
        match('analysis', 'analysis#show');
        match('*anything', '404#show');
    };
});
