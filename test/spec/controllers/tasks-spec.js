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

  it('Should add a new milestones', function () {
      
    //user adds new milestones

  });

  it('Should edit the selected milestones', function () {

    //only for admins, edit milestones

  });

  it('Should remove selected milestones', function () {

    //only for admins, remove milestones

  });

  it('Should select the milestones', function() {

    //user selects milestoness

  });


});
