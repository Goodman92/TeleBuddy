// HTTP MODELS
export interface BaseModel {
    stringify();
}

export class LoginModel implements BaseModel {

    constructor(public email?: string, public password?: string) { }

    public stringify() {
        let email = this.email;
        let password = this.password;
        return JSON.stringify({ email, password });
    }
}

export class CustomCompanyModel implements BaseModel {

    constructor(protected lines: Array<any>, protected cities?: Array<any>, protected registrationFrom?: string) { }

    public stringify() {
        let lines_ = this.lines;
        let cities_ = this.cities;
        let forms_ = this.registrationFrom;
        return JSON.stringify({lines_, cities_, forms_});
    }
}

export class ClientModel implements BaseModel {
    constructor(private clients: Array<any>) { }
    public stringify() {
        let clients = this.clients;
        return JSON.stringify({clients});
    }
}

export class LiftModel {
    constructor(public title, public data) { }
}


export class ListModel extends CustomCompanyModel implements BaseModel {

    constructor(private listSize: number, private visibilities?: number, lines_?: Array<any>, cities_?: Array<any>) {
        super(lines_, cities_);
    }

    public stringify() {
        let lines = this.lines;
        let cities = this.cities;
        let listSize = this.listSize;
        let visibilities = this.visibilities;
        return JSON.stringify({listSize, visibilities, lines, cities});
    }

}