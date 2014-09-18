#!/usr/bin/python3
""" The client controller for the playIT backend
by Horv and Eda - 2013, 2014

To add a new type of playback. Add a function called _play_TYPE(media_item)
and define how it's handled. It will be called automatically based on the
type parameter specified in the downloaded json

Requires Python >= 3.3
Depends on:
    1. mopidy -  for Spotify and Soundcloud playback.
            Note that you'll need both the spotify and soundcloud plugins
            Eg. aurget -S mopidy mopidy-spotify mopidy-soundcloud
    2. python-mpd2 (https://github.com/Mic92/python-mpd2)
    3. python-requests (python library) for popping and checking server status.
    4. mpv for video/YouTube playback. http://mpv.io/
    5. youtube-dl


"""
import threading
import requests
import time
import argparse
import queue
import sys
from shutil import which
import subprocess
import websocket
import ssl
import re
import json
import select
# from subprocess import call
from mpd import MPDClient, CommandError

# Some settings and constants
# Use verbose output
VERBOSE = False
MOPIDY_HOST = "localhost"
MOPIDY_PORT = 6600
API_KEY = "42BabaYetuHerpaderp"

def main():
    """ Init and startup goes here... """
    check_reqs()

    playit = PlayIt()
    vprint("Running main playback loop...")
    ploop = threading.Thread(target=playit.start_printloop)
    ploop.daemon = True
    ploop.start()
    
    # eloop = threading.Thread(target=playit.start_eventloop)
    # eloop.daemon = True
    # eloop.start()

    playit.start()
    playit.start_prompt()

def check_reqs():
    """ Verify that all dependencies exists. """
    depends = ["mopidy", "mpv", "youtube-dl"]
    failed = False

    for dep in depends:
        if which(dep) is None:
            print("Requirement", dep, "is missing (from PATH at least...)",
                  file=sys.stderr)
            failed = True

    if failed:
        print("Resolve the above missing requirements", file=sys.stderr)
        exit(1)
    else:
        if not process_exists("mopidy"):
            print("mopidy does not seem to be running.",
                  "Please launch it beforehand :)",
                  file=sys.stderr)
            exit(2)


def interrupt_main():
    from _thread import interrupt_main
    interrupt_main()


def mpd_exec(cmd):
    """ Executes the command named 'cmd' on a fresh MPD connection """
    mpd = MPDClient()
    mpd.connect(MOPIDY_HOST, MOPIDY_PORT)
    retval = getattr(mpd, cmd)()
    mpd.close()
    mpd.disconnect()

    return retval


def process_exists(proc_name):
    """ http://stackoverflow.com/a/7008599 ."""

    import re
    ps = subprocess.Popen("ps ax -o pid= -o args= ",
                          shell=True, stdout=subprocess.PIPE)
    ps_pid = ps.pid
    output = ps.stdout.read()
    ps.stdout.close()
    ps.wait()

    from os import getpid
    for line in output.decode().split("\n"):
        res = re.findall(r"(\d+) (.*)", line)
        if res:
            pid = int(res[0][0])
            if proc_name in res[0][1] and pid != getpid() and pid != ps_pid:
                return True
    return False

def _fix_server_adress(raw_server):
    """ Prepend ws://  there. """
    if not raw_server.startswith("ws://"):
        raw_server = "ws://" + raw_server
    return raw_server

def vprint(msg):
    """ Verbose print """
    if VERBOSE:
        print(msg)


class PlayIt(object):
    SLAVE = False
    CURRENT_PROC = None
    """ Defines the interface between the backend and actual playback. """
    def __init__(self):
        parser = argparse.ArgumentParser()
        parser.add_argument('-m', '--monitor-number', dest="monitor_number",
                            type=int, default=1)
        parser.add_argument('-s', '--server',
                            default="ws://playit.chalmers.it:8888")
        parser.add_argument('-v', '--verbose', action='store_true')
        parser.add_argument('-S', '--slave', action='store_true')
        args = parser.parse_args()

        global VERBOSE
        VERBOSE = args.verbose
        self.SLAVE = args.slave

        if args.server is None:
            print("Please supply a server by: -s ws://www.example.org:port",
                  file=sys.stderr)
            exit(3)
        else:
            self.server = _fix_server_adress(args.server)
            vprint("Server: " + self.server)
            # check_connection(self.server)

        self.monitor_number = args.monitor_number

        self.print_queue = queue.Queue()
        self.map_lock = threading.RLock()

        ws_path = "/ws/playback"
        self._ws = websocket.WebSocketApp(self.server + ws_path,
                                            on_message = self._on_message,
                                            on_error = self._on_error,
                                            on_close = self._on_close)

    def start(self):
        self._ws.run_forever(sslopt={"cert_reqs": ssl.CERT_NONE})

    def _pop_next(self):
        if not self.SLAVE:
            topic = "pop"
            data = dict(token=API_KEY)
            data = json.dumps(data)
            self._ws.send(topic + " " + data)

    def _on_message(self, ws, msg):
        vprint(msg)

        split = re.split("\s", msg, 1)
        vprint(len(split))
        if len(split) == 2:
            topic = split[0]
            data = split[1]
            vprint("Topic: "+topic)
            vprint("Data: "+data)
            if topic == "MEDIA_ITEM/NEW":
                vprint("Playing new item")
                item = json.loads(data)
                play_loop = threading.Thread(target=self.play_item, args=(item,))
                play_loop.start()
            elif topic == "GREETING":
                self._pop_next()

    def _on_error(self, ws, error):
        vprint(error)

    def _on_close(self, ws):
        vprint("Socket closed")

    def play_item(self, item):
        if self.CURRENT_PROC:
            if SLAVE:
                self._stop_everything()
            else:
                return

        if len(item) > 0:
            # Dynamically call the play function based on the media type
            func_name = "_play_" + item['type'].lower()
            vprint("func_name:" + func_name)
            func = getattr(self, func_name)
            func(item)
        else:
            vprint("No item in queue, sleeping...")
        self._pop_next()

    def _play_youtube(self, item):
        """ Play the supplied youtube video with mpv. """
        vprint("_PLAY_YOUTUBE")
        vprint(item)
        self.print_queue.put("Playing youtube video: " + item['title']
                             + " requested by " + item['nick'])
        youtube_url = "https://youtu.be/" + item['external_id']
        youtube_dl = ["youtube-dl", youtube_url, "-g"]

        stream_url = subprocess.check_output(youtube_dl).decode('UTF8').strip()
        cmd = ['mpv', '--really-quiet', '--fs', '--screen',
               str(self.monitor_number), stream_url]

        process = subprocess.Popen(cmd, stdin=subprocess.PIPE,
                                        stdout=subprocess.PIPE,
                                        stderr=subprocess.PIPE)

        self.CURRENT_PROC = process

        def quit():
            process.stdin.write(b'q')
            process.stdin.flush()

        def toggle():
            process.stdin.write(b' ')
            process.stdin.flush()

        # def fseek():
        #     process.stdin.write(b"\x1b[A")
        #     process.stdin.flush()

        # def bseek():
        #     process.stdin.write(b"\x1b[B")
        #     process.stdin.flush()

        self.set_cmd_map({"pause":  toggle,
                          "play":   toggle,
                          "stop":   quit,
                          "toggle": toggle,
                          # "fseek": fseek,
                          # "bseek": bseek,
                          "quit":   quit})

        # while process.poll() is None:
        #     time.sleep(1)
        process.wait()
        self.CURRENT_PROC = None

    def _play_spotify(self, item):
        """ Play the supplied spotify track using mopidy and mpc. """
        self.print_queue.put("Playing " + ", ".join(item['author']) + " - "
                             + item['title'] + " requested by " + item['nick'])
        self._add_to_mopidy('spotify:track:' + item['external_id'])

    def _play_soundcloud(self, item):
        """ Play SoundCloud items """
        self.print_queue.put("Playing " + item['artist'] + " - "
                             + item['title'] + " requested by " + item['nick'])
        self._add_to_mopidy('soundcloud:song.' + item['external_id'])

    def _stop_everything(self):
        try:
            self.CURRENT_PROC.kill()
        except Exception as e:
            vprint(e)

    def _add_to_mopidy(self, track_id):
        vprint("Play mopidy with " + track_id)
        """ Play a mopidy compatible track """
        client = MPDClient()
        client.connect(MOPIDY_HOST, MOPIDY_PORT)
        client.single(1)
        client.clear()
        try:
            client.add(track_id)
            client.play(0)
            self.CURRENT_PROC = True
        except CommandError as e:
            self.print_queue.put("Failed to add song to Mopidy: " + str(e))
        client.close()
        client.disconnect()

        def quit():
            mpd_exec("stop")
            interrupt_main()

        def status():
            song = mpd_exec("currentsong")
            status = mpd_exec("status")
            # TODO: make prettier...
            status_line = song['artist'] + ' - ' + song['title'] + '\n' + \
                          '[' + status['state'] + '] ' + status['elapsed']
            self.print_queue.put(status_line)

        def toggle():
            mpd_exec("pause")
            status()

        def play():
            mpd_exec("play")

        def stop():
            mpd_exec("stop")

        self.set_cmd_map({"pause":  toggle,
                          "play":   play,
                          "stop":   stop,
                          "toggle": toggle,
                          "quit":   quit,
                          "status": status})

        self._mopidy_idle()
        self.CURRENT_PROC = None

    def _mopidy_idle(self):
        client_idle = MPDClient()
        client_idle.connect(MOPIDY_HOST, MOPIDY_PORT)
        while client_idle.status()['state'] != "stop":
            client_idle.idle()

        client_idle.close()
        client_idle.disconnect()

    def set_cmd_map(self, map):
        """ Set the map of all available commands (With thread lock) """
        with self.map_lock:
            self.cmd_map = map

    def start_prompt(self):
        """ Listen for user input (Like a shell) """
        try:
            cmd = ""
            while cmd != 'quit':
                self.print_queue.put('')
                cmd = input()

                if len(cmd) > 0:
                    if cmd in self.cmd_map:
                        self.cmd_map[cmd]()
                    elif cmd == "help":
                        keys = list(self.cmd_map.keys())
                        self.print_queue.put(", ".join(keys))
                    else:
                        self.print_queue.put('Unknown command "' + cmd + '"')

            # Wait for queues to finish
            self.print_queue.join()
        except KeyboardInterrupt:
            exit(1)
            return

    def start_printloop(self):
        """ Prints everything from the print queue """
        while True:
            msg = self.print_queue.get()
            if msg != '':
                msg = msg + '\n'

            print("\r" + msg + "> ", end='')
            self.print_queue.task_done()


if __name__ == "__main__":
    main()