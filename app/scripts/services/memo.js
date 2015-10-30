'use strict';

glance.factory('Memo', function(Glance) {
	
	var p = Glance.projects();

//	console.log("p",p);

	var m = Glance.milestones();

//	console.log("m",m);

	var t = Glance.tasks();

//	console.log("t",t);

	var memo = [{'name':'Pippo','text':'Hello'},
					{'name':'Pluto','text':'Hello'},
					{'name':'Pippo','text':'how are you ?'},
					{'name':'Pluto','text':'fine thanks'},
					{'name':'Pippo','text':'Bye'},
					{'name':'Pluto','text':'Bye'}];

	var Memo = {

		allMessages: function() {

			var memos = [];

			p.forEach(function(entry) {
				console.log(entry);
				memos.push(entry);
			});

			m.forEach(function(entry) {
				console.log(entry);
				memos.push(entry);
			});

			t.forEach(function(entry) {
				console.log(entry);
				memos.push(entry);
			});


			memos.sort(function(a, b) {
				return parseFloat(b.deadline) - parseFloat(a.deadline);
			});



			return memos;
		},


		allMemo: function() {
			return memo;
		}
	};

	return Memo;


});