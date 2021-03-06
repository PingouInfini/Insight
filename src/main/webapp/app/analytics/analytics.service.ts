import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IBiographics } from 'app/shared/model/biographics.model';
import { RawData } from '../shared/model/raw-data.model';
import { IGraphyNodeDTO } from '../shared/model/node.model';
import { catchError, map } from 'rxjs/internal/operators';
import { ScoreDTO, Theme } from '../shared/model/analytics.model';
import { NetworkService } from 'app/network/network.service';

type EntityResponseType = HttpResponse<IBiographics>;
type EntityArrayResponseType = HttpResponse<IBiographics[]>;

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
    public resourceUrl = SERVER_API_URL + 'api/biographics';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/biographics';
    private _resourceUrl = SERVER_API_URL + 'api/graph/';

    alertThreshold = {
        0: 'green',
        1: 'yellow',
        2: 'orange',
        3: 'red'
    };

    public static getScoreDTO(
        externalIdBio?: string,
        externalIdRawData?: string,
        mongoIdRawData?: string,
        rawDataUrl?: string,
        scorePoints?: string,
        scoreListMotsClefs?: { theme: Theme; motClef: string }[],
        scoreImageHit?: string,
        scoreFrequence?: string,
        depthLevel?: string,
        idDictionary?: string
    ): ScoreDTO {
        return new ScoreDTO(
            externalIdBio,
            externalIdRawData,
            mongoIdRawData,
            rawDataUrl,
            scorePoints,
            scoreListMotsClefs,
            scoreImageHit,
            scoreFrequence,
            depthLevel,
            idDictionary
        );
    }

    constructor(protected http: HttpClient, private _ns: NetworkService) {}

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

    getScores(janusIdOrigin: string): Observable<ScoreDTO[]> {
        const headers = new HttpHeaders();
        return this.http
            .get(`${this._resourceUrl}` + 'traversal/' + `${janusIdOrigin}`, {
                headers,
                observe: 'response'
            })
            .pipe(
                catchError(error => {
                    const fakeResponse: HttpResponse<IGraphyNodeDTO[]> = new HttpResponse({
                        body: this._ns.getRamdomizedMockData().nodes,
                        headers: new HttpHeaders(),
                        status: 200
                    });
                    return of(fakeResponse);
                    // return of(FAKE_SCORE.map(s => s.externalIdBio = janusIdOrigin));
                }),
                map((res: HttpResponse<IGraphyNodeDTO[]>) => {
                    const body: IGraphyNodeDTO[] = res.body; // vrai noeud avec les props
                    const data: ScoreDTO[] = body
                        .map((item: IGraphyNodeDTO) => {
                            if (item.type === 'RawData' && item.properties) {
                                return AnalyticsService.getScoreDTO(
                                    janusIdOrigin as string,
                                    item.id,
                                    item.idMongo,
                                    item.properties.rawDataUrl as string,
                                    item.properties.points as string,
                                    (item.properties.listMotsClefs as string[]).map(str => {
                                        const parts = str.split('.');
                                        const theme = parts[0];
                                        parts.shift();
                                        const motclef = parts.toString().replace(new RegExp(',', 'g'), '.');
                                        return { theme: theme as Theme, motClef: motclef };
                                    }),
                                    item.properties.imageHit as string,
                                    item.properties.frequence as string,
                                    item.properties.depthLevel as string,
                                    item.properties.idDictionary as string
                                );
                            } else {
                                return null;
                            }
                        })
                        .filter(s => s !== null);
                    return data;
                }),
                map((score: ScoreDTO[]) => {
                    if (score === null || score.length === 0) {
                        return FAKE_SCORE;
                    } else {
                        return score;
                    }
                })
            );
    }
}

export const FAKE_SCORE: ScoreDTO[] = [
    {
        externalIdBio: 'fake-external-bio-id',
        externalIdRawData: 'fake-external-rawdata-id',
        mongoIdRawData: 'fake-mongo-rawdata-id',
        scorePoints: '12',
        scoreListMotsClefs: [
            { theme: 'TER', motClef: 'barbecue' },
            { theme: 'TER', motClef: 'papillon' },
            { theme: 'TER', motClef: 'saucisse' },
            { theme: 'SUB', motClef: 'chips' },
            { theme: 'CRO', motClef: 'ornithorynque' }
        ],
        scoreImageHit: '12',
        scoreFrequence: '12'
    },
    {
        externalIdBio: 'fake-external-bio-id2',
        externalIdRawData: 'fake-external-rawdata-id2',
        mongoIdRawData: 'fake-mongo-rawdata-id2',
        scorePoints: '20',
        scoreListMotsClefs: [
            { theme: 'ESP', motClef: 'truc' },
            { theme: 'ESP', motClef: 'bidule' },
            { theme: 'TER', motClef: 'machin' },
            { theme: 'CRO', motClef: 'chose' }
        ],
        scoreImageHit: '12',
        scoreFrequence: '12'
    }
];
