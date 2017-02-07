export interface IPaginationConfiguration {
    limiter: number;
    size: number;
    count: number;
}

export class PagiModel implements IPaginationConfiguration {
    constructor(public limiter: number, public size: number, public count: number) { }
}
