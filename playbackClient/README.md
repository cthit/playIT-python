Playback client
===============
Requires Python >= 3.3

Depends on:

1.  [mopidy](http://www.mopidy.com/) - for Spotify and Soundcloud playback. Note that you'll need both the spotify and soundcloud plugins.
2. [python-mpd2](https://github.com/Mic92/python-mpd2) - library used to control mopidy
3. [python-websockets](https://pypi.python.org/pypi/websockets) - (python library) for managing WebSockets used in communication between backend and frontend.
4. [mpv](http://mpv.io/) - for video/YouTube playback.
5. [youtube-dl](http://rg3.github.io/youtube-dl/) - for retreiving (a more reliable) stream url from youtube. 


### Installing dependencies on ArchLinux
#### Using yaourt and pacman
```bash
    $ yaourt -S mopidy mopidy-spotify mopidy-soundcloud python-websocket-client-git python-mpd2
    $ sudo pacman -S mpv youtube-dl
```
