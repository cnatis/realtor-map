import React, { Component } from 'react';
import './App.css';

import Map from './Map';
import Sidebar from './Sidebar';
import ClusterLayer from './ClusterLayer';

class App extends Component {

  state = {
    selectedData: null,
    searchOptions: {
        PropertySearchTypeId: 0,
        TransactionTypeId: 2,
        PriceMin: 0,
        PriceMax: 500000,
        StoryRange: '0-10',
        BedRange: '0-10',
        BathRange: '0-10'
    }
  };

  componentDidMount() {
    this.containerEl.addEventListener('marker-clicked', this.onMarkerClicked);
    this.containerEl.addEventListener('map-clicked', this.onMapClicked);
    this.containerEl.addEventListener('search-options-changed', this.onSearchOptionsChanged);

    this.sidebarEl.sidebar.addTo(this.mapEl.leafletMap);

    this.clusterLayer = new ClusterLayer();
    this.clusterLayer.addTo(this.mapEl);

    this.sidebarEl.open('home');
  }

  render() {
    return (
      <div className="App" ref={(r) => this.containerEl = r}>
        <Sidebar ref={(r) => this.sidebarEl = r} 
          selectedData={this.state.selectedData}
          searchOptions={this.state.searchOptions} />
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

  onSearchOptionsChanged = (e) => {
    this.setState({
      searchOptions: e.detail
    });
  };
}

export default App;
