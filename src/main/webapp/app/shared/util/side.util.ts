/**
 * Created by gFolgoas on 21/02/2019.
 */
import { ToolbarButtonParameters } from './insight-util';
/**
 * Permet l'execution de fonction dans le composant du sidePanel visé.
 * Les paramètres sont les inputs optionnels de la fonction.
 * */
export class SideAction {
    componentTarget: string;
    action: string;
    parameters?: any[];

    constructor(componentTarget: string, action: string, parameters?: any[]) {
        this.componentTarget = componentTarget;
        this.action = action;
        this.parameters = parameters;
    }
}

export class ToolbarState {
    componentTarget: string;
    parameters: ToolbarButtonParameters[];

    constructor(componentTarget: string, parameters: ToolbarButtonParameters[]) {
        this.componentTarget = componentTarget;
        this.parameters = parameters;
    }
}

// = {} définit le defaultType
export class SideParameters<T = {}> {
    componentTarget: string;
    parameters: T;

    constructor(componentTarget: string, parameters: T) {
        this.componentTarget = componentTarget;
        this.parameters = parameters;
    }
}
export class EventThreadParameters {
    autoRefresh: boolean;
    filter: string;

    constructor(autoRefresh: boolean, filter: string) {
        this.autoRefresh = autoRefresh;
        this.filter = filter;
    }
}
