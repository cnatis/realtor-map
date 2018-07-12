import neighbourhoods from "./neighbourhood";
import L from "leaflet";
import * as d3 from 'd3';

const NORMAL_RAMP = ["green", "yellow", "red"];
const GREEN_RAMP = ["#A9DFBF","#229954","#145A32"];

export function loadGeoJSON(column, valArr){
    return L.geoJson(neighbourhoods, {style: styleFunction.bind(this, column, valArr), onEachFeature: onEachFeature.bind(this, column, valArr)}).bindTooltip(function (layer) {
    	return layer.feature.properties.AREA_NAME.split(' (')[0];
	})
}

function styleFunction(column, domain, feature){
    return {
        fillColor: getHeatRampColor(feature, column, domain),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.25
    };
}


function getHeatRampColor(feature, column, valArr){
	let currentVal = feature.properties[column];
	let minMeanMax = [d3.min(valArr), d3.mean(valArr), d3.max(valArr)];
	let ramp = d3.scaleLinear().domain(minMeanMax).range(NORMAL_RAMP);
	return ramp(currentVal)
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
				'fillColor': getHeatRampColor(feature, column, domain),
			});
		},
        click: function (e) {
            this._path.parentElement.dispatchEvent(new CustomEvent('feature-clicked', {
				bubbles: true,
				detail: feature
			}));

			e.originalEvent.stopPropagation();
			e.originalEvent.preventDefault();
		}
	});
}