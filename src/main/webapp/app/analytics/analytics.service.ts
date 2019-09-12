import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

import { DEBUG_INFO_ENABLED, SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IBiographics } from 'app/shared/model/biographics.model';
import { IdType } from 'vis';
import { EdgeDTO, GraphDataCollection, IGraphyNodeDTO, IGraphyRelationDTO } from '../shared/model/node.model';
import { NetworkService } from '../network/network.service';
import { catchError, map } from 'rxjs/internal/operators';

type EntityResponseType = HttpResponse<IBiographics>;
type EntityArrayResponseType = HttpResponse<IBiographics[]>;

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
    public resourceUrl = SERVER_API_URL + 'api/biographics';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/biographics';
    private _resourceUrl = SERVER_API_URL + 'api/graph/';

    constructor(protected http: HttpClient) {}

    create(biographics: IBiographics): Observable<EntityResponseType> {
        return this.http.post<IBiographics>(this.resourceUrl, biographics, { observe: 'response' });
    }

    update(biographics: IBiographics): Observable<EntityResponseType> {
        return this.http.put<IBiographics>(this.resourceUrl, biographics, { observe: 'response' });
    }

    find(id: string): Observable<EntityResponseType> {
        return this.http.get<IBiographics>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IBiographics[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: string): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IBiographics[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }

    getRawDataUrLCollection(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IBiographics[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
        // effectue un get sur this.resourceSearchUrl avec des arguments
    }

    // public static getEdgeCollection(idOrigin: IdType, relations: IGraphyRelationDTO[]): EdgeDTO[] {
    //     return relations.map(rel => NetworkService.getEdgeDto(idOrigin, rel.id));
    // }

    // getNodeProperties(janusIdOrigin: IdType): Observable<HttpResponse<IGraphyNodeDTO>> {
    //     const headers = new HttpHeaders();
    //     const url = 'traversal/janus/';
    //
    //     return this.http
    //         .get<IGraphyNodeDTO>(`${this._resourceUrl}` + url + `${janusIdOrigin}`, {
    //             headers,
    //             observe: 'response'
    //         });
    //
    // }
    getGraphData(janusIdOrigin: IdType, applyFilter = true): Observable<GraphDataCollection> {
        const headers = new HttpHeaders();
        const url = 'traversal/';
        return this.http.get(`${this._resourceUrl}` + url + `${janusIdOrigin}`, { headers, observe: 'response' }).pipe(
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
                 *  lorsque les relations seront ajoutées au IGraphyNodeDTO depuis le serveur */
                data.edges = NetworkService.getDirectNeighboursEdgeCollection(janusIdOrigin, data.nodes);
                return data;
            })
        );
    }
}
