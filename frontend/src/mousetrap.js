import Mousetrap from "mousetrap";

export default {
  registerKeys(app) {
    Mousetrap.bind('/', function(e){
      document.getElementById('insert_video').focus();
      e.preventDefault();
    });
    Mousetrap.bind('esc', function(e){
      document.getElementById('insert_video').blur();
    });
    Mousetrap.bind('j', function(){
      app.nextItem();
    });
    Mousetrap.bind('k', function(){
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
