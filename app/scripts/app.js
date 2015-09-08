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

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('signin', {
        url: '/signin',
        templateUrl: 'views/signin.html',
        controller: 'AuthController'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'views/signup.html',
        controller: 'AuthController'
      })
      .state('glanceboard', {
        url: '/glanceboard/:uid',
        templateUrl: 'views/glanceboard.html',
        controller: 'GlanceCtrl'
      })
      .state('projects', {
        url: '/projects/:uid',
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