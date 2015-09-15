import Mousetrap from "mousetrap";

export default {
  registerKeys(app) {
    var defaultCallback = Mousetrap.stopCallback;
    Mousetrap.stopCallback = function(e, element, combo) {
      if (combo === 'esc' || combo === 'tab' || combo === 'enter') {
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
    Mousetrap.bind(['j', 'down'], function(){
      app.nextItem();
    });
    Mousetrap.bind(['k', 'up'], function(){
      app.prevItem();
    });
    Mousetrap.bind('a', function(){
      app.voteItem(1);
    });
    Mousetrap.bind('z', function(){
      app.voteItem(-1);
    });
    Mousetrap.bind(['d d', 'x'], function(){
      app.deleteItem();
    });
  }
}
