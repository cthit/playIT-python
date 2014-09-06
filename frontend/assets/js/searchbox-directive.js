'use strict';
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