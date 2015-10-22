'use strict';

glance.controller('MemoCtrl', function($scope, Nav, FURL, Auth, $firebaseArray, Memo) {

  $scope.toggleNavbar = function() {
    Nav.toggleNavbar();
  };


	var ref = new Firebase(FURL);
	//var FBmemos = $firebaseArray(ref.child('memos'));
	//$scope.memos = FBmemos;

	$scope.memos = Memo.allMessages();
  	var user = Auth.user;

  $scope.datas = [
  {
    name: 'Shidhin',
    info: 'I am from Dubai'
  },
  {
    name: 'Shidhin',
    info: 'I am from Dubai'
  },
  {
    name: 'Shidhin',
    info: 'I am from Dubai'
  },
  {
    name: 'Shidhin',
    info: 'I am from Dubai'
  },
  {
    name: 'Shidhin',
    info: 'I am from Dubai'
  },
  {
    name: 'Shidhin',
    info: 'I am from Dubai'
  },
  {
    name: 'Shidhin',
    info: 'I am from Dubai'
  },
  {
    name: 'Shidhin',
    info: 'I am from Dubai'
  },
  {
    name: 'Shidhin',
    info: 'I am from Dubai'
  },                 
  {
    name: 'Someone',
    info: 'I am from New york'
  }
  ];


  $scope.linko = 'http://topwalls.net/wallpapers/2012/06/Rock-Mountain-Lake-Canada-1440x2560.jpg';
  $scope.link = 'http://unsplash.it/350/251';

});

/*
 * 'scroll' Angular Directive
 * Used to handle page header during scroll event (and rezise event too) of the window.
 *
 */


glance.directive('bingo', function() {
  return function(scope, element, attrs) {

    var url = attrs.bingo;

    element.css({

      'background-image': 'url('+ url +')',
      'background-size': 'cover'

    });
  };
});


