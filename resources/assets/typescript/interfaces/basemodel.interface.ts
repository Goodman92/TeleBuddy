export interface BaseModel {
    stringify();
}

export class LoginModel implements BaseModel {
    public email: string;
    public password: string;

    constructor(email_?: string, password_?: string) {
        this.email = email_;
        this.password = password_;
    }

    public stringify() {
        let email = this.email;
        let password = this.password;
        //closure ongelma -> this
        console.log(email);
        console.log(password);
        console.log(JSON.stringify({ email, password }));
        return JSON.stringify({ email, password });
    }
}

export class CustomCompanyModel implements BaseModel {

    protected lines: Array<any>;
    protected cities: Array<any>;
    protected registrationFrom: string;

    constructor(lines_?: Array<any>, cities_?: Array<any>, forms_?: string) {
        this.lines = lines_;
        this.cities = cities_;
        this.registrationFrom = forms_;
    }

    public stringify() {
        let lines_ = this.lines;
        let cities_ = this.cities;
        let forms_ = this.registrationFrom;
        return JSON.stringify({lines_, cities_, forms_});
    }
}

export class ClientModel implements BaseModel {
    private clients: Array<any>;
    constructor(clients_) {
        this.clients = clients_;
    }

    public stringify() {
        let clients = this.clients;
        return JSON.stringify({clients});
    }
}

export class LiftModel {
    public title;
    public data;
    constructor(title_, data_) {
        this.title = title_;
        this.data = data_;
    }
}


export class ListModel extends CustomCompanyModel implements BaseModel {

    private listSize: number;
    private visibilities: number;

    constructor(listSize_: number, visibilities_?: number, lines_?: Array<any>, cities_?: Array<any>, forms_?: Array<any>) {
        super(lines_, cities_, forms_);
        this.listSize = listSize_;
        this.visibilities = visibilities_;
    }

    public stringify() {
        let lines = this.lines;
        let cities = this.cities;
        let forms = this.forms;
        let listSize = this.listSize;
        let visibilities = this.visibilities;
        console.log(cities);
        return JSON.stringify({listSize, visibilities, lines, cities, forms});
    }

}