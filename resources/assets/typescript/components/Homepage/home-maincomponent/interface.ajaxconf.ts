export interface IAjaxConfiguration {
    buffer: number;
    leftBuffer: number;
    bufferSize: number;
    collectionSize: number;
    currentPosition: number;
    reserve: number;
}

export class AjaxModel implements IAjaxConfiguration {
    constructor(public buffer, public leftBuffer,
        public bufferSize, public collectionSize,
        public currentPosition, public reserve) { }
}