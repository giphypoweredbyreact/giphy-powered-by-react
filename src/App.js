import React, {Component} from 'react';
import logo from './images/giphy-logo.png';
import './App.css';
import {fetchGifs} from './giphyService';

class GifContainer extends Component {
  constructor(props) {
    super(props);

    //set initial state
    this.state = {
      search: this.props.search,
      error: false,
      hasMore: true,
      isLoading: false,
      noResults: false,
      totalResults: 0,
      offset: 0,
      gifs: [],
      column1: [],
      column2: [],
      column3: [],
    }

    // Binds our scroll event handler
    window.onscroll = () => {
      const {
        loadGifs,
        state: {
          error,
          isLoading,
          hasMore,
          offset,
        },
      } = this;

      // Bails early if:
      // * there's an error
      // * it's already loading
      // * there's nothing left to load
      if (error || isLoading || !hasMore) return;

      // Checks that the page has scrolled to the bottom
      if (
        window.innerHeight + document.documentElement.scrollTop
        === document.documentElement.offsetHeight
      ) {
        if (this.state.search !== '') {
          loadGifs(offset);
        }
      }
    };
  }

  componentDidMount() {
    // load gifs on initial load
    if (this.state.search !== '') {
      this.loadGifs();
    }
  }

  componentDidUpdate(prevProps) {
    //compare props in case search string changes
    if (this.props.search !== prevProps.search) {
      this.setState({
        search: this.props.search,
        error: false,
        hasMore: true,
        isLoading: false,
        noResults: false,
        totalResults: 0,
        offset: 0,
        gifs: [],
        column1: [],
        column2: [],
        column3: [],
      });
      this.loadGifs();
    }
  }

  loadGifs = () => {
    this.setState({ isLoading: true }, () => {
      fetchGifs(this.state.search, this.state.offset)
        .then((results) => {
          console.log(results);
          // Creates a massaged array of gif data
          const nextGifs = results.data.map(gif => ({
            key: gif.id,
            title: gif.title,
            url: gif.images.downsized_medium.url,
          }));

          var array1 = [];
          var array2 = [];
          var array3 = [];

          for(var i=0; i < nextGifs.length; i++) {
            if (i%3 === 0) {
              array1 = array1.concat(nextGifs[i]);
            } else if(i%3 === 1) {
              array2 = array2.concat(nextGifs[i]);
            } else {
              array3 = array3.concat(nextGifs[i]);
            }
          }

          console.log(array1);
          console.log(array2);
          console.log(array3);

          const nextGifsOrganized = [
            ...array1,
            ...array2,
            ...array3,
          ];

          console.log(nextGifsOrganized);
          this.state.column1 = this.state.column1.concat(array1);
          this.state.column2 = this.state.column2.concat(array2);
          this.state.column3 = this.state.column3.concat(array3);



          // Merges the next users into our existing users
          this.setState({
            // Note: Depending on the API you're using, this value may
            // be returned as part of the payload to indicate that there
            // is no additional data to be loaded
            hasMore: (this.state.gifs.length <results.pagination.total_count),
            isLoading: false,
            offset: this.state.offset + 12,
            noResults: results.pagination.total_count === 0,
            totalResults: results.pagination.total_count,
            gifs: [
              ...this.state.column1,
              ...this.state.column2,
              ...this.state.column3,
            ],
          });
        })
        .catch((err) => {
          this.setState({
            error: err.message,
            isLoading: false,
           });
        })
    });
  }

  render() {
    return (
      <div>
        {this.state.totalResults !== 0 &&
          <div>
            <p id="total-results">Total Results: {this.state.totalResults}</p>
          </div>
        }
        <div id="grid">
          {this.state.gifs.map(gif => (
            <div className="masonry-with-columns" key={gif.key}>
              <img
                alt={gif.title}
                src={gif.url}
                style={{
                  borderRadius: '4px',
                  height:'9em',
                  width: '100%',
                }}
              />
            </div>
          ))}
          </div>
          <div id="bottom-panel">
            {this.state.error &&
              <div style={{ color: '#900' }}>
                <p>{this.state.error}</p>
              </div>
            }
            {this.state.isLoading &&
              <div>
                <p>Loading...</p>
              </div>
            }
            {this.state.noResults &&
              <div>
                <p>No Results</p>
              </div>
            }
            {!this.state.noResults && !this.state.hasMore &&
              <div>
                <p>All Gifs Have Been Loaded</p>
                </div>
            }
          </div>
      </div>
    );
  }

}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchInput: '',
      searchString: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState(
      {searchInput : event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState(
      {searchString : this.state.searchInput });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div id='searchbar'>
                <form onSubmit={this.handleSubmit}>
                  <img id='logo' src={logo} className="App-logo" alt="logo" />
                  <h2>Giphy Powered By React</h2>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input type="text" placeholder="Giphy Search.." name="search" value={this.state.searchInput} onChange={this.handleChange}/>
                </form>
          </div>
          <div id="gif-container">
            <GifContainer search={this.state.searchString}/>
          </div>
        </header>
      </div>
    );
  }

}

export default App;
