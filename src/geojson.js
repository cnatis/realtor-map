import neighbourhoods from "./neighbourhood";
import L from "leaflet";

export function loadGeoJSON(column, onEachFeature){
    return L.geoJson(neighbourhoods, {style: styleFunction.bind(this, column), onEachFeature: onEachFeature});
}

// var geoJsonLayer = L.geoJson(neighbourhoods, {style: styleFunction}, onEachFeature: showInfo)
// .addTo(this.leafletMap);
//
// console.log(neighbourhoods);
function styleFunction(column, feature){
    return {
        fillColor: getColor(feature.properties[column]),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.25
    };
}

function getColor(d) {
    return d > 1000 ? '#800026' :
        d > 500 ? '#BD0026' :
            d > 200 ? '#E31A1C' :
                d > 100 ? '#FC4E2A' :
                    d > 50 ? '#FD8D3C' :
                        d > 20 ? '#FEB24C' :
                            d > 10 ? '#FED976' :
                                '#FFEDA0';
}