'use strict';
var app = angular.module("playit", ['websocket', 'ui.bootstrap']);

app.controller('VideofeedCtrl', function($scope, $websocket, $rootScope) {
	var websocket = $websocket.connect('ws://localhost:8888/ws/action');
	$scope.mediaitems = [];
	$scope.votes = {};
	$scope.selected = -1;

	if (window.localStorage) {
		$scope.votes = JSON.parse(window.localStorage.getItem('votes')) || {};
	}

	function send(topic, body) {
		body = body || {};
		body.token = PlayIT.get_cookie('chalmersItAuth');
		websocket.emit(topic, body);
	}

	websocket.register('queue/update', function(topic, body) {
		console.log('queue:', body);
		$scope.mediaitems = body;
		if ($scope.selected == -1) {
			$scope.selected = 0;
		}
	});

	websocket.register('media_item/new/fail', function(topic, body) {
		$rootScope.$broadcast('alert', {
			type: 'danger',
			message: 'Failed to save: ' + body.split('due to: ')[1]
		});
	});

	websocket.register('media_item/new', function(topic, body) {
		$scope.votes[body.id] = 0;
		saveVotes($scope);
	});

	$scope.time_format = function(seconds) {
		var time = [
			parseInt(seconds / 3600) % 24,
			parseInt(seconds / 60) % 60,
			parseInt(seconds % 60)
		],
		hour = true;

		return time.filter(function(part) {
			if (hour) {
				hour = false;
				return part != 0;
			} else {
				return part;
			}
		}).map(function(part) {
			return part < 10 ? "0" + part : part;
		}).join(':');
	};

	$scope.get_link = function(item) {
		switch(item.type) {
			case 'youtube':
				return 'http://youtu.be/' + item.external_id;
			case 'spotify':
				return 'http://open.spotify.com/track/' + item.external_id;
			case 'soundcloud':
				var artist = self.author.toLowerCase().replace(/ /g, '-'),
				track = self.title.toLowerCase().replace(/ /g, '-');
				return 'http://soundcloud.com/' + artist + '/' + track;
			default:
				throw 'Got MediaItem of unrecognized type: ' + item.type;
		}
	};
	$scope.select = function(index) {
		$scope.selected = index; 
	};

	$scope.get_weight = function(index) {
		var saved_value = $scope.votes[$scope.mediaitems[index].id] || 0;
		return saved_value + $scope.mediaitems[index].value;
	};

	function saveVotes($scope) {
		if (window.localStorage) {
			window.localStorage.setItem('votes', JSON.stringify($scope.votes))
		}
	}

	function nextItem() {
		var next = $scope.selected + 1;
		$scope.selected = Math.min(next, $scope.mediaitems.length - 1);
		$('.selected')[0].scrollIntoView(true);
	}
	function prevItem() {
		var prev = $scope.selected - 1;
		$scope.selected = Math.max(0, prev);
		$('.selected')[0].scrollIntoView(false);
	}
	$scope.upvoteItem = function(index) {
		index = index || $scope.selected;
		var item = $scope.mediaitems[$scope.selected];
		if ($scope.votes[item.id] !== 1 && $scope.votes[item.id] !== 0) {
			$scope.votes[item.id] = 1;
			saveVotes($scope);
			send('add_vote', {
				id: item.external_id,
				type: item.type
			});
		}
	};
	$scope.downvoteItem = function(index) {
		index = index || $scope.selected;
		var item = $scope.mediaitems[$scope.selected];
		if ($scope.votes[item.id] != -1) {
			$scope.votes[item.id] = -1;
			saveVotes($scope);
			send('remove_vote', {
				id: item.external_id,
				type: item.type
			});
		}
	};

	$rootScope.$on('add_item', function(event, args) {
		var mediaItem = args;
		args.token = PlayIT.get_cookie('chalmersItAuth');
		send('add_item', mediaItem);
	});

	var defaultCallback = Mousetrap.stopCallback;
	Mousetrap.stopCallback = function(e, element, combo) {
		if (combo === 'esc') {
			return false;
		} else {
			return defaultCallback(e, element, combo);
		}
	};
	Mousetrap.bind('/', function(e){
		document.getElementById('insert_video').focus();
		e.preventDefault();
	});
	Mousetrap.bind('esc', function(e){
		document.getElementById('insert_video').blur();
	});
	Mousetrap.bind('j', function(){
		$scope.$apply(nextItem);
	});
	Mousetrap.bind('k', function(){
		$scope.$apply(prevItem);
	});
	Mousetrap.bind('a', function(){
		$scope.$apply($scope.upvoteItem);
	});
	Mousetrap.bind('z', function(){
		$scope.$apply($scope.downvoteItem);
	});

	// startup the webapp with a request to fetch the current queue
	send('get_queue');
});

app.directive('nowPlaying', function() {
	return {
		restrict: 'E',
		templateUrl: 'assets/partials/now-playing.html',
		controller: 'NowPlayingCtrl'
	}
});
app.controller('NowPlayingCtrl', function($scope) {
	$scope.playing = false;
});

app.directive('videofeed', function() {
	return {
		restrict: 'E',
		templateUrl: 'assets/partials/videofeed.html',
		controller: 'VideofeedCtrl'
	};
});

app.controller('AlertCtrl', function($scope, $rootScope, $timeout) {
	$scope.alerts = [];

	$rootScope.$on('alert', function(event, args) {
		$scope.alerts.push(args);
		$timeout(function() {
			$scope.alerts.shift();
		}, 5000);
	});
});