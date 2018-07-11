import neighbourhoods from "./neighbourhood";
import L from "leaflet";
import * as d3 from 'd3';

export function loadGeoJSON(column, domain){
    return L.geoJson(neighbourhoods, {style: styleFunction.bind(this, column, domain), onEachFeature: onEachFeature.bind(this, column, domain)});
}

function styleFunction(column, domain, feature){
    return {
        fillColor: getColor2(feature.properties[column], domain),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.25
    };
}


function getColor2(v, d){
	let minMeanMax = [d3.min(d), d3.mean(d), d3.max(d)];
	let ramp = d3.scaleLinear().domain(minMeanMax).range(["green", "yellow", "red"]);
	return ramp(v)
}


function onEachFeature(column, domain, feature, layer) {
	layer.on({
		mouseover: function () {
			this.setStyle({
				'fillColor': '#0b78b4',
			});
		},
		mouseout: function () {
			this.setStyle({
				'fillColor': getColor2(feature.properties[column], domain),
			});
		}
	});
}