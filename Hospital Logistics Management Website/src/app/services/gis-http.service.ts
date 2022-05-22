import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders
} from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

/* import { EssenviaError, EssenviaResponse } from '../models/essenvia-base.model' */

import { Utils } from "../utils";

const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
    withCredentials: false
};

@Injectable()
export class GisHttpService {
    public TIMEOUT = 30000;
    public baseUrl: string;

    constructor(public http: HttpClient) {
        this.baseUrl = Utils.getBaseRESTUrl();
    }

    /**
     * This method will be called by all services. It will use angular http service and
     * add common features across application like timeout, server response processing.
     *
     * @param path path for the url to call
     * @param checkStatus flag tells if server response needs to be checked for mandatory status field
     */
    public httpGet(path: string, checkStatus?: boolean): Observable<any> {
        const url = this.baseUrl + path;
        return this.http.get(url, httpOptions).pipe(
            map(response => this.processResponse(response)),
            catchError(error => this.handleError(error))
        );
    }

    /**
     * This method will be called by all services. It will use angular http service and
     * add common features across application like timeout, server response processing.
     *
     * @param path path for the url to call
     * @param postBody json object that will be sent in http post body
     */
    public httpPost(path: string, postBody: any): Observable<any> {
        const url = this.baseUrl + path;
        return this.http.post<any>(url, postBody, httpOptions).pipe(
            map(response => this.processResponse(response)),
            catchError(error => this.handleError(error))
        );
    }

    /**
     * This method will be called by all services. It will use angular http service and
     * add common features across application like timeout, server response processing.
     *
     * @param path path for the url to call
     * @param postBody json object that will be sent in http post body
     */
    public httpPut(path: string, putBody: any): Observable<any> {
        const url = this.baseUrl + path;
        return this.http.put<any>(url, putBody, httpOptions).pipe(
            map(response => this.processResponse(response)),
            catchError(error => this.handleError(error))
        );
    }

    /**
     * This method will be called by all services. It will use angular http service and
     * add common features across application like timeout, server response processing.
     *
     * @param path path for the url to call
     * @param params json object that will be sent in http post body
     */
    public httpDelete(path: string, postBody: any): Observable<any> {
        const url = this.baseUrl + path;
        const deleteOptions = {
            ...httpOptions,
            body: postBody
        };
        return this.http.delete(url, deleteOptions).pipe(
            map(response => this.processResponse(response)),
            catchError(error => this.handleError(error))
        );
    }

    /**
     * Process response received from server. This is HTTP200 success response, but server might have
     * returned error, this method will process that and generate EssenviaResponse object with original
     * server response in it.
     *
     * @param response http response received from server
     */
    protected processResponse(response): any {
        // http request not OK
        // @TODO check this condition
        console.log("Success", response);
        if(response.status_code === 200){
            return { failed: false, response: response };
        }else{
            return { failed: true, response: response };
        }
    }

    /**
     * This will convert any server returned HTTP error responses as well as any errors thrown while
     * calling the http service.
     *
     * @param error http error response while calling http service
     */
    protected handleError(error: HttpErrorResponse): Observable<any> {
        console.log("Error1", error);
        if (error['status'] == 403) {
            return of({ failed: true, response: error, message: 'Too many failed requests, your requests has been blocked for 24 hrs. If you think it is wrong you can contact support@importkey.com' });
        }
        return of({ failed: true, response: error });
    }
}
