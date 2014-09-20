Playback client
===============
Requires Python >= 3.3
Depends on:
    1. mopidy -  for Spotify and Soundcloud playback.
            Note that you'll need both the spotify and soundcloud plugins
            Eg. aurget -S mopidy mopidy-spotify mopidy-soundcloud
    2. python-mpd2 (https://github.com/Mic92/python-mpd2)
    3. python-websockets (python library) for managing WebSockets used in 
            communication between backend and frontend.
    4. mpv for video/YouTube playback. http://mpv.io/
    5. youtube-dl for retreiving (a more reliable) stream url from youtube.
            (http://rg3.github.io/youtube-dl/)
