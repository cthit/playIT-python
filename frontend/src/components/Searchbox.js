import React, { Component } from "react";
import MediaEndpoints from "../lib/media_endpoints.js";
import ResultItem from "./ResultItem";

const titleCase = (string) => string[0].toUpperCase() + string.slice(1);

let endpoints = new MediaEndpoints();

let lastSearch;

export default class Searchbox extends Component {

  navigateDropdown(keyName) {
    let currentIndex = this.state.selectedIndex;
    let selectedIndex = currentIndex;
    if (keyName === 'ArrowUp') {
        selectedIndex = Math.max(currentIndex - 1, 0);
    } else {
        selectedIndex = Math.min(currentIndex + 1, this.state.results.length - 1);
    }
    this.setState({ selectedIndex });
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
        let query = React.findDOMNode(this.refs.query).value;
        this.searchMedia(query);
    }
  }
  showResults(show) {
    this.setState({ show });
  }
  _submitForm(e) {
    e.preventDefault();
    let query = React.findDOMNode(this.refs.query).value;
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

    if (!query || this.state.tracks === 'playlists') {
      this.setState({results: []});
      return;
    }

    const {searchSource} = this.props
    endpoints['search_' + searchSource](query).then((results) => {
      this.setState({ results, selectedIndex: 0, showResults: true });
    }).catch(err => { throw err; });
  }

  resultClicked(result) {
    this.props.addItem(result);
    React.findDOMNode(this.refs.query).blur();
  }

  searchPlaceholder() {
    let switchType = this.state.type;
    if (this.state.tracks === 'playlists') {
      switchType = 'playlists';
    }
    switch (switchType) {
      case "spotify":
        return "Search for tracks on Spotify";
      case "soundcloud":
        return "Search for tracks on SoundCloud";
      case "youtube":
        return "Search for YouTube videos";
      case "playlists":
        return "Enter playlist URL";
      default:
        return "Search for videos or music";
    }
  }
  render() {
    let resultContainer;
    //if (this.state.show && this.state.results.length > 0) {
    //  let results = this.state.results.map((result, index) =>
    //    (<ResultItem key={result.id} onClick={this.resultClicked.bind(this)} setSelectedNode={this.setSelectedNode} selected={index === this.state.selectedIndex} result={result} />)
    //  );
    //  resultContainer = (
    //  <div className="results-container">
    //    <ul className="results-list" ref="resultsList">{results}</ul>
    //  </div>);

    //}
    const options = ["spotify", "youtube", "soundcloud"].map((value) =>
      (<option key={value} value={value}>{value}</option>)
    );
    const {onToggleButton, activeFeedId, searchSource, onSelectSource} = this.props
    const hidden = activeFeedId !== 'tracks';
    return (
      <div className="search-form">
        <form onSubmit={this._submitForm.bind(this)}>
          <select ref="type" style={{'visibility': hidden ? 'hidden' : ''}} value={searchSource} onChange={(event) => onSelectSource(event.target.value)} className={'search-type-select match-' + searchSource}>
            {options}
          </select>
          <input ref="query" type="search" onKeyUp={this.captureArrowKeys.bind(this)} onBlur={() => setTimeout(() => this.showResults(false), 1000) } onFocus={() => this.showResults(true)} id="insert_video" />
          <br/>
          {resultContainer}
        </form>
        <button onClick={onToggleButton}>{titleCase(activeFeedId)}</button>
      </div>
    );
  }
}
