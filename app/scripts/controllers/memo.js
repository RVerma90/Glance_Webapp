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

    console.log($scope.memos);

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
  }
  ];


});

/*
 * 'scroll' Angular Directive
 * Used to handle page header during scroll event (and rezise event too) of the window.
 *
 */