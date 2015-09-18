export default {
  format_time(seconds) {
    var time = [
      parseInt(seconds / 3600) % 24,
      parseInt(seconds / 60) % 60,
      parseInt(seconds % 60)
    ],
    hour = true;

    return time.filter((part) => {
      if (hour) {
        hour = false;
        return part != 0;
      } else {
        return true;
      }
    }).map((part) => part < 10 ? "0" + part : part).join(':');
  },
  get_link(item) {
    switch(item.type) {
      case 'youtube':
        return 'http://youtu.be/' + item.external_id;
      case 'youtube_list':
        return 'https://www.youtube.com/playlist?list=' + item.external_id
      case 'spotify':
        return 'http://open.spotify.com/track/' + item.external_id;
      case 'spotify_list':
        return '#';
      case 'soundcloud':
        return item.permalink_url;
      case 'soundcloud_list':
        return '#';
      default:
        throw 'Got MediaItem of unrecognized type: ' + item.type;
    }
  },
  elementInViewport(el) {
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    while(el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
      left += el.offsetLeft;
    }

    return (
      top >= window.pageYOffset &&
      left >= window.pageXOffset &&
      (top + height) <= (window.pageYOffset + window.innerHeight) &&
      (left + width) <= (window.pageXOffset + window.innerWidth)
    );
  }
}
