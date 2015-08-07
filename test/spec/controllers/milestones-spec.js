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

  it('Should add a new milesonte', function () {
      
    //user adds new milestone

  });

  it('Should edit the selected milestone', function () {

    //only for admins, edit milestone

  });

  it('Should remove selected milestone', function () {

    //only for admins, remove milestone

  });

  it('Should select the milestone', function() {

    //user selects milestones

  });


});
