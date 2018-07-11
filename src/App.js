import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Map from './Map';
import Sidebar from './Sidebar';

class App extends Component {

  componentDidMount() {
    this.sidebarEl.sidebar.addTo(this.mapEl.leafletMap);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Sidebar ref={(r) => this.sidebarEl = r} />
        <Map ref={(r) => this.mapEl = r}/>
      </div>
    );
  }
}

export default App;
