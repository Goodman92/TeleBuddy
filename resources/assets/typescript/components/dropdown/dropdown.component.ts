import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    'selector': 'dropdown',
    'template': require('./dropdown.component.html')
})

export class DropdownComponent {
    @Input('collection') collection: any;
    @Output() collectionUpdated = new EventEmitter();
    private modifiedCollection: Array<string>;


    constructor() {
        this.modifiedCollection = [];
    }

    public onChange(value: string): void {
        if (value == "Kaikki") {
            this.modifiedCollection = [];
            this.collectionUpdated.emit(value);
        } else {
            var index = this.modifiedCollection.indexOf(value);
            if (index == -1) {
                this.modifiedCollection.push(value);
                this.collectionUpdated.emit(value);
            }
        }
    }

    ngOnInit() {
        console.log("dropdown");
        console.log(this.collection);
    }
}
