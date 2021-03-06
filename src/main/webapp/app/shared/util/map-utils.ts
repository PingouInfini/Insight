/**
 * Created by gFolgoas on 22/01/2019.
 */
import { IRawData } from '../model/raw-data.model';
import Style from 'ol/style/style';
import Feature from 'ol/feature';
import Fill from 'ol/style/fill';
import Text from 'ol/style/text';
import Stroke from 'ol/style/stroke';
import Circle from 'ol/style/circle';
import Icon from 'ol/style/icon';
import Extent from 'ol/extent';
import GeometryCollection from 'ol/geom/geometrycollection';
import LineString from 'ol/geom/linestring';
import Point from 'ol/geom/point';
import { GenericModel } from '../model/generic.model';
import { Moment } from 'moment';
import { getGenericImageProperty, getGenericNameProperty, SYMBOL_URLS } from './insight-util';
import { olx } from 'openlayers';
import Sphere from 'ol/sphere';
import style = olx.style;

export class MapState {
    DISPLAY_LABEL: boolean;
    DISPLAY_CONTENT_ON_HOVER: boolean;
    FILTER_TYPE: string; // EventThread filter type
    DESSIN_ENABLED: boolean;
    AUTO_REFRESH: boolean;
    SEARCH_GEOREF: boolean;
    // Défini les entities affichables sur la carte
    FILTER_ENTITIES: string[];
    MAX_GRAPH_DEPTH: number;

    constructor(
        DISPLAY_LABEL: boolean,
        DISPLAY_CONTENT_ON_HOVER: boolean,
        FILTER_TYPE: string,
        DESSIN_ENABLED: boolean,
        AUTO_REFRESH: boolean,
        SEARCH_GEOREF: boolean,
        FILTER_ENTITIES: string[],
        MAX_GRAPH_DEPTH: number
    ) {
        this.DISPLAY_LABEL = DISPLAY_LABEL;
        this.DISPLAY_CONTENT_ON_HOVER = DISPLAY_CONTENT_ON_HOVER;
        this.FILTER_TYPE = FILTER_TYPE;
        this.DESSIN_ENABLED = DESSIN_ENABLED;
        this.AUTO_REFRESH = AUTO_REFRESH;
        this.SEARCH_GEOREF = SEARCH_GEOREF;
        this.FILTER_ENTITIES = FILTER_ENTITIES;
        this.MAX_GRAPH_DEPTH = MAX_GRAPH_DEPTH;
    }
}

export class EventThreadResultSet {
    data: IRawData[];
    dataIds: string[];

    constructor(data: IRawData[], dataIds: string[]) {
        this.data = data;
        this.dataIds = dataIds;
    }

    clearAll() {
        this.data = [];
        this.dataIds = [];
    }
}

export class OlMapProperties {
    resolution?: number;
    viewExtent?: any;
    maxClusterCount?: number;

    constructor(resolution?: number, viewExtent?: any, maxClusterCount?: number) {
        this.resolution = resolution;
        this.viewExtent = viewExtent;
        this.maxClusterCount = maxClusterCount;
    }
}

export type MapLayerType = 'DESSIN' | 'KML' | 'WMS';
export type MapLayerStatus = 'NEW' | 'UPDATE' | 'DELETE';

export class MapLayer {
    layerId: string;
    layerName: string;
    layerType: MapLayerType;
    visible: boolean;
    layerStatus: MapLayerStatus;
    layerZIndex: number;
    selected?: boolean;
    properties?: {};

    constructor(
        layerId: string,
        layerName: string,
        layerType: MapLayerType,
        visible: boolean,
        layerZIndex: number,
        selected?: boolean,
        properties?: {}
    ) {
        this.layerId = layerId;
        this.layerName = layerName;
        this.layerType = layerType;
        this.visible = visible;
        this.layerStatus = 'NEW';
        this.layerZIndex = layerZIndex;
        this.selected = selected;
        this.properties = properties ? properties : {};
    }
}

export class FigureStyle {
    form: any;
    size: number;
    type: number;
    strokeColor: string;
    fillColor?: string;

    constructor(form: any, size: number, type: number, strokeColor: string, fillColor?: string) {
        this.form = form;
        this.size = size;
        this.type = type;
        this.strokeColor = strokeColor;
        this.fillColor = fillColor;
    }
}

export const getlayerIcon = (layerType: string): string => {
    switch (layerType) {
        case 'DESSIN':
            return 'pencil-alt';
        case 'KML':
            return 'map-marked-alt';
        case 'WMS':
            return 'globe';
    }
};

export class ZoomToFeatureRequest {
    targetLayer: string;
    featureId: string;

    constructor(targetLayer: string, featureId: string) {
        this.targetLayer = targetLayer;
        this.featureId = featureId;
    }
}

export class MapOverlayGenericMapper {
    entityType?: string;
    title?: string;
    subTitle?: string;
    image?: any;
    content?: string;
    date?: Moment;

    static fromGeneric(entity: GenericModel): MapOverlayGenericMapper {
        const mapper: MapOverlayGenericMapper = new MapOverlayGenericMapper();
        mapper.entityType = entity['entityType'];
        mapper.title = entity[getGenericNameProperty(entity)] || 'noTitle';
        mapper.subTitle = entity['biographicsFirstname'] || entity['rawDataSubType'] || 'noSubTitle';
        mapper.image = entity[getGenericImageProperty(entity)];
        mapper.content =
            entity['biographicsName'] ||
            entity['equipmentDescription'] ||
            entity['eventDescription'] ||
            entity['locationName'] ||
            entity['organisationDescrption'] ||
            entity['rawDataContent'] ||
            'noContent';
        mapper.date = entity['rawDataCreationDate'];
        return mapper;
    }

    constructor(entityType?: string, title?: string, subTitle?: string, image?: any, content?: string, date?: Moment) {
        this.entityType = entityType;
        this.title = title;
        this.subTitle = subTitle;
        this.image = image;
        this.content = content;
        this.date = date;
    }
}

export const isValidCoordinate = (coord: number[]): boolean => {
    return coord && coord.length === 2 && Math.abs(coord[0]) !== 99 && Math.abs(coord[1]) !== 99;
};

/**
 * Input coordinates must be in 'EPSG:4326' projection
 * */
export const getLengthBetweenCoords = (coord1: [number, number], coord2: [number, number]): number => {
    const wgs84Sphere: Sphere = new Sphere(6378137);
    const length = wgs84Sphere.haversineDistance(coord1, coord2);
    return length || 0;
};

/**
 * Renvoi la somme des différences entre X,Y
 * */
export const getAbsoluteCoordinateDistance = (coord1: [number, number], coord2: [number, number]): number => {
    if (!coord1 || !coord2) {
        return 0;
    }
    return Math.abs(coord1[0] - coord2[0]) + Math.abs(coord1[1] - coord2[1]);
};

/**
 * Fonction de style principale, maxFeatureCount est utile au calcul de la color des clusters,
 * Si gestion de la selection hors d'une selectInteraction => utiliser la property selected sur les features
 * */
export const insStyleFunction = (feature: Feature, resolution: number, maxFeatureCount: number): Style[] => {
    let stl: Style[] = [];
    const features: Feature[] = feature.get('features');
    const isCluster: boolean = features.length > 1;
    const selected: boolean = isCluster ? !!features.find(f => f.get('selected')) : features[0].get('selected');
    if (isCluster) {
        stl = selected
            ? insSelectedClusterStyleFunction(feature, maxFeatureCount, resolution)
            : insClusterStyleFunction(feature, maxFeatureCount);
    } else {
        const originalFeature = features[0];
        stl.push(
            ...(selected
                ? insSelectedBaseStyleFunction(originalFeature.getGeometry().getType(), originalFeature)
                : insBaseStyleFunction(originalFeature.getGeometry().getType(), originalFeature))
        );
    }
    return stl;
};

/**
 * Fonction de style de sélection, maxFeatureCount est utile au calcul de la color des clusters
 * */
export const insSelectedStyleFunction = (feature: Feature, resolution: number, maxFeatureCount: number): Style[] => {
    let stl: Style[] = [];
    const isCluster: boolean = feature.get('features').length > 1;
    if (isCluster) {
        stl = insSelectedClusterStyleFunction(feature, maxFeatureCount, resolution);
    } else {
        const originalFeature = feature.get('features')[0];
        stl.push(...insSelectedBaseStyleFunction(originalFeature.getGeometry().getType(), originalFeature));
    }
    return stl;
};

/**
 * Fonction de style on hover, maxFeatureCount est utile au calcul de la color des clusters
 * */
export const insHoveredStyleFunction = (feature: Feature, resolution: number, maxFeatureCount: number): Style[] => {
    let stl: Style[] = [];
    const isCluster: boolean = feature.get('features').length > 1;
    if (isCluster) {
        stl = expandClusterStyleFunction(feature, resolution);
    } else {
        const originalFeature = feature.get('features')[0];
        stl.push(...insSelectedBaseStyleFunction(originalFeature.getGeometry().getType(), originalFeature));
    }
    return stl;
};

/**
 * Applique le text de la feature: label (uniquement si non cluster) à ses fonctions de style
 * */
export const insSetTextStyleFunction = (feature: Feature, styles: Style[]): Style[] => {
    if (feature.get('features').length === 1 && feature.get('features')[0].get('label')) {
        styles.forEach(s => {
            if (s.getText() !== null && typeof s.getText() !== 'undefined') {
                s.getText().setText(feature.get('features')[0].get('label'));
            }
        });
    }
    return styles;
};

/**
 * Fonction de style des clusters
 * */
export const insClusterStyleFunction = (feature: Feature, maxFeatureCount: number): Style[] => {
    const clusterSize = feature.get('features').length;
    const stl = new Style({
        image: new Circle({
            radius: feature.get('radius'),
            fill: new Fill({
                color: [255, 153, 0, Math.min(0.8, 0.4 + clusterSize / maxFeatureCount)]
            }),
            stroke: new Stroke({
                color: [255, 153, 0, 1],
                width: 3
            })
        }),
        text: new Text({
            text: clusterSize.toString(),
            fill: new Fill({
                color: '#fff'
            }),
            stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.6)',
                width: 3
            })
        })
    });
    return [stl];
};

/**
 * Fonction de style des clusters selected
 * */
export const insSelectedClusterStyleFunction = (feature: Feature, maxFeatureCount: number, resolution: number): Style[] => {
    const clusterSize = feature.get('features').length;
    const styles: Style[] = [];
    const baseStyle = new Style({
        image: new Circle({
            radius: feature.get('radius'),
            fill: new Fill({
                color: [128, 255, 128, Math.min(0.8, 0.4 + clusterSize / maxFeatureCount)]
            }),
            stroke: new Stroke({
                color: [128, 255, 128, 1],
                width: 3
            })
        }),
        text: new Text({
            text: clusterSize.toString(),
            fill: new Fill({
                color: '#fff'
            }),
            stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.6)',
                width: 3
            })
        })
    });

    (<Feature[]>feature.get('features')).forEach(f => {
        if (f.get('selected') && f.get('relation_position')) {
            styles.push(...getRelationConnectionLines(f));
        }
    });
    return styles.concat(expandClusterStyleFunction(feature, resolution));
};

/**
 * Set le radius des features en entrée et renvoie la valeur maximale des clusters
 * */
export const setClusterRadiusFromExtent = (features: Feature[], resolution: number): number => {
    let maxFeatureCount = 0;
    for (let i = features.length - 1; i >= 0; --i) {
        const feature = features[i];
        let radius;
        const originalFeatures: Feature[] = feature.get('features');
        const extent = Extent.createEmpty();

        // Void évalue une expression et renvoie undefined
        let j = void 0;
        let jj = void 0;
        for (j = 0, jj = originalFeatures.length; j < jj; ++j) {
            Extent.extend(extent, originalFeatures[j].getGeometry().getExtent());
        }
        maxFeatureCount = Math.max(maxFeatureCount, jj);
        radius = (0.65 * (Extent.getWidth(extent) + Extent.getHeight(extent))) / resolution;
        feature.set('radius', radius);
    }
    return maxFeatureCount;
};

/**
 * Set le radius des features en entrée et renvoie la valeur maximale des clusters
 * */
export const setClusterRadius = (features: Feature[], resolution: number): number => {
    let maxFeatureCount = 0;
    for (let i = features.length - 1; i >= 0; --i) {
        const feature = features[i];
        const originalFeatures: Feature[] = feature.get('features');
        maxFeatureCount = Math.max(maxFeatureCount, originalFeatures.length);
        const radius = Math.min(Math.log10(originalFeatures.length) * 10, 60);
        feature.set('radius', radius);
    }
    return maxFeatureCount;
};

/**
 * Fonction de style de base selon la geometry de la feature
 * */
export const insBaseStyleFunction = (geometryType: string, feature?: Feature): Style[] => {
    if (feature && !feature.get('visible')) {
        return null;
    }
    const is_selected_relation = feature ? feature.get('selected_relation') && !feature.get('selected') : false;
    switch (geometryType) {
        case 'Point':
            const styles = [];
            const objectType = feature ? feature.get('objectType') : '';
            const relationOrder: number = feature ? feature.get('relationOrder') : 0;
            const src: string = relationOrder === 2 ? getMapSecondOrderRelationImageIconUrl(objectType) : getMapImageIconUrl(objectType);
            const baseStyle = new Style({
                image:
                    src === null
                        ? new Circle({
                              radius: 14,
                              fill: new Fill({
                                  color: 'rgba(230, 240, 255, 1)'
                              }),
                              stroke: new Stroke({ color: '#ffc600', width: 3 })
                          })
                        : new Icon({
                              anchor: [0.5, 0.5],
                              scale: 0.3,
                              src: `${src}`
                          }),
                text: new Text({
                    font: 'bold 11px "Open Sans", "Arial Unicode MS", "sans-serif"',
                    placement: 'point',
                    textBaseline: 'top',
                    offsetY: 10,
                    fill: new Fill({
                        color: 'black'
                    })
                })
            });
            if (is_selected_relation) {
                const relationStyle = new Style({
                    image: new Circle({
                        radius: 14,
                        fill: new Fill({
                            color: 'rgba(255, 51, 51, 0.1)'
                        }),
                        stroke: new Stroke({ color: 'rgba(255, 51, 51, 0.5)', width: 5 })
                    })
                });
                styles.push(relationStyle);
            }
            return styles.concat(baseStyle);
            break;
        case 'LineString':
            return [
                new Style({
                    stroke: new Stroke({
                        color: [255, 153, 0, 0.8],
                        width: 1
                    })
                })
            ];
            break;
        case 'MultiLineString':
            return [
                new Style({
                    stroke: new Stroke({
                        color: [255, 153, 0, 0.8],
                        width: 1
                    })
                })
            ];
            break;
        case 'MultiPoint':
            return [
                new Style({
                    image: new Circle({
                        radius: 14,
                        fill: new Fill({
                            color: 'rgba(230, 240, 255, 1)'
                        }),
                        stroke: new Stroke({ color: '#ffc600', width: 3 })
                    })
                })
            ];
            break;
        case 'MultiPolygon':
            return [
                new Style({
                    stroke: new Stroke({
                        color: 'yellow',
                        width: 1
                    }),
                    fill: new Fill({
                        color: 'rgba(255, 255, 0, 0.1)'
                    })
                })
            ];
            break;
        case 'Polygon':
            return [
                new Style({
                    stroke: new Stroke({
                        color: 'blue',
                        lineDash: [4],
                        width: 3
                    }),
                    fill: new Fill({
                        color: 'rgba(0, 0, 255, 0.1)'
                    })
                })
            ];
            break;
        case 'GeometryCollection':
            return [
                new Style({
                    stroke: new Stroke({
                        color: 'magenta',
                        width: 2
                    }),
                    fill: new Fill({
                        color: 'magenta'
                    }),
                    image: new Circle({
                        radius: 10,
                        fill: null,
                        stroke: new Stroke({
                            color: 'magenta'
                        })
                    })
                })
            ];
            break;
        default:
            return [
                new Style({
                    stroke: new Stroke({
                        color: 'red',
                        width: 2
                    }),
                    fill: new Fill({
                        color: 'rgba(255,0,0,0.2)'
                    })
                })
            ];
            break;
    }
};

export const insSelectedBaseStyleFunction = (geometryType: string, feature?: Feature): Style[] => {
    if (feature && !feature.get('visible')) {
        return null;
    }
    switch (geometryType) {
        case 'Point':
            const styles: Style[] = [];
            const objectType = feature ? feature.get('objectType') : '';
            const src: string = getSelectedImageIconUrl(objectType);
            const baseStyle = new Style({
                image:
                    src === null
                        ? new Circle({
                              radius: 14,
                              fill: new Fill({
                                  color: 'rgba(230, 240, 255, 1)'
                              }),
                              stroke: new Stroke({ color: '#cb412a', width: 4 })
                          })
                        : new Icon({
                              anchor: [0.5, 0.5],
                              scale: 0.3,
                              src: `${src}`
                          }),
                text: new Text({
                    font: 'bold 11px "Open Sans", "Arial Unicode MS", "sans-serif"',
                    placement: 'point',
                    textBaseline: 'top',
                    offsetY: 10,
                    fill: new Fill({
                        color: 'black'
                    })
                })
            });

            if (feature && feature.get('relation_position')) {
                styles.push(...getRelationConnectionLines(feature));
            }
            return styles.concat(baseStyle);
            break;
        case 'LineString':
            return [
                new Style({
                    stroke: new Stroke({
                        color: 'green',
                        width: 1
                    })
                })
            ];
            break;
        case 'MultiLineString':
            return [
                new Style({
                    stroke: new Stroke({
                        color: 'green',
                        width: 1
                    })
                })
            ];
            break;
        case 'MultiPoint':
            return [
                new Style({
                    image: new Circle({
                        radius: 14,
                        fill: new Fill({
                            color: 'rgba(230, 240, 255, 1)'
                        }),
                        stroke: new Stroke({ color: '#ffc600', width: 3 })
                    })
                })
            ];
            break;
        case 'MultiPolygon':
            return [
                new Style({
                    stroke: new Stroke({
                        color: 'yellow',
                        width: 1
                    }),
                    fill: new Fill({
                        color: 'rgba(255, 255, 0, 0.1)'
                    })
                })
            ];
            break;
        case 'Polygon':
            return [
                new Style({
                    stroke: new Stroke({
                        color: 'blue',
                        lineDash: [4],
                        width: 3
                    }),
                    fill: new Fill({
                        color: 'rgba(0, 0, 255, 0.1)'
                    })
                })
            ];
            break;
        case 'GeometryCollection':
            return [
                new Style({
                    stroke: new Stroke({
                        color: 'magenta',
                        width: 2
                    }),
                    fill: new Fill({
                        color: 'magenta'
                    }),
                    image: new Circle({
                        radius: 10,
                        fill: null,
                        stroke: new Stroke({
                            color: 'magenta'
                        })
                    })
                })
            ];
            break;
        default:
            return [
                new Style({
                    stroke: new Stroke({
                        color: 'red',
                        width: 2
                    }),
                    fill: new Fill({
                        color: 'rgba(255,0,0,0.2)'
                    })
                })
            ];
            break;
    }
};

export const getRelationConnectionLines = (feature: Feature): Style[] => {
    if (!feature.get('relation_position')) {
        return [];
    }
    const styles = [];
    const positions: [number, number][] = feature.get('relation_position');
    const baseCoord = (<Point>feature.getGeometry()).getCoordinates();
    positions.forEach(coord => {
        const lineStyle = new Style({
            stroke: new Stroke({
                color: 'rgba(255, 51, 51, 0.3)',
                width: 3
            })
        });
        lineStyle.setGeometry(new LineString([baseCoord, coord]));
        styles.push(lineStyle);
    });
    return styles;
};

/**
 * Fonction de style des clusters
 * */
export const expandClusterStyleFunction = (feature: Feature, resolution: number): Style[] => {
    const styles: Style[] = [];
    styles.push(
        new Style({
            image: new Circle({
                radius: feature.get('radius'),
                fill: new Fill({
                    color: 'rgba(255, 153, 0, 0.2)'
                })
            })
        })
    );

    const originalClusterCoord: [number, number] = (<Point>feature.getGeometry()).getCoordinates();
    const originalFeatures = feature.get('features');
    const vectors = expandedClusterTranslationVectors(originalFeatures.length, 40);
    const styleGeomPos: {} = {};
    for (let i = originalFeatures.length - 1; i >= 0; --i) {
        const originalFeature: Feature = originalFeatures[i];
        const newCoord: [number, number] = [
            originalClusterCoord[0] + vectors[i].x * resolution,
            originalClusterCoord[1] + vectors[i].y * resolution
        ];

        const stls: Style[] = originalFeature.get('selected')
            ? insSelectedBaseStyleFunction(originalFeature.getGeometry().getType(), originalFeature)
            : insBaseStyleFunction(originalFeature.getGeometry().getType(), originalFeature);
        stls.forEach(s => {
            const point: Point = new Point(newCoord);
            point.set('feature_id', originalFeature.getId());
            s.setGeometry(point);
            styleGeomPos[originalFeature.getId()] = newCoord;
        });
        styles.push(...stls);

        const lineStyle = insBaseStyleFunction('LineString')[0];
        lineStyle.setGeometry(new LineString([originalClusterCoord, newCoord]));
        styles.push(lineStyle);
    }
    feature.set('spread_position', styleGeomPos);
    return styles;
};

/**
 * Donne la répartition d'éléments sur un cercle centré sur 0
 * */
export const expandedClusterTranslationVectors = (numberFeatures: number, radius: number): { i: number; x: number; y: number }[] => {
    const coords = [];
    const width = radius * 2;
    let angle, xn, yn, j;
    for (j = 0; j < numberFeatures; j++) {
        angle = (j / (numberFeatures / 2)) * Math.PI; // Calculate the angle at which the element will be placed.
        // For a semicircle, we would use (i / numberFeatures) * Math.PI.
        xn = radius * Math.cos(angle) + width / 2; // Calculate the x position of the element.
        yn = radius * Math.sin(angle) + width / 2; // Calculate the y position of the element.
        coords.push({ i: j, x: xn - radius, y: yn - radius }); // - radius to translate the element to a 0 centered graph
    }
    return coords;
};

export const getMapImageIconUrl = (objectType: string): string => {
    switch (objectType) {
        case 'RawData':
            return SYMBOL_URLS.map.IMAGE_URL_RAW;
        case 'Equipment':
            return SYMBOL_URLS.map.IMAGE_URL_EQUIP;
        case 'Location':
            return SYMBOL_URLS.map.IMAGE_URL_LOC;
        case 'Biographics':
            return SYMBOL_URLS.map.IMAGE_URL_BIO;
        case 'Organisation':
            return SYMBOL_URLS.map.IMAGE_URL_ORGA;
        case 'Event':
            return SYMBOL_URLS.map.IMAGE_URL_EVENT;
        case 'geoMarker':
            return SYMBOL_URLS.map.IMAGE_URL_GEOMARKER;
        default:
            return null;
    }
};

export const getMapSecondOrderRelationImageIconUrl = (objectType: string): string => {
    switch (objectType) {
        case 'RawData':
            return SYMBOL_URLS.map.IMAGE_URL_RAW_BIS;
        case 'Equipment':
            return SYMBOL_URLS.map.IMAGE_URL_EQUIP_BIS;
        case 'Location':
            return SYMBOL_URLS.map.IMAGE_URL_LOC_BIS;
        case 'Biographics':
            return SYMBOL_URLS.map.IMAGE_URL_BIO_BIS;
        case 'Organisation':
            return SYMBOL_URLS.map.IMAGE_URL_ORGA_BIS;
        case 'Event':
            return SYMBOL_URLS.map.IMAGE_URL_EVENT_BIS;
        default:
            return null;
    }
};

export const getSelectedImageIconUrl = (objectType: string): string => {
    switch (objectType) {
        case 'geoMarker':
            return SYMBOL_URLS.map.IMAGE_URL_SELECTED_GEOMARKER;
        case 'Biographics':
            return SYMBOL_URLS.map.IMAGE_URL_SELECTED_BIO;
        case 'Event':
            return SYMBOL_URLS.map.IMAGE_URL_SELECTED_EVENT;
        case 'Organisation':
            return SYMBOL_URLS.map.IMAGE_URL_SELECTED_ORGA;
        case 'Location':
            return SYMBOL_URLS.map.IMAGE_URL_SELECTED_LOC;
        case 'Equipment':
            return SYMBOL_URLS.map.IMAGE_URL_SELECTED_EQUIP;
        case 'RawData':
            return SYMBOL_URLS.map.IMAGE_URL_SELECTED_RAW;
        default:
            return getMapImageIconUrl(objectType);
    }
};
