import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { LoginModel, BaseModel } from '../../interfaces/basemodel.interface';

@Injectable()

export class HttpService {
    constructor(private http: Http) { }

    public get(url: string, headers?: Headers) {
        let header = new Headers({ 'Authorization': 'Bearer: ' + this.getAuthToken() });
        let options = new RequestOptions({ headers: header });
        return this.http
            .get(url, options)
            .map((response: Response) => {
               try {
                    return response.json();
                }
                catch(err) {
                    console.log(err);
                    console.log("error");
                    return response;
                }
            });
    }

    public post(url: string, payLoad: BaseModel) {
        console.log("httpService!");
        console.log(payLoad);
        let headers = new Headers({ 'Authorization': 'Bearer: ' + this.getAuthToken() });
        headers.append('Content-Type', 'application/json');
        return this.http
            .post(url, payLoad.stringify(), { headers })
            .map((res) => {
                console.log(res);
                try {
                    return res.json();
                }
                catch(err) {
                    console.log(err);
                    console.log("error");
                    return res;
                }
            });
    }

    public getAuthToken() {
        return localStorage.getItem('auth_token');
    }
}