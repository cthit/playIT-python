import * as mainActions from '../actions/mainActions'
import * as trackActions from '../actions/trackActions'

export default (topic, args) => {
    if (typeof args === 'string' && args.match(/Internal server error/)) {
      console.error(topic, args);
      return
    }

    switch (topic) {
      case 'playing/status':
        return mainActions.setNowPlaying(args);

      case 'queue/update':
      case 'media_list/queue/update':
        return trackActions.receiveItemsSuccess(args);
      case 'media_list/update':
      case 'media_item/update':
        return trackActions.updateItem(args);
      case 'media_list/new':
      case 'media_item/new':
        return trackActions.receiveItem(args);
      case 'media_list/new/success':
      case 'media_item/new/success':
        return trackActions.receiveItemSuccess(args);
      case 'media_list/delete':
      case 'media_item/delete':
        return trackActions.removeItem(args);
      default:
        return null;
    }
};
