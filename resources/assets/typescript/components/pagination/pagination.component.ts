import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';

@Component({
    'selector': 'pagination',
    'template': require('./pagination.component.html')
})

export class PaginationComponent {
    @Input('count') pageCount: number;
    @Input('size') size: number;
    @Input('perPage') perPage: number;
    @Output() pageChanged = new EventEmitter();
    initialPageCount: number;
    numbers: Array<number>;
    currentPage: number = 1;
    paginationSize: number;
    flag: boolean = true;

    constructor() { }

    //sivun vaihdos eteenpäin -napilla
    public next(): void {
        let initialDelimiter = Math.ceil(this.pageCount / 2);
        let lastDelimiter = this.paginationSize - Math.floor(this.pageCount / 2);
        if (this.currentPage < this.paginationSize) {
            this.currentPage++;
            if (this.currentPage > initialDelimiter && this.currentPage <= lastDelimiter) {
                for (let i = 0; i < this.pageCount; i++) {
                    this.numbers[i] = this.numbers[i] + 1;
                }
            }
            this.pageChanged.emit(this.currentPage * this.perPage);
        }
    }

    //sivun vaihdos taaksepäin -napilla
    public prev(): void {
        let initialDelimiter = Math.ceil(this.pageCount / 2);
        let lastDelimiter = this.paginationSize - Math.floor(this.pageCount / 2);
        if (this.currentPage > 1) {
            if (this.currentPage > initialDelimiter && this.currentPage <= lastDelimiter) {
                for (let i = 0; i < this.pageCount; i++) {
                    this.numbers[i] = this.numbers[i] - 1;
                }
            }
            this.currentPage--;
            this.pageChanged.emit(this.currentPage * this.perPage);
        }
    }

    //arbitraarinen vaihdos 
    public jumpTo(value: number): void {
        let initialDelimiter = Math.ceil(this.pageCount / 2);
        let lastDelimiter = this.paginationSize - Math.floor(this.pageCount / 2);
        let floor = value - Math.floor(this.pageCount / 2);
        this.currentPage = value;
        if (this.currentPage > initialDelimiter && this.currentPage <= lastDelimiter) {
            for (let i = 0; i < this.pageCount; i++) {
                this.numbers[i] = floor + i;
            }
        } else if (this.currentPage <= initialDelimiter) {
            for (let i = 0; i < this.pageCount; i++) {
                this.numbers[i] = i + 1;
            }
        } else {
            for (let i = 0; i < this.pageCount; i++) {
                this.numbers[i] = this.paginationSize - this.pageCount + i + 1;
            }
        }
        this.pageChanged.emit(this.currentPage * this.perPage);


    }

    ngOnChanges(changes) {
        if (this.flag) {
            this.initialPageCount = this.pageCount;
            this.flag = !this.flag;
        }
        this.initializePagination();

        // jos sivun koko(perPage) vaihtuu esim 25 -> 10, päivitetään pagi kuntoon
        if (changes.perPage) {
            if (changes.perPage.previousValue && this.currentPage != 1) {
                let newpage = changes.perPage.previousValue * this.currentPage;
                newpage = newpage < changes.perPage.currentValue ? changes.perPage.currentValue : newpage; 
                this.pageChanged.emit(newpage);
                this.currentPage = Math.floor(this.currentPage * changes.perPage.previousValue / changes.perPage.currentValue);
                this.currentPage = this.currentPage < 1 ? 1 : this.currentPage;
            }
        }

        let page = 1;
        if(this.currentPage > this.pageCount / 2 && this.currentPage < this.paginationSize - this.pageCount / 2) {
            page = this.currentPage - Math.floor(this.pageCount / 2);
        }

        if(this.currentPage > this.paginationSize - this.pageCount / 2) {
            let lastDelimiter = this.paginationSize - Math.floor(this.pageCount / 2);
            page = this.currentPage - Math.floor(this.pageCount / 2) - (this.currentPage-lastDelimiter);
        }
        this.numbers = Array(this.pageCount).fill(0).map((x, i) => {
            return i + page;
        });
    }

    private initializePagination() {
        this.paginationSize = Math.ceil(this.size / this.perPage);
        this.pageCount = this.pageCount > this.paginationSize ? this.paginationSize : this.initialPageCount;
    }

} 