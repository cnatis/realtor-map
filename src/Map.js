import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet-contextmenu';
import './ext/homezoom';
import _ from 'lodash';

import 'leaflet/dist/leaflet.css';
import 'leaflet-contextmenu/dist/leaflet.contextmenu.css';

import './Map.css';
import { loadGeoJSON } from "./geojson";
import neighbourhoods from "./neighbourhood";
import realtorApi from "./services/realtorApi";

//Set Max Bounds to the entire world
let southWest = L.latLng(-90, -180);
let northEast = L.latLng(90, 180);
let worldBounds = L.latLngBounds(southWest, northEast);

const APIKeys = {
	openCage: 'f6c8cfcc9bca572e651cb10749a0364c',
    google: 'AIzaSyAM_Pu3gMLSzbcUUECCAsYhlFUkBhTteig'
};

class Map extends Component {
	componentDidMount() {
		this.ready = false;
		this.isZooming = false;
		this.isMoving = false;
		this.zoomLevel = 10;
		this.maxZoom = 18;
		this.minZoom = 0;
		
		this.attribution = `<a href="${window.PRODUCT_URL}" target="_blank">${window.PRODUCT_NAME}</a>`;

		this.dataBounds = [[90, 180], [-90, 180]];

		// this.center = [min_latitude + (max_latitude - min_latitude) / 2, min_longitude + (max_longitude - min_longitude) / 2];

		this.homeBounds = new L.latLngBounds(this.dataBounds);

		// Create the leaflet map
		this.leafletMap = L.map(this.containerEl, {
			center: this.center,
			zoom: this.zoomLevel,
			maxBounds: worldBounds,
			layers: [],
			zoomControl: false,
			contextmenu: true,
			contextmenuMinWidth: 130,
			contextmenuItems: [{
				text: 'Show me the StreetView!',
				callback: this.onShowStreetView
			}, {
				text: 'Center map here',
				callback: this.onCenterMap
			}, '-', {
				text: 'Zoom in',
				icon: 'images/icons/zoom-in.png',
				callback: this.onZoomIn
			}, {
				text: 'Zoom out',
				icon: 'images/icons/zoom-out.png',
				callback: this.onZoomOut
			}]
		});

		// Leaflet map events
		this.leafletMap.on('layeradd', this.onLayerAdded);
		this.leafletMap.on('movestart', this.onMoveStart);
		this.leafletMap.on('moveend', this.onMoveEnd);
		this.leafletMap.on('zoomstart', this.onZoomStart);
		this.leafletMap.on('zoomend', this.onZoomEnd);
		this.leafletMap.on('viewreset', this.onViewReset);
		this.leafletMap.on('click', this.onClick);

		// Setup Map Layers
		this.baseLayers = {};
		this.baseLayerErrorState = {};
		this.isLoadingLayerConfig = true;
		this.defaultLayerAdded = false;

        // Add Layer Control To Map
        this.layerControl = L.control.layers(this.baseLayers, [], {
            collapsed: false,
            position: 'topleft'
        })
        .addTo(this.leafletMap);

        const basemap = L.tileLayer('http://a.basemaps.cartocdn.com/pitney-bowes-streets/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.pitneybowes.com">Pitney Bowes</a> contributors'
        }).addTo(this.leafletMap);

        this.overlayLayers = [];
        this.layerControl.addBaseLayer(basemap, 'Base Map');

        for (let dataProperties in neighbourhoods[0].features[0].properties){
        	if (dataProperties != 'AREA_S_CD' && dataProperties != 'AREA_NAME') {
                let this_layer = loadGeoJSON(dataProperties);
                this.overlayLayers.push(this_layer);
                this.layerControl.addOverlay(this_layer, dataProperties);
            }
		}

        this.leafletMap.fitBounds(this.overlayLayers[0].getBounds());


        // Add home button
        this.zoomHome = new L.Control.zoomHome({
            position: 'topleft',
            homeCoordinates: this.homeBounds
        })
        .addTo(this.leafletMap);

        // this.geocodeControl = new GeocodeControl({
        //     key: APIKeys.openCage,
        //     limit: 5, // number of results to be displayed
        //     position: 'topleft',
        //     errorMessage: 'Nothing found.'
        // })
        // .addTo(this.leafletMap);

        // Fit the home bounds
        // this.fitBounds(this.homeBounds, {
        //     padding: [50, 50]
        // });

        // Map from layer name/id to layer

	}

    // Internal methods
	// loadLayerFromConfig = (config, types) => {
	// 	if(typeof(config.type) === 'undefined' || config.type === null) {
	// 		console.warn(`Layer config missing type for URL ${config.url}`);
	// 		return Promise.reject(`Layer config missing type for URL ${config.url}`);
	// 	}

	// 	if(typeof(config.label) === 'undefined' || config.label === null) {
	// 		console.warn(`Layer config missing label for URL ${config.url}`);
	// 		return Promise.reject(`Layer config missing label for URL ${config.url}`);
	// 	}

	// 	if(typeof(config.url) === 'undefined' || config.url === null) {
	// 		console.warn(`Layer config missing URL for label ${config.label}`);
	// 		return Promise.reject(`Layer config missing URL for label ${config.label}`);
	// 	}

	// 	if(config.type === 'wms') {
	// 		// WMS layers need CRS and layers properties
	// 		if(typeof(config.options) === 'undefined' || config.options === null) {
	// 			console.warn(`Layer config missing options for label ${config.label}`);
	// 			return Promise.reject(`Layer config missing options for label ${config.label}`);
	// 		}

	// 		if(typeof(config.options.crs) === 'undefined' || config.options.crs === null) {
	// 			console.warn(`Layer config missing CRS option for label ${config.label}`);
	// 			return Promise.reject(`Layer config missing CRS option for label ${config.label}`);
	// 		}

	// 		if(typeof(config.options.layers) === 'undefined' || config.options.layers === null || config.options.layers.length === 0) {
	// 			console.warn(`Layer config missing layers option for label ${config.label}`);
	// 			return Promise.reject(`Layer config missing layers option for label ${config.label}`);
	// 		}
	// 	}

	// 	// Merge config options with defaults
	// 	let options = Object.assign({
	// 		maxZoom: this.maxZoom,
	// 		minZoom: this.minZoom,
	// 		attribution: ''
	// 	}, config.options);

	// 	if(options.attribution.trim().length === 0) {
	// 		options.attribution = this.gtAttribution;
	// 	}
	// 	else {
	// 		options.attribution += ' | ' + this.gtAttribution;
	// 	}

	// 	// Convert string CRS value to leaflet object
	// 	let crs;
	// 	if(options.crs && typeof(options.crs) === 'string') {
	// 		crs = this.parseCRS(options.crs);

	// 		if(typeof(crs) !== 'undefined' && crs !== null) {
	// 			crs.toString = function() {
	// 				return crs.code;
	// 			};
	// 			options.crs = crs;
	// 		}
	// 		else {
	// 			console.warn(`Invalid CRS for label ${config.label}`);
	// 			return Promise.reject(`Invalid CRS for label ${config.label}`);
	// 		}
	// 	}

	// 	let loadPromise;

	// 	if(config.type === 'tile') {
	// 		// Default tile layer
	// 		loadPromise = Promise.resolve(L.tileLayer(config.url, options));
	// 	}
	// 	else {
	// 		// Custom layer type
	// 		let typeInfo = types[config.type];

	// 		if(typeof(typeInfo) === 'undefined' || typeInfo === null) {
	// 			console.warn(`Missing type info for map layer type ${config.type}`);
	// 			return Promise.reject(`Missing type info for map layer type ${config.type}`);
	// 		}

	// 		loadPromise = new Promise((resolve, reject) => {
	// 			let depPromise = Promise.resolve();
	// 			if(typeInfo.plugins && typeInfo.plugins.length > 0) {
	// 				depPromise = Promise.all(typeInfo.plugins.map(url => {
	// 					return new Promise(resolve => {
	// 						$.getScript(url, resolve);
	// 					});
	// 				}));
	// 			}

	// 			return depPromise
	// 				.then(() => {
	// 					let splitName = typeInfo.name && typeInfo.name.split('.') || [];
	// 					let constructor = splitName.reduce((result, current) => {
	// 						if(result === null) {
	// 							return window[current];
	// 						}
	// 						else {
	// 							return result && result[current];
	// 						}
	// 					}, null);

	// 					if(typeof(constructor) === 'undefined' || constructor === null) {
	// 						console.warn(`Missing constructor for map layer type ${typeInfo.name}`);
	// 						throw new Error(`Missing constructor for map layer type ${typeInfo.name}`);
	// 					}

	// 					return new constructor(config.url, options);
	// 				})
	// 				.then(resolve)
	// 				.catch(reject);
	// 		});
	// 	}

	// 	return loadPromise.then(layer => {
	// 		if(typeof(layer) !== 'undefined' && layer !== null) {
	// 			if(this.baseLayers[config.label]) {
	// 				// Multiple layers with same label
	// 				console.warn(`Duplicate map layer label ${config.label}`);
	// 				throw new Error(`Duplicate map layer label ${config.label}`);
	// 			}

	// 			layer.on('tileerror', this.onTileError);
	// 			layer.on('tileload', this.onTileLoad);

	// 			this.baseLayers[config.label] = layer;
	// 			layer.options.label = config.label;

	// 			// baseLayerErrorState[lable] === true when there is an error
	// 			this.baseLayerErrorState[config.label] = false;

	// 			if(!this.defaultLayerAdded) {
	// 				this.defaultLayerAdded = true;
	// 				this.leafletMap.addLayer(layer);
	// 			}
	// 		}
	// 	});
	// };

	parseCRS(crsString) {
		switch(crsString) {
			case L.CRS.EPSG3857.code:
				return L.CRS.EPSG3857;
				break;
			case L.CRS.EPSG4326.code:
				return L.CRS.EPSG4326;
				break;
			case L.CRS.EPSG3395.code:
				return L.CRS.EPSG3395;
				break;
		}

		return null;
	};

	checkReady = () => {
		if(!this.isMoving && !this.isZooming && !this.isLoadingLayerConfig) {
			this.ready = true;
		}
	};

	// Methods
	update = () => {
		this.ready = false;
	};

	updateHomeBounds = (bnds) => {
		this.homeBounds = bnds;
		if(this.zoomHome) {
			this.zoomHome.options.homeCoordinates = this.homeBounds;
		}
	};

	gotToHome = () => {
		this.fitBounds(this.homeBounds, {
			padding: [50, 50]
		});
	};

	setView = (lat, lng, zoom, options) => {
		if (typeof(lat) !== 'undefined' && lat !== null && lat !== 'nan' &&
			typeof(lng) !== 'undefined' && lng !== null && lng !== 'nan') {
			this.leafletMap.setView(new L.LatLng(lat, lng), zoom, options);
		}
	};

	fitBounds = (bounds) => {
		return this.leafletMap.fitBounds(bounds);
	};

	// addLayer = (...args) => {
	// 	// TODO add to layerMap
	// 	return this.leafletMap.addLayer(...args);
	// };

	// removeLayer = (...args) => {
	// 	if(this.hasLayer(...args)) {
	// 		return this.leafletMap.removeLayer(...args);
	// 	}
	// };

	// hasLayer = (...args) => {
	// 	return this.leafletMap.hasLayer(...args);
	// };

	// Event handlers
	onClick = (e) => {
		this.containerEl.dispatchEvent(new CustomEvent('map-clicked', {
			bubbles: true,
			detail: e
		}));
	};

	onMoveStart = () => {
		this.isMoving = true;
	};

	onMoveEnd = () => {
		this.isMoving = false;
		this.checkReady();
		this.updateRealtorEvents();
	};

	onZoomStart = () => {
		this.isZooming = true;
	};

	onZoomEnd = () => {
		this.isZooming = false;
		this.checkReady();
		this.updateRealtorEvents();
	};

	onViewReset = () => {
		this.checkReady();
	};

	onShowStreetView = (e) => {
		var latlng = e.latlng.lat + ',' + e.latlng.lng;
		var content = `
			<div id='embed-map-canvas' style='height:500px; width:900px'>
				<iframe style='height:100%;width:100%;border:0;' frameborder='0'src='https://www.google.com/maps/embed/v1/streetview?location=${latlng}&key=${APIKeys.google}'></iframe>
				<style>#embed-map-canvas img {max-width: none !important;background: none !important;}</style>
			</div>
		`;
		var popup = L.popup({maxWidth:900,maxHeight:500})
			.setLatLng([e.latlng.lat, e.latlng.lng])
			.setContent(content)
			.openOn(this.leafletMap);
	};

	onCenterMap = (e) => {
		let latlng = null;
		if (e.latlng && e.latlng instanceof L.LatLng) {
			latlng = e.latlng;
		}
		else if (Array.isArray(e)) {
			latlng = new L.LatLng(e[0], e[1]);
		}

		if (latlng !== null) {
			this.leafletMap.panTo(latlng);
		}
	};

	onZoomIn = (e) => {
		this.leafletMap.zoomIn();
	};

	onZoomOut = (e) => {
		this.leafletMap.zoomOut();
	};

	onLocateEvent = (event) => {
		if(event && event.Lat && event.Lng) {
			this.setView(event.Lat, event.Lng, this.maxZoom);
		}
	};

	onLayerAdded = (e) => {
		let layer = e.layer;
		if(layer && layer._url) {
			// This is a basemap
			let crs = L.CRS.EPSG3857;

			if(layer.wmsParams) {
				// This is a WMS layer
				crs = layer.options.crs;
			}
			else if(layer.wmtsParams) {
				// This is a WMTS layer
				crs = layer.options.crs;
			}
			else {
				// This is a tile layer
			}

			this.leafletMap.options.crs = crs;
			this.leafletMap._resetView(this.leafletMap.getCenter(), this.leafletMap.getZoom(), true); //we need this to redraw all layers (polygons, markers...) in the new projection.
		}
	};

	updateRealtorEvents = _.throttle(() => {
		let bounds = this.leafletMap.getBounds();

		let opts = {
			LongitudeMin: bounds.getWest(),
			LongitudeMax: bounds.getEast(),
			LatitudeMin: bounds.getSouth(),
			LatitudeMax: bounds.getNorth(),
			PriceMin: 100000,
			PriceMax: 410000,
		};

		realtorApi.query(opts)
			.then((results) => {
				console.log(results);
			});
	}, 5000);


	// onTileError = (e) => {
	// 	if(!this.baseLayerErrorState[e.target.options.label]) {
	// 		// This layer was working previously
	// 		// Remove existing
	// 		this.layerControl.removeLayer(e.target);

	// 		// Add new
	// 		let newLabel = `
	// 			<span title='Error loading map tiles'>
	// 				<span class='fa fa-exclamation-triangle' style='color: orangered;'></span>
	// 				<span>${e.target.options.label}</span>
	// 			</span>
	// 		`;
	// 		this.layerControl.addBaseLayer(e.target, newLabel);

	// 		this.baseLayerErrorState[e.target.options.label] = true;
	// 	}
	// };

	// onTileLoad = (e) => {
	// 	if(this.baseLayerErrorState[e.target.options.label]) {
	// 		// This layer had an error previously
	// 		// Remove existing
	// 		this.layerControl.removeLayer(e.target);

	// 		// Add new
	// 		this.layerControl.addBaseLayer(e.target, e.target.options.label);

	// 		// Reset error state
	// 		this.baseLayerErrorState[e.target.options.label] = false;
	// 	}
    // }
    
    render() {
        return (
            <div className='map-container' ref={(r) => this.containerEl = r}>

            </div>
        );
    }
}

export default Map;
