import { Component, ReflectiveInjector, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../../services/sharedservice/shared.service';

@Component({
	selector: 'side-bar',
	//styleUrls: ['sidebar.component.css'],
	template: require('./sidebar.component.html')
})

export class SideBarComponent {
	@ViewChild('nav') el: ElementRef;
	@ViewChildren('label') labelRef: QueryList<any>;

	constructor(private sharedService: SharedService) {
		//tää ei oo hyvä
		this.sharedService.missionAnnounced$.subscribe(() => {
			this.labelRef.forEach((item, index, array) => {
				let displayType = item.nativeElement.style.display;
				item.nativeElement.style.display = displayType == 'none' ? 'inline-block' : 'none';
			});

			let width = this.el.nativeElement.style.width;
			this.el.nativeElement.style.width = width == '5em' ? '17em' : '5em';
		});

	}
}
