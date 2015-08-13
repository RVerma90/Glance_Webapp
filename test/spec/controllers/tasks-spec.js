'use strict';

describe('Controller: TasksCtrl', function () {

  // load the controller's module
  beforeEach(module('GlanceApp'));

  var TasksCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TasksCtrl = $controller('TasksCtrl', {
      $scope: scope
    });
  }));

  it('Should contain three tasks', function () {
    
    scope.projects = [
      {title: 'Roject 1', description: "The first"},
      {title: 'Sroject 2', description: "The second"},
      {title: 'Project 3', description: "The third"}
    ];

    expect(scope.tasks.length).toBe(3);

  });

});
