// also testing ground
glance
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('orange');
})

.controller('ProjectDialog', function($scope, $mdDialog, projects) {
  $scope.addP = function(project) {
    $scope.projects = projects;
    console.log(project);
    $scope.projects.push(project);
    $mdDialog.hide();

  $scope.closeDialog = function() {
    $mdDialog.cancel();
  };

  }})

.controller('MilestoneDialog', function($scope, $mdDialog, milestones) {
  $scope.addM = function(milestone) {
    $scope.milestones = milestones;
    console.log(milestone);
    $scope.milestones.push(milestone);
    $mdDialog.hide();

  $scope.closeDialog = function() {
    $mdDialog.cancel();
  };

  }})

.controller('TaskDialog', function($scope, $mdDialog, tasks) {
  $scope.addT = function(task) {
    $scope.tasks = tasks;
    console.log(task);
    $scope.tasks.push(task);
    $mdDialog.hide();

  $scope.closeDialog = function() {
    $mdDialog.cancel();
  };

  }});