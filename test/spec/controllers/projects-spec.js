'use strict';

describe('Controller: ProjectsCtrl', function () {

  // load the controller's module
  beforeEach(module('GlanceApp'));

  var ProjectsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProjectsCtrl = $controller('ProjectsCtrl', {
      $scope: scope
    });
  }));

  it('Should contain three projects', function () {
    
    scope.projects = [
      {title: 'Roject 1', description: "The first"},
      {title: 'Sroject 2', description: "The second"},
      {title: 'Project 3', description: "The third"}
    ];

    expect(scope.projects.length).toBe(3);

  });

  it('Should open mdDialog for adding new project', function () {
      
    //user adds new project
    //opens md dialog

  });

});
