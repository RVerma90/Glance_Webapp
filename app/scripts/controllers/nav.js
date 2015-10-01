'use strict';

glance.controller("NavCtrl", function($scope, $state, $stateParams, $mdSidenav, Auth) {

  $scope.currentUser = Auth.user;
  $scope.signedIn = Auth.signedIn;

  $scope.close = function() {
    $mdSidenav('left').close();
  };

  $scope.toggleNavbar = function() {
    $mdSidenav('left').toggle();
  };

  $scope.goGlanceboard = function() {
    $state.go("glanceboard");
    $mdSidenav('left').close();
  };

  $scope.goProjects = function() {
    $state.go("projects");
    $mdSidenav('left').close();
  };

  $scope.goTalk = function() {
    $state.go("talk");
    $mdSidenav('left').close();
  };    

  $scope.goProfile = function() {
    $state.go("contacts");
    $mdSidenav('left').close();
  };

  $scope.goSettings = function() {
    $state.go("settings");
    $mdSidenav('left').close();
  };      

  $scope.logout = function() {
    Auth.logout();
    $state.go('signin');
  };


});

