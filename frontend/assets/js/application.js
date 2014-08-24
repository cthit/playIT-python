// The function to boot it all!

$(function() {
  $.getJSON("queue.json", function(queue) {
    window.app = new MediaQueue(queue);
    ko.applyBindings(window.app);
  });
});

// Helper function for time formatting
function addZeros(string) {
  var length = 2, pad = '0';
  return (new Array(length + 1).join(pad) + string).slice(-length);
}


// Observable objects to be used with knockout

var MediaItem = function(source) {
  var self = this;

  self.hasVoted = ko.observable(null);
  self.votes = ko.observable(source.weight);
  self.id = source.externalID;
  self.cid = source.cid;
  self.nick = source.nick;
  self.title = source.title;
  self.length = source.length;
  self.author = source.artist || source.user;
  self.details = source.album || source.description;

  if (Array.isArray(self.author)) {
    self.author = self.author.join(', ');
  }

  self.thumbnail = source.thumbnail;
  self.type = source.type;
  self.weight = ko.computed(function() {
      if (self.hasVoted() === null || self.hasVoted() === 0) {
          return self.votes();
      } else {
        return self.votes() + self.hasVoted();
      }
  });


  self.titleAndTime = ko.computed(function() {
    var time = parseInt(self.length);
    var hours = Math.floor(time / 3600);
    time = time - hours * 3600;
    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;

    return self.title + " [" + (hours > 0 ? addZeros(hours) + ':' : '') + addZeros(minutes) + ":" + addZeros(seconds) + "]";
  });

  self.link = ko.computed(function() {
    switch(self.type) {
    case 'youtube':
      return 'http://youtu.be/' + self.id;
    case 'spotify':
      return 'http://open.spotify.com/track/' + self.id;
    case 'soundcloud':
      var artist = self.author.toLowerCase().replace(/ /g, '-'),
          track = self.title.toLowerCase().replace(/ /g, '-');
      return 'http://soundcloud.com/' + artist + '/' + track;
    default:
      throw "Does not recognize type (" + self.type + ")";
    }
  });

  self.vote = function(value) {
    if (self.hasVoted() === value || self.hasVoted() === 0) {
        return false;
    } else {
        self.hasVoted(value);
    }
  };
};
var MediaQueue = function(queue) {
  var self = this;
  queue = queue.map(function(a) {
    return new MediaItem(a);
  });

  self.focusIndex = ko.observable(0);
  self.items = ko.observableArray(queue);

  self.nextItem = function() {
    if (self.items().length - 1 > self.focusIndex()) {
      self.focusIndex(self.focusIndex()+1);
    }
  };
  self.prevItem = function() {
    if (self.focusIndex() > 0) {
      self.focusIndex(self.focusIndex()-1);
    }
  };
  self.voteSelected = function(value) {
    self.items()[self.focusIndex()].vote(value);
  }
  self.setCurrent = function(item) {
    var index = self.items().indexOf(item);
    self.focusIndex(index);
    return true;
  };
};




// Mousetrap keyboard shortcuts

var defaultCallback = Mousetrap.stopCallback;
Mousetrap.stopCallback = function(e, element, combo) {
  if (combo === 'esc') {
    return false;
  } else {
    return defaultCallback(e, element, combo);
  }
}
Mousetrap.bind('/', function(e){
  document.getElementById('insert_video').focus();
  e.preventDefault();
});
Mousetrap.bind('esc', function(e){
  document.getElementById('insert_video').blur();
});
Mousetrap.bind('j', function(){
  window.app.nextItem();
});
Mousetrap.bind('k', function(){
  window.app.prevItem();
});
Mousetrap.bind('a', function(){
  window.app.voteSelected(+1);
});
Mousetrap.bind('z', function(){
  window.app.voteSelected(-1);
});
