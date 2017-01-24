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

    private lines: Array<any>;
    private cities: Array<any>;
    private forms: Array<any>;

    constructor(lines_?: Array<any>, cities_?: Array<any>, forms_?: Array<any>) {
        this.lines = lines_;
        this.cities = cities_;
        this.forms = forms_;
    }
    public stringify() {
        let lines_ = this.lines;
        let cities_ = this.cities;
        let forms_ = this.forms;
        return JSON.stringify({lines_, cities_, forms_});
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