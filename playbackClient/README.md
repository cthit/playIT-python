playIT playback client
===============
Requires Python >= 3.3

Depends on:

1. [mopidy](http://www.mopidy.com/) - for Spotify and Soundcloud playback. Note that you'll need both the `mopidy-spotify` and `mopidy-soundcloud` plugins.
2. [mpv](http://mpv.io/) - for video/YouTube playback.
3. [youtube-dl](http://rg3.github.io/youtube-dl/) - for retreiving (a more reliable) stream url from youtube.


## Installing dependencies:
### ArchLinux: Using yaourt and pacman
```bash
    $ yaourt -S mopidy mopidy-spotify mopidy-soundcloud python-websocket-client-git python-mpd2
    $ sudo pacman -S mpv youtube-dl
```

### OS X: Using homebrew
```bash
    $ brew install mpv youtube-dl
    $ brew tap mopidy/mopidy
    $ brew install mopidy mopidy-spotify mopidy-soundcloud
```


### Then install python packages:
```bash
    $ pip install -r requirements.txt
```

## Running the playback client:
```bash
    $ ./playIT_client [OPTIONS]
#    OPTIONS:
#      -m, --monitor-number <num>
#        Set the `--screen`-option for `mpv`
#      -s, --server <url>
#        Backend url to connect the playback client
#      -v, --verbose
#        Display verbose output
#      -S, --slave
#        Run the client as slave (only one client should be started without this option)
```
