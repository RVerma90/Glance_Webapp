'use strict';

describe('Controller: MilestonesCtrl', function () {

  // load the controller's module
  beforeEach(module('GlanceApp'));

  var MilestonesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MilestonesCtrl = $controller('MilestonesCtrl', {
      $scope: scope
    });
  }));

  it('Should contain three milestones', function () {
  
  });

});
