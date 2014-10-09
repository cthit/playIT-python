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
            read -n 1 -s
            exit
        fi
        echo "You need to start mopidy beforehand. Speak to digIT"
        read -n 1 -s
        exit
    fi

    ~/playIT_client.py
    
    echo "Press any key to exit"
    read -n 1 -s
fi
