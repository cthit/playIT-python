import React, { Component } from "react";
import ResultItem from "./ResultItem";
import endpoints from "../lib/media_endpoints";

const titleCase = (string) => string[0].toUpperCase() + string.slice(1);

const feedIdToClassName = {
  playlists: 'fa-music',
  tracks: 'fa-align-justify'
}

export default class Searchbox extends Component {
  submitResultItem(resultItem) {
    this.props.submitMedia(resultItem)
  }
  captureArrowKeys(event) {
    const { setShowResults, activeFeedId, searchQuery } = this.props
    switch (event.key) {
      case 'ArrowUp': case 'ArrowDown':
        event.preventDefault();
        this.props.navigateDropdown(event.key === 'ArrowUp' ? -1 : 1)
        break;

      case 'Enter':
        event.preventDefault();
        if (activeFeedId === 'playlists') {
          const matches = searchQuery.match(/list=([^&]+)/)
          if (matches && matches[1]) {
            this.submitResultItem({
              type: 'youtube_list',
              external_id: matches[1],
              id: matches[1]
            });
          }
        } else {
          this.submitResultItem(this.props.searchResults[this.props.dropdownIndex]);
        }
        break;

      case 'Escape':
        this.props.setShowResults(false)
        break;
    }
  }

  handleOnChange(event) {
    this.props.setSearchQuery(event.target.value, this.props.searchSource)
  }

  searchPlaceholder() {
    const {searchSource, activeFeedId} = this.props
    if (activeFeedId === 'playlists') {
      return "Enter playlist URL"
    }
    switch (searchSource) {
      case "spotify":
        return "Search for tracks on Spotify";
      case "soundcloud":
        return "Search for tracks on SoundCloud";
      case "youtube":
        return "Search for YouTube videos";
      default:
        return "Search for videos or music";
    }
  }
  render() {
    const {
      onToggleButton,
      activeFeedId,
      searchSource,
      onSelectSource,
      searchResultVisible,
      setShowResults,
      searchResults,
      searchQuery,
      dropdownIndex,
      connected
    } = this.props
    const hidden = activeFeedId !== 'tracks'
    const options = ["spotify", "youtube", "soundcloud"]

    return (
      <div className="search-form">
        <form onSubmit={e => e.preventDefault()}>
          <select ref={elem => this.type = elem}
                  style={{'visibility': hidden ? 'hidden' : ''}}
                  value={searchSource}
                  onChange={(event) => onSelectSource(event.target.value)}
                  className={'search-type-select match-' + searchSource}>
            {options.map((value) =>
              (<option key={value} value={value}>{value}</option>)
            )}
          </select>
          <input ref={elem => this.query = elem}
                 type="search"
                 onKeyDown={this.captureArrowKeys.bind(this)}
                 onChange={(event) => this.handleOnChange(event)}
                 onFocus={() => setShowResults(true)}
                 id="insert_video"
                 disabled={!connected}
                 autoComplete="off"
                 placeholder={this.searchPlaceholder()}
                 value={searchQuery} />
          {searchResultVisible && Boolean(searchResults.length) && (
            <div className="results-container">
              <ul className="results-list" ref={elem => this.resultsList = elem}>
                {searchResults.map((result, index) =>
                  (<ResultItem key={result.id} onClick={() => this.submitResultItem(result)} selected={index === dropdownIndex} result={result} />)
                )}
              </ul>
            </div>
          )}
        </form>
        <button onClick={onToggleButton} className="toggle-button"><i className={"fa " + feedIdToClassName[activeFeedId]}></i></button>
      </div>
    );
  }
}
