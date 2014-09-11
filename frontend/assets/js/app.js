'use strict';
var app = angular.module("playit", ['websocket', 'ui.bootstrap']);

$.getJSON("https://chalmers.it/auth/userInfo.php?token=" + PlayIT.get_cookie() + "&callback=?", function(user) {
	app.user = user.cid;
});

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
		if (app.user === body.cid) {
			$scope.votes[body.id] = true;
			saveVotes($scope);
		}
	});

	websocket.register('playback/new', function(topic, body) {
		$rootScope.$broadcast('playback', body);
	});

	websocket.register('media_item/update', function(topic, body) {
		$scope.$apply(function() {
			for (var i = 0; i < $scope.mediaitems.length; i++) {
				if ($scope.mediaitems[i].id === body.id) {
					console.log($scope.mediaitems[i].value, body.value);
					$scope.mediaitems[i].value = body.value;
					return;
				}
			}
		});
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

	$scope.get_link = type_to_url;

	$scope.select = function(index) {
		$scope.selected = index; 
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

	$scope.check_voted = function(id) {
		return $scope.votes[id];
	}

	function addVote($scope, item, value, skip_send) {
		$scope.votes[item.id] = value;
		saveVotes($scope);
		if (!skip_send) {
			send('add_vote', {
				vote: (value ? 1 : -1),
				id: item.external_id,
				type: item.type
			});
		}
	}

	$scope.upvoteItem = function($scope, item) {
		item = item || $scope.mediaitems[$scope.selected];
		if ($scope.votes[item.id] !== true) {
			addVote($scope, item, true);
		}
	};
	$scope.downvoteItem = function($scope, item) {
		item = item || $scope.mediaitems[$scope.selected];
		if ($scope.votes[item.id] !== false) {
			addVote($scope, item, false);
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

function type_to_url(item) {
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
}

app.directive('nowPlaying', function() {
	return {
		restrict: 'E',
		templateUrl: 'assets/partials/now-playing.html',
		controller: 'NowPlayingCtrl'
	}
});
app.controller('NowPlayingCtrl', function($scope, $rootScope) {
	$scope.item = null;

	$scope.get_link = type_to_url;

	$rootScope.$on('playback', function(event, args) {
		$scope.item = args;
	});
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