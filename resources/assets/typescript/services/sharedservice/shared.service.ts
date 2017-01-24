import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SharedService {

    private announceSource = new Subject<boolean>();
    private confirmedSource = new Subject<boolean>();
    public missionAnnounced$ = this.announceSource.asObservable();
    public missionConfirmed$ = this.confirmedSource.asObservable();

    announceMission() {
        this.announceSource.next();
    }
    confirmMission() {
        this.confirmedSource.next();
    }

}
