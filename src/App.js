import React, {Component} from 'react';
import logo from './images/giphy-logo.png';
import './App.css';
import {fetchGifs} from './giphyService';
//import debounce from 'lodash.debounce';

class GifContainer extends Component {
  constructor(props) {
    super (props);

    //set initial state
    this.state = {
      error: false,
      hasMore: true,
      isLoading: false,
      noResults: false,
      totalResults: 0,
      offset: 0,
      gifs: [],
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
        loadGifs(offset);
      }
    };
  }


  componentDidMount() {
    // load gifs on initial load
    this.loadGifs();
  }

  loadGifs = () => {
    this.setState({ isLoading: true }, () => {
      fetchGifs(this.state.offset)
        .then((results) => {
          console.log(results);
          // Creates a massaged array of gif data
          const nextGifs = results.data.map(gif => ({
            key: gif.id,
            title: gif.title,
            url: gif.images.downsized_medium.url,
          }));

          // Merges the next users into our existing users
          this.setState({
            // Note: Depending on the API you're using, this value may
            // be returned as part of the payload to indicate that there
            // is no additional data to be loaded
            hasMore: (this.state.gifs.length <results.pagination.total_count),
            isLoading: false,
            offset: this.state.offset + 10,
            noResults: results.pagination.total_count === 0,
            totalResults: results.pagination.total_count,
            gifs: [
              ...this.state.gifs,
              ...nextGifs,
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
                  height:'100%',
                  width: '100%',
                }}
              />
            </div>
          ))}
          </div>
          <div id="bottom-panel">
            {this.error &&
              <div style={{ color: '#900' }}>
                {this.error}
              </div>
            }
            {this.isLoading &&
              <div>Loading...</div>
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

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div id='searchbar'>
              <form action="/action_page.php">
                <img id='logo' src={logo} className="App-logo" alt="logo" />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type="text" placeholder="Giphy Search.." name="search" />
              </form>
        </div>
        <div id="gif-container">
          <GifContainer />
        </div>
      </header>
    </div>
  );
}

export default App;
