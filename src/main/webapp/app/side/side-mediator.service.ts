/**
 * Created by gFolgoas on 21/02/2019.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs/index';
import { ToolbarButtonParameters } from '../shared/util/insight-util';
import { SideAction, SideParameters } from '../shared/util/side.util';
import { EventThreadResultSet } from '../shared/util/map-utils';

@Injectable({ providedIn: 'root' })
export class SideMediatorService {
    /**
     * RECEPTION
     * */
    _sideParameters: BehaviorSubject<SideParameters<any>[]> = new BehaviorSubject([]);
    _toolbarActions: BehaviorSubject<ToolbarButtonParameters[]> = new BehaviorSubject([]);
    _sideAction: Subject<SideAction[]> = new Subject();
    _selectedData: Subject<string[]> = new Subject();

    /**
     * EMISSION
     * */
    _onNewDataReceived: Subject<any[]> = new Subject();
    _onNewActionClicked: Subject<string> = new Subject();
    _onNewSearchValue: Subject<string> = new Subject();
    _onNewDataSelected: Subject<string[]> = new Subject();
    _currentResultSet: BehaviorSubject<EventThreadResultSet> = new BehaviorSubject(new EventThreadResultSet([], []));

    constructor() {}

    updateSideParameters(newParameter: SideParameters<any>) {
        const updatedParams = this._sideParameters.getValue();
        const removeParams = this._sideParameters.getValue().filter(param => param.componentTarget === newParameter.componentTarget);
        removeParams.forEach(param => updatedParams.splice(updatedParams.indexOf(param), 1));
        this._sideParameters.next(updatedParams.concat(newParameter));
    }
}
