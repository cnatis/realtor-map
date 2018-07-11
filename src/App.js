import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Map from './Map';
import Sidebar from './Sidebar';
import ClusterLayer from './ClusterLayer';

class App extends Component {

  state = {
    selectedData: null
  };

  componentDidMount() {
    this.containerEl.addEventListener('marker-clicked', this.onMarkerClicked);
    this.containerEl.addEventListener('map-clicked', this.onMapClicked);

    this.sidebarEl.sidebar.addTo(this.mapEl.leafletMap);

    this.clusterLayer = new ClusterLayer();
    this.clusterLayer.addTo(this.mapEl);
    
    this.sidebarEl.open('home');
  }

  render() {
    return (
      <div className="App" ref={(r) => this.containerEl = r}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Sidebar ref={(r) => this.sidebarEl = r} 
          selectedData={this.state.selectedData}/>
        <Map ref={(r) => this.mapEl = r}/>
      </div>
    );
  }

  // Event handlers
  onMarkerClicked = (e) => {
    this.setState({
      selectedData: e.detail
    });
  };

  onMapClicked = (e) => {
    this.setState({
      selectedData: null
    });
  };
}

export default App;
