import { Component, Input } from '@angular/core';

@Component({
    'selector': 'progress-bar',
    'template': require('./progress-bar.template.html')
})
export class ProgressBar {

    @Input()
    private progress: number = 0;
}
