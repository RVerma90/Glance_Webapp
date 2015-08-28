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

  // updateProject, addProject, select project

  it('Should contain three projects', function () {
    


  });

  it('Should open mdDialog for adding new project', function () {
      
    //user adds new project
    //opens md dialog

  });

});
