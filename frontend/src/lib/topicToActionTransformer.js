import * as mainActions from '../actions/mainActions'
import * as trackActions from '../actions/trackActions'
import * as playlistActions from '../actions/playlistActions'

export default (topic, args) => {
    switch (topic) {
      case 'playing/status':
        return mainActions.setNowPlaying(args);

      case 'queue/update':
        return trackActions.receiveItemsSuccess(args);
      case 'media_item/update':
        return trackActions.updateItem(args);
      case 'media_item/new':
        return trackActions.receiveItem(args)
      case 'media_list/queue/update':
        return playlistActions.receiveItemsSuccess(args);
      case 'media_list/update':
        return playlistActions.updateItem(args);
      default:
        return null;
    }
};
