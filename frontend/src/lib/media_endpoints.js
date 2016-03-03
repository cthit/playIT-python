if (!window.fetch) {
  require("whatwg-fetch");
}



window.urlparams = urlparams;

const regexes = {
  youtube: {index: 2, regex: /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]+).*/},
  spotify: {index: 3, regex: /^(.*open\.)?spotify(\.com)?[\/:]track[\/:]([a-zA-Z0-9]+)$/},
  soundcloud: {index: 1, regex: /^.*soundcloud.com\/([a-zA-Z0-9-\/]+)/}
};

const fetchJson = (url, params) => fetch(url + '?' + urlparams(params)).then(resp => resp.json());

const RESULT_LIMIT = 20;

const urlparams = (params) => Object.keys(params).map((k) => k + '=' + params[k]).join('&')

export default class MediaEndpoints {
  isURL(string) {
    return Object.keys(regexes).filter((k) => regexes[k].regex.test(string)).length > 0;
  }

  urlToMediaItem(url) {
    return Object.keys(regexes)
      .map(key => [key, regexes[key]])
      .filter(([key, {regex}]) => regex.test(url))
      .map(([type, {regex, index}]) => ({type, id: regex.exec(url)[index]}));
  }

  search_youtube(query) {
    return fetchJson('https://www.googleapis.com/youtube/v3/search', {
      part: 'snippet',
      key: 'AIzaSyD2v5xyu8uXd6ER0xo35RWxfFLlTXezXZA',
      maxResults: RESULT_LIMIT,
      type: 'video',
      q: query
    }).then((json) => json.items.map(({ snippet, id: { videoId } }) => ({
        name: snippet.title,
        thumbnail: snippet.thumbnails.default.url,
        author: snippet.channelTitle,
        type: 'youtube',
        id: videoId
    })));
  }

  search_soundcloud(query) {
    return fetchJson('http://api.soundcloud.com/tracks', {
      client_id: 'a2cfca0784004b38b85829ba183327cb',
      limit: RESULT_LIMIT,
      q: query
    }).then((json) => json.map((track) => ({
        name: track.title,
        thumbnail: track.artwork_url,
        author: track.user.username,
        type: 'soundcloud',
        id: track.id
    })));
  }

  search_spotify(query) {
    return fetchJson('https://api.spotify.com/v1/search', {
      limit: RESULT_LIMIT,
      type: 'track',
      q: query
    }).then((json) => json.tracks.items.map((track) => {
      const [image] = track.album.images;
      return {
        name: track.name,
        thumbnail: (image && image.url) || null,
        author: track.artists.map((a) => a.name).join(', '),
        type: 'spotify',
        id: track.id
      };
    }));
  }
}
