import * as mainActions from '../actions/mainActions'
import * as trackActions from '../actions/trackActions'
import * as playlistActions from '../actions/playlistActions'

export default (topic, args) => {
    if (typeof args === 'string' && args.match(/Internal server error/)) {
      console.error(topic, args);
      return
    }

    switch (topic) {
      case 'playing/status':
        return mainActions.setNowPlaying(args);

      case 'queue/update':
        return trackActions.receiveItemsSuccess(args);
      case 'media_item/update':
        return trackActions.updateItem(args);
      case 'media_item/new':
      case 'media_item/new/success':
        return trackActions.receiveItem(args);
      case 'media_item/delete':
        return trackActions.removeItem(args);
      case 'media_list/queue/update':
        return playlistActions.receiveItemsSuccess(args);
      case 'media_list/update':
        return playlistActions.updateItem(args);
      default:
        return null;
    }
};
