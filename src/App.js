import React, { Component } from 'react';
import './App.css';

import Map from './Map';
import Sidebar from './Sidebar';
import ClusterLayer from './ClusterLayer';
import realtorApi from "./services/realtorApi";
import _ from 'lodash';

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
  	let housingProperties = housingData.Results.reduce((lookup, result) => {
  		lookup[result.Id] = result;
  		return lookup;
    }, {});

  	this.setState({
	    housingProperties: housingProperties
    });

    this.clusterLayer.updateRecords(housingData.Pins, housingProperties);
  };

  handleSearchChanged = (opts) => {
  	this.setState({
	    searchOptions: opts
    });
  };

  // Event handlers
  onMarkerClicked = (e) => {
  	let item = e.detail.record;
  	if (item.key) {
  		// if this exists then we don't have the housing data for this item
	   this.requestGroupDetails(item);
    }

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

	requestGroupDetails = (pin) => {
		let bounds = this.mapEl.leafletMap.getBounds();

		let opts = {
			LongitudeMin: bounds.getWest(),
			LongitudeMax: bounds.getEast(),
			LatitudeMin: bounds.getSouth(),
			LatitudeMax: bounds.getNorth(),
			GroupKey: pin.key
		};
		Object.assign(opts, this.state.searchOptions);

		return realtorApi.query(opts)
			.then((results) => {
				console.log(results);

				// search for the matching pin since the group search uses a larger lat/lon area
				let index = _.findIndex(results.Results, (o) => {
					return pin.latitude === o.Property.Address.latitude && pin.longitude === o.Property.Address.longitude;
				});

				let firstResult = (index >= 0)? results.Results[index] : results.Results[0];
				let selectedId = firstResult.Id;

				let updatedSelectedItem = Object.assign({}, this.state.selectedData.record, { key: "", propertyId: selectedId });
				let updatedHousingProperties = Object.assign({}, this.state.housingProperties);
				updatedHousingProperties[firstResult.Id] = firstResult;

				this.setState({
					selectedData: { record: updatedSelectedItem },
					housingProperties: updatedHousingProperties
				});
			});
	};


}

export default App;
