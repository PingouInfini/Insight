/**
 * Created by gFolgoas on 07/02/2019.
 */
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Filtre la liste en input sur la valeur de la propriété des objets spécifiée
 * */
@Pipe({ name: 'listFilterPipe' })
export class ListFilterPipe implements PipeTransform {
    transform(value: any[], propertyFiltered: string, valueFiltered: any): any[] {
        if (value == null || typeof value === 'undefined') {
            return null;
        }
        return value.filter(i => {
            return i[propertyFiltered] === valueFiltered;
        });
    }
}

/**
 * Renvoie une liste des propriétés d'un objet dont les valeurs nulles sont filtrées
 * Possibilité d'ajouter une liste de propriétés à retirer
 * */
@Pipe({ name: 'objectFilterNullPipe' })
export class ObjectFilterNullPipe implements PipeTransform {
    transform(value: {}, propertiesToRemove: string[]): {} {
        if (value == null || typeof value === 'undefined') {
            return null;
        }
        return Object.keys(value).filter(
            key => value[key] !== null && typeof value[key] !== 'undefined' && propertiesToRemove.indexOf(key) === -1
        );
    }
}

/**
 * Filtre la liste en input sur la valeur des propriétés des objets spécifiée (propriétés: string[], keyword: string)
 * */
@Pipe({ name: 'listFilterByStringPipe' })
export class ListFilterByStringPipe implements PipeTransform {
    transform(value: any[], targetProperties: string[], keyWord: string): any[] {
        if (value == null || typeof value === 'undefined') {
            return null;
        }
        return value.filter(i => {
            const found = targetProperties.find(prop => {
                if (typeof i[prop] !== 'string') {
                    return false;
                }
                const val: string = i[prop];
                return val.toLowerCase().match(keyWord.toLowerCase()) !== null;
            });
            return typeof found !== 'undefined';
        });
    }
}
