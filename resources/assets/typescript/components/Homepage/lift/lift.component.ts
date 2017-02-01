import { Component, Inject, Input } from '@angular/core';
import { LiftModel } from "../../../interfaces/basemodel.interface";

@Component({
    'selector': 'lift',
    'template': require('./lift.component.html')
})
export class LiftComponent {
  @Input('data') data: LiftModel;
  constructor() { }

  private isNumber() {
    let condition = typeof this.data.data == 'number';
    return condition;
  }
}
 