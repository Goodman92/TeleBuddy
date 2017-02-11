import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';
import { PagiConfiguration } from "./pagination.interface"

@Component({
    'selector': 'pagination',
    'template': require('./pagination.component.html')
})

export class PaginationComponent {
    @Input('count') pageCount: number;
    @Input('size') size: number;
    @Input('perPage') perPage: number;
    @Output() pageChanged = new EventEmitter();
    numbers: Array<number>;
    currentPage: number = 1;
    paginationSize: number;

    constructor() { }

    //sivun vaihdos eteenpäin -napilla 
    public next(): void {
        if (this.currentPage < this.paginationSize) {
            this.currentPage++;
            this.updatePaginationNumber();
            this.pageChanged.emit(this.currentPage * this.perPage);
        }
    }

    //sivun vaihdos taaksepäin -napilla
    public prev(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePaginationNumber();
            this.pageChanged.emit(this.currentPage * this.perPage);
        }
    }

    //arbitraarinen vaihdos  
    public jumpTo(value: number): void {
        if (value != this.currentPage) {
            this.currentPage = value;
            this.updatePaginationNumber();
            this.pageChanged.emit(this.currentPage * this.perPage);
        }
    }

    private updatePaginationNumber() {
        let initialDelimiter = Math.floor(this.pageCount / 2);
        let lastDelimiter = this.paginationSize - Math.floor(this.pageCount / 2);
        let remaining = lastDelimiter - Math.floor(this.pageCount / 2);

        let root = this.currentPage - Math.floor(this.pageCount / 2);
        root = root < initialDelimiter ? 1 : root;
        root = root > remaining ? remaining : root;

        for (let i = 0; i < this.pageCount; i++) {
            this.numbers[i] = i + root;
        }
    }

    private initializePagination() {
        this.paginationSize = Math.ceil(this.size / this.perPage);
        this.pageCount = this.pageCount > this.paginationSize ? this.paginationSize : this.pageCount;
        this.numbers = Array(this.pageCount).fill(0).map((x, i) => i);
    }

    ngOnChanges(changes) {
        if (changes.size.currentValue != 0) {
            this.initializePagination();
            if (changes.perPage) {
                if (this.currentPage != 1) {
                    let difference = changes.perPage.currentValue / changes.perPage.previousValue;
                    let newPage = Math.floor(this.currentPage / difference);
                    this.currentPage = newPage < 1 ? 1 : newPage;
                }
            }
            this.updatePaginationNumber();
        }
    }
} 