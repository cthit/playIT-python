FROM python:3-onbuild

RUN wget -q -O /etc/apt/sources.list.d/mopidy.list https://apt.mopidy.com/jessie.list

RUN apt-get update \
	&& apt-get install -y \
		mopidy \
		mopidy-spotify \
		mopidy-soundcloud \
		mpv \
		youtube-dl \
	&& rm -rf /var/lib/apt/lists/*


CMD [ "python", "./app.py" ]
