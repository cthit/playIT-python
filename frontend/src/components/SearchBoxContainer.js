import { connect } from "react-redux"

import * as mainActions from '../actions/mainActions'
import * as searchBoxActions from '../actions/searchBoxActions'

import Searchbox from './Searchbox'


const mapStateToProps = (state) => ({
  searchSource: state.searchBox.source
})

const mapDispatchToProps = (dispatch, props) => {
  const actions = {
    onSelectSource: (source) => dispatch(searchBoxActions.setSearchSource(source))
  }
  if (props.activeFeedId === 'tracks') {
    return {
      ...actions,
      onToggleButton: () => dispatch(mainActions.showPlaylists())
    }
  } else {
    return {
      ...actions,
      onToggleButton: () => dispatch(mainActions.showTracks())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Searchbox)
