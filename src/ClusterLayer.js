import L from 'leaflet';
import { PruneCluster, PruneClusterForLeaflet } from 'prunecluster/dist/PruneCluster.js';

import './ClusterLayer.css';
import 'prunecluster/dist/LeafletStyleSheet.css';

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
        
        for (let i = 0; i < 1000; i++) {
            const marker = new PruneCluster.Marker(59.91111 + (Math.random() - 0.5) * Math.random() * 0.00001 * i, 10.752778 + (Math.random() - 0.5) * Math.random() * 0.00002 * i);
            
            marker.data = {
                test: i
            };
            this.layer.RegisterMarker(marker);
        }

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
        return PruneClusterForLeaflet.prototype.BuildLeafletClusterIcon.call(this.layer, cluster);
    };

    // Event handlers
    onMarkerClicked = (e) => {
        this.map.containerEl.dispatchEvent(new CustomEvent('marker-clicked', {
            detail: e.target.data,
            bubbles: true
        }));

        e.originalEvent.stopPropagation();
    };
}

export default ClusterLayer;