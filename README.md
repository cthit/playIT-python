playIT-python
=============
This is a playback queue system that lets users of chalmers.it vote on which media from Spotify, YouTube and SoundCloud to play on a running client.

The system is built on three parts:

### Backend

Responsible for handling the contact between the different parts. Maintains integrity of the voting and queue system.

E.g. tells the playback client that a new item is to be played.

#### Setup for deployment with docker

1. Copy `options_example.py` to `options_local.py` or something similar (try to avoid `options.py` since then it will be copied into the docker image when built)
2. Fill in required environment variables, api-keys etc.
3. Build docker with: `docker build -t playit .`
4. Run image with: `docker run -it -v $(pwd)/options_local.py:/usr/src/app/options.py --rm --name playit-running playit`

### Frontend

Responsible for showing the queue to the user as well as sending upvote and downvote information to the backend.

### Playback client

Retrieves information about the next item in the queue and plays the item.

#### Install python requirements by running:
```bash
pip3 install -r playbackClient/requirements.txt
```

#### Install mopidy, mpv and youtube-dl'
##### Archlinux
```
pacman -S mopidy mpv youtubedl
```
##### Debian, ubuntu / mint
```
sudo apt-get install mopidy mpv youtube-dl
```

#### Configure mopidy for spotify and soundcloud:
Add this to your ~/.config/mopidy/mopidy.conf file. (create it if it doesn't exist)

```
[spotify]
username = *username*
password = *password*

[soundcloud]
auth_token = *token*
explore_songs = 25
```


#### Start mopidy service:
##### Archlinux:
```
sudo systemctl start mopidy
```
##### Debian: Ubuntu / mint
```
sudo service start mopidy
```

#### Example usage
```
playbackClient/playbackClient.py -s hostname:8888
```
