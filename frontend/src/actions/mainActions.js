export const SET_NOW_PLAYING = 'SET_NOW_PLAYING'
export const SHOW_TRACKS = 'SHOW_TRACKS'
export const SHOW_PLAYLISTS = 'SHOW_PLAYLISTS'
export const FEED_NAVIGATE = 'FEED_NAVIGATE'
export const FEED_NAVIGATE_TOP = 'FEED_NAVIGATE_TOP'
export const FEED_NAVIGATE_BOTTOM = 'FEED_NAVIGATE_BOTTOM'

export const SET_CONNECTED = 'SET_CONNECTED'
export const SET_DISCONNECTED = 'SET_DISCONNECTED'

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

export const feedNavigate = (direction) => ({
    type: FEED_NAVIGATE,
    direction
})

export const feedNavigateTop = () => ({
    type: FEED_NAVIGATE_TOP
})

export const feedNavigateBottom = () => ({
    type: FEED_NAVIGATE_BOTTOM
})

export const setConnected = () => ({
    type: SET_CONNECTED
})

export const setDisconnected = () => ({
    type: SET_DISCONNECTED
})
