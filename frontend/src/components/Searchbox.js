import React, { Component } from "react";
import ResultItem from "./ResultItem";
import endpoints from "../lib/media_endpoints";

const titleCase = (string) => string[0].toUpperCase() + string.slice(1);

export default class Searchbox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: 0
    }
  }
  navigateDropdown(keyName) {
    const { selectedIndex, results } = this.state;
    let nextIndex = selectedIndex;
    if (keyName === 'ArrowUp') {
        nextIndex = Math.max(selectedIndex - 1, 0);
    } else {
        nextIndex = Math.min(selectedIndex + 1, results.length - 1);
    }
    this.setState({ selectedIndex: nextIndex });
  }
  submitResultItem(resultItem) {
    this.props.submitMedia(resultItem)
  }
  captureArrowKeys(event) {
    const { setShowResults } = this.props
    // console.log(event.key);
    switch (event.key) {
      case 'ArrowUp': case 'ArrowDown':
        event.preventDefault();
        this.props.navigateDropdown(event.key === 'ArrowUp' ? -1 : 1)
        break;

      case 'Enter':
        event.preventDefault();
        this.submitResultItem(this.props.searchResults[this.props.dropdownIndex]);
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
    const { results, selectedIndex } = this.state;
    const {
      onToggleButton,
      activeFeedId,
      searchSource,
      onSelectSource,
      searchResultVisible,
      setShowResults,
      searchResults,
      searchQuery,
      dropdownIndex
    } = this.props
    const hidden = activeFeedId !== 'tracks'
    const options = ["spotify", "youtube", "soundcloud"]

    return (
      <div className="search-form">
        <form>
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
                 onKeyUp={this.captureArrowKeys.bind(this)}
                 onChange={(event) => this.handleOnChange(event)}
                 /*onBlur={() => setTimeout(() => setShowResults(false), 1000) }*/
                 onFocus={() => setShowResults(true)}
                 id="insert_video"
                 autoComplete="off"
                 value={searchQuery} />
          <br/>
          {searchResultVisible && Boolean(searchResults.length) && (
            <div className="results-container">
              <ul className="results-list" ref={elem => this.resultsList = elem}>
                {searchResults.map((result, index) =>
                  (<ResultItem key={result.id} onClick={() => this.submitResultItem(result)} setSelectedNode={this.setSelectedNode} selected={index === dropdownIndex} result={result} />)
                )}
              </ul>
            </div>
          )}
        </form>
        <button onClick={onToggleButton}>{titleCase(activeFeedId)}</button>
      </div>
    );
  }
}
