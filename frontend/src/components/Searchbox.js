import React, { Component } from "react";
import MediaEndpoints from "../lib/media_endpoints.js";
import ResultItem from "./ResultItem";

const titleCase = (string) => string[0].toUpperCase() + string.slice(1);

let endpoints = new MediaEndpoints();

let lastSearch;

export default class Searchbox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      results: [],
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

  captureArrowKeys(event) {
    // console.log(event.key);
    switch (event.key) {
      case 'ArrowUp': case 'ArrowDown':
        event.preventDefault();
        this.navigateDropdown(event.key);
        break;

      case 'Enter':
        event.preventDefault();
        if (this.state.results[this.state.selectedIndex]) {
          this.resultClicked(this.state.results[this.state.selectedIndex]);
        }
        break;

      case 'Escape':
        this.showResults(false);
        break;

      default:
        let query = this.query.value;
        this.searchMedia(query);
    }
  }
  showResults(show) {
    this.setState({ show });
  }
  _submitForm(e) {
    e.preventDefault();
    let query = this.query.value;
    let urlResults = endpoints.urlToMediaItem(query);

    if (urlResults.length > 0) {
      let [result] = urlResults;
      this.resultClicked(result);
      return;
    } else {
      this.searchMedia(query);
    }
  }
  searchMedia(query) {
    if (query === lastSearch) {
      return;
    }
    lastSearch = query;
    const {searchSource, activeFeedId} = this.props

    if (!query || activeFeedId === 'playlists') {
      this.setState({results: []});
      return;
    }

    endpoints['search_' + searchSource](query).then((results) => {
      this.setState({ results, selectedIndex: 0, showResults: true });
    }).catch(err => { throw err; });
  }

  resultClicked(result) {
    this.props.addItem(result);
    this.query.blur();
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
    const { onToggleButton, activeFeedId, searchSource, onSelectSource, searchResultVisible, setShowResults} = this.props
    const hidden = activeFeedId !== 'tracks'
    const options = ["spotify", "youtube", "soundcloud"]

    return (
      <div className="search-form">
        <form onSubmit={this._submitForm.bind(this)}>
          <select ref={elem => this.type = elem} style={{'visibility': hidden ? 'hidden' : ''}} value={searchSource} onChange={(event) => onSelectSource(event.target.value)} className={'search-type-select match-' + searchSource}>
            {options.map((value) =>
              (<option key={value} value={value}>{value}</option>)
            )}
          </select>
          <input ref={elem => this.query = elem} type="search" onKeyUp={this.captureArrowKeys.bind(this)} onBlur={() => setTimeout(() => setShowResults(false), 1000) } onFocus={() => setShowResults(true)} id="insert_video" />
          <br/>
          {searchResultVisible && results.length && (
            <div className="results-container">
              <ul className="results-list" ref={elem => this.resultsList = elem}>
                {results.map((result, index) =>
                  (<ResultItem key={result.id} onClick={this.resultClicked.bind(this)} setSelectedNode={this.setSelectedNode} selected={index === selectedIndex} result={result} />)
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
