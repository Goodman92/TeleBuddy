import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    'selector': 'dropdown',
    'template': require('./dropdown.component.html')
})

export class DropdownComponent {
    @Input('collection') collection: any;
    @Output() collectionUpdated = new EventEmitter();
    private modifiedCollection: Array<string> = new Array<string>();

    public onChange(value: string): void {
        this.collectionUpdated.emit(value);
    }

}
