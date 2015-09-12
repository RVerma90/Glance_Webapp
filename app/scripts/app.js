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

    $urlRouterProvider.otherwise('/signin');

    $stateProvider
      .state('signin', {
        url: '/signin',
        templateUrl: 'views/signin.html',
        controller: 'AuthCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'views/signup.html',
        controller: 'AuthCtrl'        
      })    
      .state('glanceboard', {
        url: '/glanceboard/:uid',
        templateUrl: 'views/glanceboard.html',
        controller: 'GlanceCtrl',
        data: {
          stateName: 'Glanceboard'
        },
        resolve: {
          currentAuth: ['Auth', function(Auth) {
            return Auth.requireAuth();
          }]
        }
      })
      .state('projects', {
        url: '/projects/:uid',
        templateUrl: 'views/projects.html',
        controller: 'ProjectsCtrl',
        data: {
          stateName: 'Projects'
        },        
        resolve: {
          currentAuth: ['Auth', function(Auth) {
            return Auth.requireAuth();
          }]
        }       
      })
      .state('milestones', {
        url: '/milestones/:pid',
        templateUrl: 'views/milestones.html',
        controller: 'MilestonesCtrl',
        data: {
          stateName: 'Milestones'
        },        
        resolve: {
          currentAuth: ['Auth', function(Auth) {
            return Auth.requireAuth();
          }]
        }               
      })
      .state('tasks', {
        url: '/tasks/:mid',
        templateUrl: 'views/tasks.html',
        controller: 'TasksCtrl',
        data: {
          stateName: 'Tasks'
        },        
        resolve: {
          currentAuth: ['Auth', function(Auth) {
            return Auth.requireAuth();
          }]
        }               
      })
      .state('talk', {
        url: '/talk',
        templateUrl: "views/talk.html",
        controller: "TalkCtrl",
        data: {
          stateName: 'Talk'
        },        
        resolve: {
          currentAuth: ['Auth', function(Auth) {
            return Auth.requireAuth();
          }]
        }               
      })
      .state('settings', {
        url: '/settings',
        templateUrl: "views/settings.html",
        data: {
          stateName: 'Settings'
        },        
        resolve: {
          currentAuth: ['Auth', function(Auth) {
            return Auth.requireAuth();
          }]
        }        
      });
    }
  )
  .run(['$state', function ($state) {}]);