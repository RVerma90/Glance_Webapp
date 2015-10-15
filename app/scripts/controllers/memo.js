'use strict';

glance.controller('MemoCtrl', function($scope, FURL, Auth, $firebaseArray, Memo) {

	var ref = new Firebase(FURL);
	//var FBmemos = $firebaseArray(ref.child('memos'));
	//$scope.memos = FBmemos;

	$scope.memos = Memo.allMessages();
  	var user = Auth.user;



	$scope.addMemo = function(memo) {
		FBmessages.$add(memo);
	};


	$scope.test = function() {

		console.log(user);

	};






});
