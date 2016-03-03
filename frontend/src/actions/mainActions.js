export const SET_NOW_PLAYING = 'SET_NOW_PLAYING'
export const SHOW_TRACKS = 'SHOW_TRACKS'
export const SHOW_PLAYLISTS = 'SHOW_PLAYLISTS'

export const setNowPlaying = (item) => ({
    type: SET_NOW_PLAYING,
    item
})

export const showTracks = () => ({
    type: SHOW_TRACKS
})

export const showPlaylists = () => ({
    type: SHOW_PLAYLISTS
})