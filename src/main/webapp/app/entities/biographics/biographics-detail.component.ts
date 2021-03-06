import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IBiographics } from 'app/shared/model/biographics.model';

@Component({
    selector: 'ins-biographics-detail',
    templateUrl: './biographics-detail.component.html'
})
export class BiographicsDetailComponent implements OnInit {
    biographics: IBiographics;

    constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ biographics }) => {
            this.biographics = biographics;
        });
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }
}
