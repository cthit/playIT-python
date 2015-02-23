'use strict';

var regexes = {
	youtube: {i: 2, regex: /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]+).*/},
	spotify: {i: 3, regex: /^(.*open\.)?spotify(\.com)?[\/:]track[\/:]([a-zA-Z0-9]+)$/},
	soundcloud: {i: 1, regex: /^.*soundcloud.com\/([a-zA-Z0-9-\/]+)/}
};

app.controller('SearchController', function($scope, $http, $rootScope) {
	$scope.selected = undefined;
	$scope.searchType = 'youtube';

	function searchYoutube(query) {
		return $http.get('https://www.googleapis.com/youtube/v3/search', {
			params: {
				part: 'snippet',
				key: 'AIzaSyD2v5xyu8uXd6ER0xo35RWxfFLlTXezXZA',
				maxResults: 20,
				type: 'video',
				q: query
			}
		}).then(function(res) {
			var results = [];
			angular.forEach(res.data.items, function(video) {
				results.push({
					name: video.snippet.title,
					thumbnail: video.snippet.thumbnails.default.url,
					author: video.snippet.channelTitle,
					type: 'youtube',
					external_id: video.id.videoId
				});
			});
			return results;
		});
	}

	function searchSoundcloud(query) {
		return $http.get('http://api.soundcloud.com/tracks/', {
			params: {
				client_id: 'a2cfca0784004b38b85829ba183327cb',
				limit: 20,
				q: query
			}
		}).then(function(res) {
			var results = [];
			angular.forEach(res.data, function(track) {
				results.push({
					name: track.title,
					thumbnail: track.artwork_url,
					author: track.user.username,
					type: 'soundcloud',
					external_id: track.id
				});
			});
			return results;
		});
	}

	function searchSpotify(query) {
		return $http.get('https://api.spotify.com/v1/search', {
			params: {
				limit: 20,
				type: 'track',
				q: query
			}
		}).then(function(res) {
			var results = [];
			angular.forEach(res.data.tracks.items, function(track) {
				results.push({
					name: track.name,
					thumbnail: track.album.images[0].url,
					author: track.artists.map(function(a) { return a.name }).join(', '),
					type: 'spotify',
					external_id: track.id
				});
			});
			return results;
		});
	}

	$scope.searchMedia = function(query) {
		var result = null;
		for (var type in regexes) {
			if (result = regexes[type].regex.exec(query)) {
				// Found URL match, do not search for it!
				return [];
			}
		}
		switch($scope.searchType) {
			case 'spotify':
				return searchSpotify(query);

			case 'youtube':
				return searchYoutube(query);

			case 'soundcloud':
				return searchSoundcloud(query);
		}
		return [];
	};
	$scope.addVideo = function($item, $model, $label) {
		var query = $('#insert_video').val();
		var result = null;
		$rootScope.$broadcast('add_item', { type: $item.type, id: $item.external_id });
		$('insert_video').trigger('blur');
	};

	$scope.searchTypeClass = function() {
		if ($scope.searchType !== undefined) {
			return 'match-' + $scope.searchType;
		} else {
			return '';
		}
	}
	$scope.searchTypePlaceholder = function() {
		switch ($scope.searchType) {
			case 'spotify':
				return "Search for tracks on Spotify";
			case 'soundcloud':
				return "Search for tracks on SoundCloud";
			case 'youtube':
				return "Search for YouTube videos";
			default:
				return 'Search for videos or music';
		}
	}
});

app.directive('search', function($rootScope) {

	function add_item(value) {
		var result = null;
		for (var type in regexes) {
			if (result = regexes[type].regex.exec(value)) {
				$rootScope.$broadcast('add_item', { type: type, id: result[regexes[type].i] });
				return;
			}
		}
	}

	return {
		restrict: 'E',
		controller: 'SearchController',
		templateUrl: 'assets/partials/search.html',
		link: function($scope, element) {
			$('button', element).on('click', function(e) {
				add_item($('#input_video').val());
			});
			$('input', element).on('keydown', function(e) {
				if (e.which == 13) { // Enter
					add_item(this.value);
				} else if (e.which == 9) { // Tab
					var query = autocomplete_api(this.value);
					$scope.$apply(function() {
						$scope.searchType = query;
					});
					this.value = '';

					e.preventDefault();
				}
			});
		}
	};
});
