import React, { Component } from 'react';
import './App.css';

import Map from './Map';
import Sidebar from './Sidebar';
import ClusterLayer from './ClusterLayer';

class App extends Component {

  state = {
    selectedDataType: null,
    selectedData: null,
    searchOptions: {
        PropertySearchTypeId: 0,
        TransactionTypeId: 2,
        PriceMin: 0,
        PriceMax: 500000,
        StoryRange: '0-10',
        BedRange: '0-10',
        BathRange: '0-10'
    },
    housingProperties: []
  };

  componentDidMount() {
    this.containerEl.addEventListener('marker-clicked', this.onMarkerClicked);
    this.containerEl.addEventListener('map-clicked', this.onMapClicked);
    this.containerEl.addEventListener('feature-clicked', this.onFeatureClicked);

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
          selectedDataType={this.state.selectedDataType}
          searchOptions={this.state.searchOptions}
          onSearchChanged={this.handleSearchChanged}
          housingProperties={this.state.housingProperties}
        />
        <Map ref={(r) => this.mapEl = r} searchOptions={this.state.searchOptions} onHousingChanged={this.handleHousingChanged} />
      </div>
    );
  }

  handleHousingChanged = (housingData) => {
  	this.clusterLayer.updateRecords(housingData.Pins);

  	let housingProperties = housingData.Results.reduce((lookup, result) => {
  		lookup[result.Id] = result;
  		return lookup;
    }, {});

  	this.setState({
	    housingProperties: housingProperties
    });
  };

  handleSearchChanged = (opts) => {
  	this.setState({
	    searchOptions: opts
    });
  };

  // Event handlers
  onMarkerClicked = (e) => {
    this.setState({
      selectedData: e.detail,
      selectedDataType: 'marker'
    });
  };

  onMapClicked = (e) => {
    this.setState({
      selectedData: null
    });
  };

  onFeatureClicked = (e) => {
      this.setState({
          selectedData: e.detail,
          selectedDataType: 'feature'
      });
  };

}

export default App;
