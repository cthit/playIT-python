import React, { Component } from "react";
import MediaEndpoints from "../lib/media_endpoints.js";
import ResultItem from "./ResultItem";
import ToggleButton from "./ToggleButton";


let endpoints = new MediaEndpoints();

let lastSearch;

export default class Searchbox extends Component {
  constructor(props) {
    super(props);
    var type = localStorage.getItem('type');
    this.state =  {
      type: type || 'youtube',
      tracks: 'tracks',
      show: false,
      selectedIndex: null,
      results: []
    };
  }
  getOptionValues() {
    return [
      ["spotify", "Spotify"],
      ["youtube", "YouTube"],
      ["soundcloud", "SoundCloud"]
    ];
  }
  _update_type() {
    let value = React.findDOMNode(this.refs.type).value;
    localStorage.setItem('type', value);
    this.setState({type: value, results: []});
  }
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

    endpoints['search_' + this.state.type](query).then((results) => {
      this.setState({ results, selectedIndex: 0, showResults: true });
    }).catch(err => { throw err; });
  }
  resultClicked(result) {
    this.props.addItem(result);
    React.findDOMNode(this.refs.query).blur();
  }
  setQueueType(type) {
    this.props.changeQueueType(type);
    this.setState({
      tracks: type
    });
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
    if (this.state.show && this.state.results.length > 0) {
      let results = this.state.results.map((result, index) =>
        (<ResultItem key={result.id} onClick={this.resultClicked.bind(this)} setSelectedNode={this.setSelectedNode} selected={index === this.state.selectedIndex} result={result} />)
      );
      resultContainer = (
      <div className="results-container">
        <ul className="results-list" ref="resultsList">{results}</ul>
      </div>);

    }
    let options = this.getOptionValues().map(([value, display]) =>
      (<option key={value} value={value}>{display}</option>)
    );
    let hidden = this.state.tracks !== 'tracks';
    return (
      <div className="search-form">
        <form onSubmit={this._submitForm.bind(this)}>
          <select ref="type" style={{'visibility': hidden ? 'hidden' : ''}} value={this.state.type} onChange={this._update_type.bind(this)} className={'search-type-select match-' + this.state.type}>
            {options}
          </select>
          <input ref="query" type="search" onKeyUp={this.captureArrowKeys.bind(this)} onBlur={() => setTimeout(() => this.showResults(false), 1000) } onFocus={() => this.showResults(true)} id="insert_video" placeholder={this.searchPlaceholder()} />
          <br/>
          {resultContainer}
        </form>
        <ToggleButton options={['tracks', 'playlists']} onChange={this.setQueueType.bind(this)} default={this.state.tracks} />
      </div>
    );
  }
}

