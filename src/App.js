import React from 'react';
import logo from './images/giphy-logo.png';
import './App.css';
include ()

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
      </header>
    </div>
  );
}

export default App;
