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

  it('Should add a new project', function () {
      
    //user adds new project

  });

  it('Should edit the selected project', function () {

    //only for admins, edit project

  });

  it('Should remove selected project', function () {

    //only for admins, remove project

  });

  it('Should select the project', function() {

    //user selects projects

  });


});
