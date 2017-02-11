export interface IPaginationConfiguration {
    limiter: number;
    size: number;
    count: number;
}

export class PagiConfiguration implements IPaginationConfiguration {
    constructor(public limiter: number, public size: number, public count: number) { }
}
