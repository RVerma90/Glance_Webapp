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
	.constant('FURL', 'https://webapptesting.firebaseio.com/')
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/projects');

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
      .state('milestones', {
        url: '/milestones/:pid',
        templateUrl: 'views/milestones.html',
        controller: 'MilestonesCtrl'
      })
      .state('tasks', {
        url: '/tasks/:mid',
        templateUrl: 'views/tasks.html',
        controller: 'TasksCtrl'
      })
      .state('talk', {
        url: '/talk',
        templateUrl: "views/talk.html",
        controller: "TalkCtrl"
      });

    }
  )
  .run(['$state', function ($state) {}]);