'use strict';

/**
 * @ngdoc overview
 * @name GlanceApp
 * @description
 * # GlanceApp
 *
 * Main module of the application.
 */

var glance = angular.module('GlanceApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ui.router',
    'firebase',
    'ngMaterial'
  ])
	.constant('FURL', 'https://webapptestings.firebaseio.com/')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('glanceboard', {
        url: '/glanceboard',
        templateUrl: 'views/glanceboard.html',
        controller: 'GlanceCtrl'
      })
      .state('projects', {
        url: '/projects',
        templateUrl: 'views/projects.html',
        controller: 'ProjectsCtrl'
      })
//      .state('newproject', {
//        url: '/newproject',
//        templateUrl: 'views/newproject.html',
//        controller: 'DialogController'
//      })
      .state('milestones', {
        url: '/milestones',
        templateUrl: 'views/milestones.html',
        controller: 'MilestonesCtrl'
      })
      .state('tasks', {
        url: '/tasks',
        templateUrl: 'views/tasks.html',
        controller: 'TasksCtrl'
      })
      .state('talk', {
        url: '/talk',
        templateUrl: "views/talk.html",
        controller: "TalkCtrl"
      })
    }
  );