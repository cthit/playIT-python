import React from "react";
import MediaEndpoints from "../media_endpoints.js";
import ResultItem from "./result_item.jsx";

let endpoints = new MediaEndpoints();

let lastSearch;

var Searchbox = React.createClass({
  getOptionValues() {
    return [
      ["spotify", "Spotify"],
      ["youtube", "YouTube"],
      ["soundcloud", "SoundCloud"]
    ];
  },
  _update_type() {
    let value = this.refs.type.getDOMNode().value;
    localStorage.setItem('type', value);
    this.setState({type: value, results: []});
  },
  navigateDropdown(keyName) {
    let currentIndex = this.state.selectedIndex;
    let selectedIndex = currentIndex;
    if (keyName === 'ArrowUp') {
        selectedIndex = Math.max(currentIndex - 1, 0);
    } else {
        selectedIndex = Math.min(currentIndex + 1, this.state.results.length - 1);
    }
    this.setState({ selectedIndex });
  },
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
        let query = this.refs.query.getDOMNode().value;
        this.searchMedia(query);
    }
  },
  getInitialState() {
    var type = localStorage.getItem('type');
    return {
      type: type || 'youtube',
      show: false,
      selectedIndex: null,
      results: []
    };
  },
  showResults(show) {
    this.setState({ show });
  },
  _submitForm(e) {
    e.preventDefault();
    let query = this.refs.query.getDOMNode().value;
    let urlResults = endpoints.urlToMediaItem(query);

    if (urlResults.length > 0) {
      let [result] = urlResults;
      this.resultClicked(result);
      return;
    } else {
      this.searchMedia(query);
    }
  },
  searchMedia(query) {
    if (!query || query === lastSearch) {
      return;
    }

    lastSearch = query;

    endpoints['search_' + this.state.type](query).then((results) => {
      this.setState({ results, selectedIndex: 0, showResults: true });
    }).catch(err => { throw err; });
  },
  resultClicked(result) {
    this.props.addItem(result);
    this.refs.query.getDOMNode().blur();
  },
  searchPlaceholder() {
    switch (this.state.type) {
      case "spotify":
        return "Search for tracks on Spotify";
      case "soundcloud":
        return "Search for tracks on SoundCloud";
      case "youtube":
        return "Search for YouTube videos";
      default:
        return "Search for videos or music";
    }
  },
  render() {
    let resultContainer;
    if (this.state.show && this.state.results.length > 0) {
      let results = this.state.results.map((result, index) =>
        (<ResultItem key={result.id} onClick={this.resultClicked} setSelectedNode={this.setSelectedNode} selected={index === this.state.selectedIndex} result={result} />)
      );
      resultContainer = (
      <div className="results-container">
        <ul className="results-list" ref="resultsList">{results}</ul>
      </div>);

    }
    let options = this.getOptionValues().map(([value, display]) =>
      (<option key={value} value={value}>{display}</option>)
    );
    return (
      <form className="search-form" onSubmit={this._submitForm}>
        <select ref="type" value={this.state.type} onChange={this._update_type} className={'search-type-select match-' + this.state.type}>
          {options}
        </select>
        <input ref="query" type="search" onKeyUp={this.captureArrowKeys} onBlur={() => this.showResults(false)} onFocus={() => this.showResults(true)} id="insert_video" placeholder={this.searchPlaceholder()} />
        <br/>
        {resultContainer}
      </form>
    );
  }
});

export default Searchbox;
