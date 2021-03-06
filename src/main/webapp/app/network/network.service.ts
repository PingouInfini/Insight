/**
 * Created by gFolgoas on 14/01/2019.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DEBUG_INFO_ENABLED, SERVER_API_URL } from 'app/app.constants';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { IdType } from 'vis';
import { catchError, filter, map, switchMap } from 'rxjs/internal/operators';
import { EdgeDTO, GraphDataCollection, IGraphyNodeDTO, IGraphyRelationDTO, NodeDTO } from 'app/shared/model/node.model';
import { RawDataService } from 'app/entities/raw-data';
import { IRawData, RawData } from 'app/shared/model/raw-data.model';
import { DataContentInfo, NetworkState } from '../shared/util/network.util';
import { genericTypeResolver, getGenericSymbolProperty, SYMBOL_URLS, ToolbarButtonParameters, UUID } from '../shared/util/insight-util';
import { GenericModel } from '../shared/model/generic.model';
import { QuickViewService } from '../side/quick-view.service';

@Injectable({ providedIn: 'root' })
export class NetworkService {
    private _resourceUrl = SERVER_API_URL + 'api/graph/';
    JSONFileSelected: Subject<File> = new Subject();
    networkState: BehaviorSubject<NetworkState> = new BehaviorSubject({
        LAYOUT_DIR: 'UD',
        LAYOUT_FREE: false,
        PHYSICS_ENABLED: false,
        ENTITIES_FILTER: ['Biographics', 'Equipment', 'Event', 'Location', 'Organisation'],
        SORT_METHOD: 'directed',
        ADD_NEIGHBOURS: false,
        CLUSTER_NODES: false,
        AUTO_REFRESH: false,
        DISPLAY_RELATION: true
    });

    /** ids des objets contenus dans le network */
    networkDataContent: BehaviorSubject<DataContentInfo[]> = new BehaviorSubject([]);
    /** source de la modal de visualisation de neighbors */
    neighborsEmitter: BehaviorSubject<GraphDataCollection> = new BehaviorSubject(new GraphDataCollection([], []));

    public static getNodeDto(
        label: string,
        objectType?: string,
        id?: IdType,
        mongoId?: string,
        title?: string,
        imageUrl?: string,
        hidden = false,
        physics = true
    ): NodeDTO {
        const image: string = imageUrl ? imageUrl : NetworkService.getNodeImageUrl(objectType);
        const color = {
            border: NetworkService.getNodeColor(objectType)
        };
        const font = {
            color: '#0056b3'
        };
        return new NodeDTO(label, id, mongoId, objectType, title, image, color, 3, font, hidden, physics);
    }

    public static getEdgeCollection(idOrigin: IdType, relations: IGraphyRelationDTO[]): EdgeDTO[] {
        return relations.map(rel => NetworkService.getEdgeDto(idOrigin, rel.id));
    }

    public static getDirectNeighboursEdgeCollection(idOrigin: IdType, nodes: NodeDTO[]): EdgeDTO[] {
        return nodes.map(node => NetworkService.getEdgeDto(idOrigin, node.id));
    }

    public static getEdgeDto(from: IdType, to: IdType, hidden = false, physics = true): EdgeDTO {
        return new EdgeDTO(from, to, hidden, physics);
    }

    static getNodeColor(objectType: string): string {
        let color: string;
        switch (objectType) {
            case 'Biographics':
                color = 'red';
                break;
            case 'Event':
                color = 'blue';
                break;
            case 'Equipment':
                color = 'green';
                break;
            case 'RawData':
                color = 'black';
                break;
            default:
                color = 'pink';
                break;
        }
        return color;
    }

    static getNodeImageUrl(objectType: string): string {
        switch (objectType) {
            case 'Biographics':
                return SYMBOL_URLS.network.IMAGE_URL_BIO;
            case 'Event':
                return SYMBOL_URLS.network.IMAGE_URL_EVENT;
            case 'Location':
                return SYMBOL_URLS.network.IMAGE_URL_LOC;
            case 'Organisation':
                return SYMBOL_URLS.network.IMAGE_URL_ORGA;
            case 'Equipment':
                return SYMBOL_URLS.network.IMAGE_URL_EQUIP;
            case 'RawData':
                return SYMBOL_URLS.network.IMAGE_URL_RAW;
            default:
                return SYMBOL_URLS.network.IMAGE_URL_DEFAULT;
        }
    }

    constructor(private http: HttpClient, private rds: RawDataService, private _qvs: QuickViewService) {}

    updateRawData(rawDataId: string, symbole: string): Observable<HttpResponse<IRawData>> {
        return this.rds.find(rawDataId).pipe(
            switchMap((res: HttpResponse<IRawData>) => {
                const data: IRawData = res.body;
                data.rawDataSymbol = symbole;
                return this.rds.update(data);
            })
        );
    }

    isHidden(nodeType: string): { hidden; physics } {
        return {
            hidden: this.networkState.getValue().ENTITIES_FILTER.indexOf(nodeType) === -1,
            physics: this.networkState.getValue().ENTITIES_FILTER.indexOf(nodeType) !== -1
        };
    }

    updateData(dataId: string, symbole: string): Observable<GenericModel> {
        return this._qvs.find(dataId).pipe(
            switchMap((res1: HttpResponse<GenericModel>) => {
                const data: GenericModel = res1.body;
                data[getGenericSymbolProperty(data)] = symbole;
                return this._qvs.update(data).pipe(
                    map((res2: HttpResponse<GenericModel>) => {
                        return genericTypeResolver(res2.body);
                    })
                );
            })
        );
    }

    getMockGraphData(): Observable<GraphDataCollection> {
        return of(MOCK_GRAPH_DATA).pipe(
            map(data => {
                const dataCollection = new GraphDataCollection([], []);
                dataCollection.nodes = data['nodes'].map(item =>
                    NetworkService.getNodeDto(item['label'], item['type'], <IdType>item['id'], item['idMongo'], item['title'])
                );
                dataCollection.edges = data['edges'].map(item => NetworkService.getEdgeDto(<IdType>item['from'], <IdType>item['to']));
                return dataCollection;
            })
        );
    }

    getGraphData(janusIdOrigin: IdType, applyFilter = true): Observable<GraphDataCollection> {
        const headers = new HttpHeaders();
        const url = 'traversal/';
        return this.http.get(`${this._resourceUrl}` + url + `${janusIdOrigin}`, { headers, observe: 'response' }).pipe(
            catchError(error => {
                if (DEBUG_INFO_ENABLED) {
                    const fakeResponse: HttpResponse<IGraphyNodeDTO[]> = new HttpResponse({
                        body: this.getRamdomizedMockData().nodes,
                        headers: new HttpHeaders(),
                        status: 200
                    });
                    return of(fakeResponse);
                } else {
                    return throwError(error);
                }
            }),
            map((res: HttpResponse<IGraphyNodeDTO[]>) => {
                const body: IGraphyNodeDTO[] = res.body;
                const data = new GraphDataCollection([], []);
                data.nodes = body.map((item: IGraphyNodeDTO) => {
                    if (applyFilter) {
                        return NetworkService.getNodeDto(
                            item.label,
                            item.type,
                            item.id,
                            item.idMongo,
                            '',
                            item.symbole,
                            this.isHidden(item.type).hidden,
                            this.isHidden(item.type).physics
                        );
                    } else {
                        return NetworkService.getNodeDto(item.label, item.type, item.id, item.idMongo, '', item.symbole);
                    }
                });
                /** Ajoute directement au voisin du Node Origin pour le moment (utiliser getEdgeCollection
                 *  lorsque les relations seront ajout??es au IGraphyNodeDTO depuis le serveur */
                data.edges = NetworkService.getDirectNeighboursEdgeCollection(janusIdOrigin, data.nodes);
                return data;
            })
        );
    }

    createRelation(sourceId: IdType, targetId: IdType): Observable<HttpResponse<string>> {
        const headers = new HttpHeaders();
        const url = 'relation/';
        const payload = {
            idJanusSource: sourceId,
            idJanusCible: targetId,
            name: 'linkedTo'
        };
        const postUrl = this._resourceUrl + url;
        return this.http.post<string>(postUrl, payload, { headers, observe: 'response' });
    }

    getRawDataById(idOrigin: string): Observable<RawData> {
        return this.rds.find(<string>idOrigin).pipe(
            filter((response: HttpResponse<RawData>) => response.ok),
            map((rawData: HttpResponse<RawData>) => rawData.body)
        );
    }

    getNodeProperties(janusIdOrigin: IdType): Observable<HttpResponse<IGraphyNodeDTO>> {
        const headers = new HttpHeaders();
        const url = 'traversal/janus/';
        return this.http
            .get<IGraphyNodeDTO>(`${this._resourceUrl}` + url + `${janusIdOrigin}`, {
                headers,
                observe: 'response'
            })
            .pipe(
                catchError(error => {
                    if (DEBUG_INFO_ENABLED) {
                        const fakeResponse: HttpResponse<IGraphyNodeDTO> = new HttpResponse({
                            body: this.getRamdomizedMockData().nodes[0],
                            headers: new HttpHeaders(),
                            status: 200
                        });
                        return of(fakeResponse);
                    } else {
                        return throwError(error);
                    }
                })
            );
    }

    getUpdatedEventThreadToolbar(): ToolbarButtonParameters[] {
        const newToolbar = [];
        newToolbar.push(
            new ToolbarButtonParameters(
                'AUTO_REFRESH',
                'sync-alt',
                'Activer le rafra??chissement automatique',
                this.networkState.getValue().AUTO_REFRESH
            )
        );
        return newToolbar;
    }

    /**
     * Get MockData with random Id
     * */
    getRamdomizedMockData(): { nodes: any[]; edges: any[] } {
        const mock = MOCK_GRAPH_DATA;
        const random = { nodes: [], edges: [] };
        mock.nodes.forEach((node: { id: IdType; label: string; title: string; type: string }) => {
            const newId = <IdType>UUID();
            const filterE = mock.edges
                .filter((edge: { from: IdType; to: IdType }) => edge.from === node.id || edge.to === node.id)
                .map((edge: { from: IdType; to: IdType }) => {
                    edge.from = edge.from === node.id ? newId : edge.from;
                    edge.to = edge.to === node.id ? newId : edge.to;
                });
            random.edges.concat(filterE);
            node.id = newId;
            random.nodes.push(node);
        });
        return random;
    }
}

export const MOCK_GRAPH_DATA = {
    nodes: [
        { id: 1, idMongo: '5c90f99b5e365c06ac7e187b', label: 'Bobby', title: 'Personne', type: 'Biographics' },
        { id: 2, idMongo: '2a', label: 'Explosion', title: 'Evenement', type: 'Event' },
        { id: 3, idMongo: '3a', label: 'Voiture', title: 'Equipement', type: 'Equipment' },
        { id: 4, idMongo: '5c911b8c4a45de0e0ca2556a', label: 'Brian', title: 'Personne', type: 'Biographics' },
        { id: 5, idMongo: '5a', label: 'AK-47', title: 'Equipement', type: 'Equipment' },
        { id: 6, idMongo: '5caf3cc4b0b4d23fc041e953', label: 'Attentat', title: 'Evenement', type: 'Event' },
        { id: 7, idMongo: '5c911d434a45de0e0ca2556b', label: 'Raoul', title: 'Personne', type: 'Biographics' },
        { id: 8, idMongo: '5cab0fef4f5f0c0688f6c4a8', label: 'RawData', title: 'Donnee brute', type: 'RawData' },
        { id: 9, idMongo: '5caf3ca6b0b4d23fc041e952', label: 'Rencontre', title: 'Evenement', type: 'Event' },
        { id: 10, idMongo: '5caf3c86b0b4d23fc041e951', label: 'RawData', title: 'Donnee brute', type: 'RawData' }
    ],
    edges: [
        { from: 1, to: 3 },
        { from: 1, to: 2 },
        { from: 1, to: 4 },
        { from: 1, to: 5 },
        { from: 3, to: 5 },
        { from: 3, to: 6 },
        { from: 3, to: 7 },
        { from: 6, to: 10 },
        { from: 2, to: 9 },
        { from: 7, to: 8 },
        { from: 7, to: 8 },
        { from: 9, to: 10 }
    ]
};
