import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DetailsStorage} from "../home-maincomponent/home.models";

@Component({
    'selector': 'dropdown',
    'template': require('./dropdown.component.html')
})

export class DropdownComponent {
    @Input('collection') collection: Array<DetailsStorage>;
    @Output() collectionUpdated = new EventEmitter();

    public onChange(value: string): void {
        this.collectionUpdated.emit(value);
    }
}
