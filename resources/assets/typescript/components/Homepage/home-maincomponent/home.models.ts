export interface IDetails {
    getName();
}

export class CityModel implements IDetails {

    constructor(private city: string) { }

    public getName(): string {
        return this.city;
    }
}

export class BsnsModel implements IDetails {

    private name: string;
    private id: number;

    constructor(obj: any) {
        this.name = obj.name;
        this.id = obj.id;
    }

    public getName(): string {
        return this.name;
    }

    public getID() {
        return this.id;
    }

}

export class DetailsStorage {
    protected original: Array<IDetails>;
    protected modified: Array<IDetails>;

    constructor() {
        this.original = new Array<IDetails>();
        this.modified = new Array<IDetails>();
    }

    public insert(element: IDetails) {
        this.original.push(element);
    }

    public insertModified(element: IDetails) {
        this.modified.push(element);
    }

    public getOriginal() {
        return this.original;
    }

    public getModified() {
        return this.modified;
    }

    public resetModified() {
        this.modified = [];
    }

    public isModifiedEmpty() {
        return this.modified.length == 0 ? true : false;
    }

    public findAndInsert(value: string) {
        let element: IDetails = this.original.find((obj: IDetails) => {
            return obj.getName() == value;
        });
        this.modified.push(element);
    }

    public findOrFail(value: IDetails) {
        let index = this.modified.indexOf(value);
        if (index > -1) {
            this.modified.splice(index, 1);
        }
    }
}

export class ExtendedStorage extends DetailsStorage {
    constructor() {
        super();
    }

    public getCorrespondingIDs() {
        let ids: Array<number> = new Array();

        for (let entry of this.modified) {
            ids.push((<BsnsModel>entry).getID());
        }
        return ids;
    }
}