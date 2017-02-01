import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FileUploadService } from '../../../services/file-upload/file-upload.service';
import { HttpService } from "../../../services/http/http.service";
import { LiftModel } from "../../../interfaces/basemodel.interface";


@Component({
    'selector': 'state-template',
    'template': require('./home.template.html')
})
export class HomeComponent {
    private details: Array<LiftModel>;
    constructor(private httpService: HttpService) {
        this.details = new Array();
        this.httpService.get('api/customers/details').subscribe((result) => {
            if (result) {
                this.details.push(
                    new LiftModel('Aktiiviset yritykset', result.companies),
                    new LiftModel('Toimialoja', result.lines),
                    new LiftModel('Asiakkaat', result.customers),
                    new LiftModel('Päivitetty', result.updated));
            }
        });
    }

}
