import { Component, OnInit } from '@angular/core';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { GeoJSON } from 'ol/format';
import { defaults as defaultControls } from 'ol/control.js';
import Map from 'ol/Map';
import View from 'ol/View';

@Component({
    selector: 'jhi-map',
    templateUrl: './map.component.html',
    styles: []
})
export class MapComponent implements OnInit {
    private circleImage = new CircleStyle({
        radius: 5,
        fill: null,
        stroke: new Stroke({ color: 'red', width: 1 })
    });
    private styles = {
        Point: new Style({
            image: this.circleImage
        }),
        LineString: new Style({
            stroke: new Stroke({
                color: 'green',
                width: 1
            })
        }),
        MultiLineString: new Style({
            stroke: new Stroke({
                color: 'green',
                width: 1
            })
        }),
        MultiPoint: new Style({
            image: this.circleImage
        }),
        MultiPolygon: new Style({
            stroke: new Stroke({
                color: 'yellow',
                width: 1
            }),
            fill: new Fill({
                color: 'rgba(255, 255, 0, 0.1)'
            })
        }),
        Polygon: new Style({
            stroke: new Stroke({
                color: 'blue',
                lineDash: [4],
                width: 3
            }),
            fill: new Fill({
                color: 'rgba(0, 0, 255, 0.1)'
            })
        }),
        GeometryCollection: new Style({
            stroke: new Stroke({
                color: 'magenta',
                width: 2
            }),
            fill: new Fill({
                color: 'magenta'
            }),
            image: new CircleStyle({
                radius: 10,
                fill: null,
                stroke: new Stroke({
                    color: 'magenta'
                })
            })
        }),
        Circle: new Style({
            stroke: new Stroke({
                color: 'red',
                width: 2
            }),
            fill: new Fill({
                color: 'rgba(255,0,0,0.2)'
            })
        })
    };

    constructor() {}

    ngOnInit() {
        const geojsonObject = {
            type: 'FeatureCollection',
            crs: {
                type: 'name',
                properties: {
                    name: 'EPSG:3857'
                }
            },
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [0, 0]
                    }
                },
                {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: [[4e6, -2e6], [8e6, 2e6]]
                    }
                },
                {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: [[4e6, 2e6], [8e6, -2e6]]
                    }
                },
                {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [[[-5e6, -1e6], [-4e6, 1e6], [-3e6, -1e6]]]
                    }
                },
                {
                    type: 'Feature',
                    geometry: {
                        type: 'MultiLineString',
                        coordinates: [
                            [[-1e6, -7.5e5], [-1e6, 7.5e5]],
                            [[1e6, -7.5e5], [1e6, 7.5e5]],
                            [[-7.5e5, -1e6], [7.5e5, -1e6]],
                            [[-7.5e5, 1e6], [7.5e5, 1e6]]
                        ]
                    }
                },
                {
                    type: 'Feature',
                    geometry: {
                        type: 'MultiPolygon',
                        coordinates: [
                            [[[-5e6, 6e6], [-5e6, 8e6], [-3e6, 8e6], [-3e6, 6e6]]],
                            [[[-2e6, 6e6], [-2e6, 8e6], [0, 8e6], [0, 6e6]]],
                            [[[1e6, 6e6], [1e6, 8e6], [3e6, 8e6], [3e6, 6e6]]]
                        ]
                    }
                },
                {
                    type: 'Feature',
                    geometry: {
                        type: 'GeometryCollection',
                        geometries: [
                            {
                                type: 'LineString',
                                coordinates: [[-5e6, -5e6], [0, -5e6]]
                            },
                            {
                                type: 'Point',
                                coordinates: [4e6, -5e6]
                            },
                            {
                                type: 'Polygon',
                                coordinates: [[[1e6, -6e6], [2e6, -4e6], [3e6, -6e6]]]
                            }
                        ]
                    }
                }
            ]
        };

        const readFeatures = new GeoJSON().readFeatures(geojsonObject);
        const vectorSource = new VectorSource({
            features: readFeatures
        });
        const vectorLayer: VectorLayer = new VectorLayer({
            source: vectorSource,
            style: feature => this.styleFunction(feature)
        });
        const map = new Map({
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                vectorLayer
            ],
            target: 'map',
            controls: defaultControls({
                attributionOptions: {
                    collapsible: false
                }
            }),
            view: new View({
                center: [0, 0],
                zoom: 2
            })
        });
    }

    styleFunction(feature) {
        return this.styles[feature.getGeometry().getType()];
    }
}
