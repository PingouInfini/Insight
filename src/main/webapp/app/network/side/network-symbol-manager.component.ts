import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataContentInfo, NetworkSymbol } from '../../shared/util/network.util';
import { JhiDataUtils } from 'ng-jhipster';
import { ContextElement, UUID } from '../../shared/util/insight-util';
import symbols = Mocha.reporters.Base.symbols;
import { Subscription } from 'rxjs/index';
import { NetworkService } from '../network.service';
import { UserContextService } from '../../account/user-context/user-context.service';

@Component({
    selector: 'ins-network-symbol-manager',
    templateUrl: './network-symbol-manager.component.html',
    styles: []
})
export class NetworkSymbolManagerComponent implements OnInit, OnDestroy {
    symbols: NetworkSymbol[] = [];
    selectedImageIds: string[] = [];
    validImageTypes = ['image/jpeg', 'image/png'];

    orderProperty = 'isPresentInNetwork';
    valueOrder = [true, false];

    private _networkContentSubs: Subscription;

    constructor(private dataUtils: JhiDataUtils, private _ns: NetworkService, private _ucs: UserContextService) {}

    ngOnInit() {
        const dataCtx: ContextElement = this._ucs.getTabContext('NETWORK').context.get('NETWORK_SYMBOLS');
        if (dataCtx && dataCtx.value) {
            const ctxSymbols = <NetworkSymbol[]>dataCtx.value;
            this.symbols.push(...ctxSymbols);
        }

        setTimeout(() => {
            this._networkContentSubs = this._ns.networkDataContent.subscribe((newContent: DataContentInfo[]) => {
                const addedImageUrls = {};
                this.symbols
                    .filter(symbol => !symbol.isPresentInNetwork)
                    .forEach(symbol => {
                        addedImageUrls[symbol.base64] = symbol;
                    });
                newContent
                    .filter(item => item.image !== null && typeof item.image !== 'undefined')
                    .forEach(item => {
                        const newSymbole = new NetworkSymbol(UUID(), item.image, true);
                        addedImageUrls[newSymbole.base64] = newSymbole;
                    });
                this.symbols = Object.keys(addedImageUrls).map(key => addedImageUrls[key]);
            });
        });
    }

    ngOnDestroy() {
        this._ucs.updateContext(
            'NETWORK',
            new ContextElement<NetworkSymbol[]>('NETWORK_SYMBOLS', this.symbols.filter(symbol => !symbol.isPresentInNetwork))
        );
    }

    onFileInputChange(event: any) {
        if (event.target.files && event.target.files.length) {
            const newSymbol: NetworkSymbol = new NetworkSymbol(UUID(), '', false);
            const file = event.target.files[0];
            if (this.validImageTypes.indexOf(file.type) === -1) {
                return;
            }
            this.dataUtils.toBase64(file, base64Data => {
                const type = file.type;
                newSymbol.base64 = `data:${type};base64,` + base64Data;
                this.symbols = this.symbols.concat([newSymbol]);
            });
        }
    }

    onAction(action: string) {
        switch (action) {
            case 'DELETE_ALL_IMAGES':
                this.symbols = this.symbols.filter(s => s.isPresentInNetwork);
                break;
            case 'DELETE_SELECTED_IMAGES':
                this.symbols = this.symbols.filter(
                    symbole => this.selectedImageIds.indexOf(symbole.symbolId) === -1 || symbole.isPresentInNetwork
                );
                this.selectedImageIds = [];
                break;
            default:
                break;
        }
    }

    onImageSelected(id: string) {
        const newArray: string[] = this.selectedImageIds;
        const index = newArray.indexOf(id);
        if (index !== -1) {
            newArray.splice(index, 1);
        } else {
            newArray.push(id);
        }
        this.selectedImageIds = newArray;
    }
}
