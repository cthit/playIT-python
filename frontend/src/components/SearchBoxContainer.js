import { connect } from "react-redux"

import * as mainActions from '../actions/mainActions'

import Searchbox from './Searchbox'


const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch, props) => {
  if (props.activeFeedId === 'tracks') {
    return {
      onToggleButton: () => dispatch(mainActions.showPlaylists())
    }
  } else {
    return {
      onToggleButton: () => dispatch(mainActions.showTracks())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Searchbox)
