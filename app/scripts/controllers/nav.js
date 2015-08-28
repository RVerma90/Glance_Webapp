'use strict';

glance.controller("NavCtrl", function($scope, $state, $stateParams, $mdSidenav) {

  $scope.close = function() {
    $mdSidenav('left').close();
    console.log('closing');
  };

  $scope.toggleNavbar = function() {
    $mdSidenav('left').toggle();
    console.log('toggling');
  };

  $scope.goGlanceboard = function() {
    console.log('go glanceboard');
    $state.go("glanceboard");
    $mdSidenav('left').close();
  };

  $scope.goProjects = function() {
    console.log('go project');
    $state.go("projects");
    $mdSidenav('left').close();
  };

  $scope.goTalk = function() {
    console.log('go talk');
    $state.go("talk");
    $mdSidenav('left').close();

  };    

});

