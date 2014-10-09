#!/usr/bin/env bash

if pgrep playIT_client.py; then
    echo "Client already running!"
    pkill playIT_client.py
fi

# Fetch new version of client
url="https://raw.githubusercontent.com/cthit/playIT-python/master/playbackClient/playIT_client.py"
if wget $url -q -O ~/playIT_client.py
    then
    chmod +x ~/playIT_client.py

    # Is mopidy running?
    if ! pgrep mopidy >/dev/null
        then
        if ! which mopidy; then
            echo "Cannot find mopidy. Is it installed?"
            exit
        fi
        echo "Starting mopidy"
        mopidy >/dev/null 2>&1 &
    fi
    ~/playIT_client.py
    # Kill my own children
    [[ -z "$(jobs -p)" ]] || kill $(jobs -p)
fi
