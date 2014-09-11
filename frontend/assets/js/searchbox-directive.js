'use strict';

var regexes = {
	youtube: /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]+).*/,
	spotify: /^(.*open\.)?spotify(\.com)?[\/:]track[\/:]([a-zA-Z0-9]+)$/,
	soundcloud: /^https?:\/\/soundcloud.com\/([\w-]+\/\w+)$/
};

app.controller('SearchController', function($scope, $http, $rootScope) {
	$scope.selected = undefined;

	$scope.searchMedia = function(query) {
		return $http.get('https://www.googleapis.com/youtube/v3/search', {
			params: {
				part: 'snippet',
				key: 'AIzaSyD2v5xyu8uXd6ER0xo35RWxfFLlTXezXZA',
				maxResults: 10,
				type: 'video',
				q: query
			}
		}).then(function(res) {
			var videos = [];
			angular.forEach(res.data.items, function(video) {
				videos.push(video);
			});
			return videos;
		});
	};
	$scope.addVideo = function($item, $model, $label) {
		var query = $('#insert_video').val();
		for (var type in regexes) {
			if (regexes[type].test(query)) {
				$rootScope.$broadcast('add_item', {type: type, id: $item.id.videoId});
				return;
			}
		}
		$rootScope.$broadcast('add_item', {type: 'youtube', id: $item.id.videoId});
	};
});

app.directive('search', function() {
	return {
		restrict: 'E',
		controller: 'SearchController',
		templateUrl: 'assets/partials/search.html'
	};
});