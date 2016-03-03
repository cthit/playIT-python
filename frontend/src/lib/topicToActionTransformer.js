import * as mainActions from '../actions/mainActions'
import * as trackActions from '../actions/trackActions'
import * as playlistActions from '../actions/playlistActions'

export default (topic, args) => {
    switch (topic) {
      case 'playing/status':
        return mainActions.setNowPlaying(args);

      case 'queue/update':
        return trackActions.receiveTracksSuccess(args);
      case 'media_item/update':
        return trackActions.updateTrack(args);

      case 'media_list/queue/update':
        return playlistActions.receivePlaylistsSuccess(args);
      case 'media_list/update':
        return playlistActions.updatePlaylist(args);
      default:
        return null;
    }
};