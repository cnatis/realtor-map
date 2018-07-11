import L from 'leaflet';
import { PruneCluster, PruneClusterForLeaflet } from 'prunecluster/dist/PruneCluster.js';

import './ClusterLayer.css';
import 'prunecluster/dist/LeafletStyleSheet.css';

// setup marker list within clusters
PruneCluster.Cluster.ENABLE_MARKERS_LIST = true;

const HouseIcon = L.divIcon({
    html: `
        <span class='fa fa-home fa-2x'></span>
    `,
    className: 'point-icon',
    iconSize: [28, 24],
    iconAnchor: [14, 12]
});

class ClusterLayer {

    constructor() {
        this.layer = new PruneClusterForLeaflet();
        this.layer.BuildLeafletClusterIcon = this.buildLeafletClusterIcon;
        this.layer.PrepareLeafletMarker = this.prepareLeafletMarker;
        this.layer.Cluster.Size = 40;
        
        this.layer.ProcessView();
    }

    addTo(map) {
        this.map = map;
        map.layerControl.addOverlay(this.layer, 'Cluster Layer');
        map.leafletMap.addLayer(this.layer);
    }

    prepareLeafletMarker = (marker, data) => {
        marker.setIcon(HouseIcon);
        marker.on('click', this.onMarkerClicked);
        marker.data = data;
    };

    buildLeafletClusterIcon = (cluster) => {
    	let clusterMarkers = cluster.GetClusterMarkers();
    	let totalPopulation = clusterMarkers.reduce((total, marker) => total + marker.data.record.count, 0);

	    let c = 'prunecluster prunecluster-';
	    let iconSize = 38;
	    let maxPopulation = this.layer.Cluster.GetPopulation();
	    if (cluster.population < Math.max(10, maxPopulation * 0.01)) {
		    c += 'small';
	    }
	    else if (cluster.population < Math.max(100, maxPopulation * 0.05)) {
		    c += 'medium';
		    iconSize = 40;
	    }
	    else {
		    c += 'large';
		    iconSize = 44;
	    }
	    return new L.DivIcon({
		    html: "<div><span>" + totalPopulation + "</span></div>",
		    className: c,
		    iconSize: L.point(iconSize, iconSize)
	    });

    };

    // Event handlers
    onMarkerClicked = (e) => {
        this.map.containerEl.dispatchEvent(new CustomEvent('marker-clicked', {
            detail: e.target.data,
            bubbles: true
        }));

        e.originalEvent.stopPropagation();
    };

    updateRecords(records) {
    	this.layer.RemoveMarkers(this.markers);
	    this.markers = new Array(records.length);
    	if (records.length > 0) {
		    for (let i = 0, l = records.length; i < l; ++i) {
			    let rec = records[i];
			    const marker = new PruneCluster.Marker(rec.latitude, rec.longitude);

			    marker.data = {
				    record: rec
			    };
			    this.markers[i] = marker;
		    }
		    this.layer.RegisterMarkers(this.markers);
	    }

	    this.layer.ProcessView();
    }
}

export default ClusterLayer;