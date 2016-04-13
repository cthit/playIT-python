#!/usr/bin/env bash

if pgrep playIT_client; then
    echo "Client already running!"
    pkill playIT_client
fi

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

./playIT_client

echo "Press any key to exit"
read -n 1 -s
