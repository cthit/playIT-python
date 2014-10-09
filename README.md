playIT-python
=============
This is a playback queue system that lets users of chalmers.it vote on which media from Spotify, YouTube and SoundCloud to play on a running client. 

The system is built on three parts:

### Backend

Responsible for handling the contact between the different parts. Maintains integrity of the voting and queue system.

E.g. tells the playback client that a new item is to be played.

### Frontend

Responsible for showing the queue to the user as well as sending upvote and downvote information to the backend.

### Playback client

Retrieves information about the next item in the queue and plays the item.


This is a rewrite of the [old playIT implemented in grails](https://github.com/cthit/playIT-grails)
