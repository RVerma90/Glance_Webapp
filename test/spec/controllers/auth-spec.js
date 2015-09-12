'use strict';

describe('Controller: AuthCtrl', function () {

  // load the controller's module
  beforeEach(module('GlanceApp'));

  var AuthCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AuthCtrl = $controller('AuthCtrl', {
      $scope: scope
    });
  }));

  it('Should contain three milestones', function () {
  
  });

});
