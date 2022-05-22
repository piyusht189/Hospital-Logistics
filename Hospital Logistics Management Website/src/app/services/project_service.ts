import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { Store } from "@ngrx/store";
import * as RootReducer from "../app.reducers";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as CommonActions from "../actions/common.action";
import { GisHttpService } from './gis-http.service';
var company_name = null;
@Injectable()
export class ProjectService {
    user_id;
    email;
    customer_id
    constructor(
        public httpService: GisHttpService,
        public rootstore: Store<RootReducer.State>,
        private _http: HttpClient
    ) {
        rootstore
            .select(state => state.common.user)
            .subscribe(userObj => {
                if (userObj) {
                    if (userObj["id"] || userObj["id"] == 0) {
                        this.user_id = userObj["id"];
                    }
                    if (userObj["email"]) {
                        this.email = userObj["email"];
                    }
                    if (userObj["customer_id"]) {
                        this.customer_id = '' + userObj["customer_id"];
                    }
                }
            });
    }
    public getAllProjects(obj): Observable<any> {
        return this.httpService.httpGet("marketing/project?user="+ obj.id).pipe(
            map(response => {
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }

    public UpsertCurrentProject(obj): Observable<any> {
        return this.httpService.httpGet("marketing/project/mark/default/"+ obj.project_id +"/"+ obj.id).pipe(
            map(response => {
                if (!response._failed) {
                    response._result = response.response;
                }
                if(obj['url']){
                    response['url'] = obj['url'];
                }
                return response;
            })
        );
    }
    public fetchSignUpForms(proj_id): Observable<any> {
        return this.httpService.httpGet("marketing/signup/form?project=" + proj_id).pipe(
            map(response => {
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }
    public fetchFormTemplates(): Observable<any> {
        return this.httpService.httpGet("marketing/css/template").pipe(
            map(response => {
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }
    
    
    
    public searchQuery(obj): Observable<any> {
        if (obj['inside']) {
            if (obj['type'] === 'shipment') {
                return this.httpService.httpPost("api/shipment/search?user_id=" + this.user_id, { query: obj["company_name"], page: obj['page'], from: obj['from'], to: obj['to'], filter: obj['filter'] }).pipe(
                    map(response => {
                        this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                        if (!response._failed) {
                            response._result = response.response;
                        }
                        return response;
                    })
                );
            } else {
                return this.httpService.httpPost("api/" + obj["type"] + "/matching/shipment?user_id=" + this.user_id, { query: obj["query"], company_name: obj["company_name"], from: obj['from'], to: obj['to'], filter: obj['filter'] }).pipe(
                    map(response => {
                        this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                        if (!response._failed) {
                            response._result = response.response;
                        }
                        return response;
                    })
                );
            }
        } else {
            return this.httpService.httpPost("api/" + obj["type"] + "/search?user_id=" + this.user_id, { query: obj["query"], page: obj['page'], from: obj['from'], to: obj['to'], filter: obj['filter'] }).pipe(
                map(response => {
                    this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                    response._result = response.response;
                    if (!response._failed) {
                        if (response.response.status_code === 400) {

                        } else {
                            response._result.result.query = obj["query"];
                            response._result.result.type = obj["type"];
                        }

                        if (obj['filter']) {
                            response.filters = 1;
                        }
                    }

                    return response;
                })
            );
        }
    }
    public FetchNextPage(obj): Observable<any> {
        if (obj['inside']) {
            if (obj['type'] === 'shipment') {
                return this.httpService.httpPost("api/shipment/search?user_id=" + this.user_id, { query: obj["company_name"] }).pipe(
                    map(response => {
                        this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                        if (!response._failed) {
                            response._result = response.response;
                        }
                        return response;
                    })
                );
            } else {
                return this.httpService.httpPost("api/" + obj["type"] + "/matching/shipment?user_id=" + this.user_id, { query: obj["query"], company_name: obj["company_name"] }).pipe(
                    map(response => {
                        this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                        if (!response._failed) {
                            response._result = response.response;
                        }
                        return response;
                    })
                );
            }
        } else {
            if (obj['type'] === 'consignee') {
                return this.httpService.httpPost("api/shipment/consignee/search?user_id=" + this.user_id, { query: obj["query"], page: obj['page'], from: obj['from'], to: obj['to'], filter: obj['filter'] }).pipe(
                    map(response => {
                        this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                        if (!response._failed) {
                            response._result = response.response;
                            response._result.type = obj["type"]
                            response._result.page = obj["page"]
                        }
                        return response;
                    })
                );
            } else if (obj['type'] === 'shipper') {
                return this.httpService.httpPost("api/shipment/shipper/search?user_id=" + this.user_id, { query: obj["query"], page: obj['page'], from: obj['from'], to: obj['to'], filter: obj['filter'] }).pipe(
                    map(response => {
                        this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                        if (!response._failed) {
                            response._result = response.response;
                            response._result.type = obj["type"]
                            response._result.page = obj["page"]
                        }
                        return response;
                    })
                );
            } else if (obj['type'] === 'companyshipper') {
                return this.httpService.httpPost("api/company/shipper/details?user_id=" + this.user_id, { company_name: obj["query"], page: obj['page'], from: obj['from'], to: obj['to'], filter: obj['filter'] }).pipe(
                    map(response => {
                        this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                        if (!response._failed) {
                            response._result = response.response;
                            response._result.type = obj["type"]
                            response._result.page = obj["page"]
                        }
                        return response;
                    })
                );
            } else if (obj['type'] === 'companyconsignee') {
                return this.httpService.httpPost("api/company/consignee/details?user_id=" + this.user_id, { company_name: obj["query"], page: obj['page'], from: obj['from'], to: obj['to'], filter: obj['filter'] }).pipe(
                    map(response => {
                        this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                        if (!response._failed) {
                            response._result = response.response;
                            response._result.type = obj["type"]
                            response._result.page = obj["page"]
                        }
                        return response;
                    })
                );
            } else if (obj['type'] === 'companyshipment') {
                return this.httpService.httpPost("api/shipment/search?user_id=" + this.user_id, { query: obj["query"], page: obj['page'], from: obj['from'], to: obj['to'], filter: obj['filter'] }).pipe(
                    map(response => {
                        this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                        if (!response._failed) {
                            response._result = response.response;
                            response._result.type = obj["type"]
                            response._result.page = obj["page"]
                        }
                        return response;
                    })
                );
            } else {
                return this.httpService.httpPost("api/" + obj["type"] + "/search?user_id=" + this.user_id, { query: obj["query"], page: obj['page'], from: obj['from'], to: obj['to'], filter: obj['filter'] }).pipe(
                    map(response => {
                        this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                        if (!response._failed) {
                            response._result = response.response;
                            response._result.type = obj["type"]
                            response._result.page = obj["page"]
                        }
                        return response;
                    })
                );
            }
        }
    }

    public searchConsignee(obj): Observable<any> {
        return this.httpService.httpPost("api/shipment/consignee/search?user_id=" + this.user_id, { query: obj["query"], page: obj['page'], from: obj['from'], to: obj['to'], filter: obj['filter'] }).pipe(
            map(response => {
                this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                if (!response._failed) {
                    response._result = response.response;
                    if (obj['filter']) {
                        response.filters = 1;
                    }
                }
                return response;
            })
        );
    }
    public searchShipper(obj): Observable<any> {
        return this.httpService.httpPost("api/shipment/shipper/search?user_id=" + this.user_id, { query: obj["query"], page: obj['page'], from: obj['from'], to: obj['to'], filter: obj['filter'] }).pipe(
            map(response => {
                this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                if (!response._failed) {
                    response._result = response.response;
                    if (obj['filter']) {
                        response.filters = 1;
                    }
                }
                return response;
            })
        );
    }
    public getCompanyDetails(obj): Observable<any> {
        company_name = obj["company_name"];
        return this.httpService.httpPost("api/company/address?user_id=" + this.user_id, { company_name: obj["company_name"] }).pipe(
            map(response => {
                this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }
    public getCompanyGraph(obj): Observable<any> {
        company_name = obj["company_name"];
        return this.httpService.httpPost("api/company/trading?user_id=" + this.user_id, { size: obj['count'], company_name: obj["company_name"] }).pipe(
            map(response => {
                this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }

    public getCompanyCarriers(obj): Observable<any> {
        return this.httpService.httpPost("api/company/top/carriers?user_id=" + this.user_id, { company_name: company_name }).pipe(
            map(response => {
                this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }
    public getCompanyPorts(obj): Observable<any> {
        return this.httpService.httpPost("api/company/top/ports?user_id=" + this.user_id, { company_name: company_name }).pipe(
            map(response => {
                this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }
    public getCompanyProducts(obj): Observable<any> {
        return this.httpService.httpPost("api/" + obj['type'] + "/top/products?user_id=" + this.user_id, { company_name: company_name }).pipe(
            map(response => {
                this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }
    public getCompanyShippers(obj): Observable<any> {
        return this.httpService.httpPost("api/company/shipper/details?user_id=" + this.user_id, { company_name: company_name, query: obj["query"], page: obj['page'], from: obj['from'], to: obj['to'], filter: obj['filter'] }).pipe(
            map(response => {
                this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }
    public getCompanyConsignees(obj): Observable<any> {
        return this.httpService.httpPost("api/company/consignee/details?user_id=" + this.user_id, { company_name: company_name, query: obj["query"], page: obj['page'], from: obj['from'], to: obj['to'], filter: obj['filter'] }).pipe(
            map(response => {
                this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }
    public getSearchHistory(obj): Observable<any> {
        return this.httpService.httpGet("api/search/log?user_id=" + this.user_id).pipe(
            map(response => {
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }
    public getAllCarrierCodes(obj): Observable<any> {
        return this.httpService.httpGet("api/carriers?user_id=" + this.user_id).pipe(
            map(response => {
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }
    public getBuyerFilters(obj): Observable<any> {
        return this.httpService.httpPost("api/buyer/filter/list?user_id=" + this.user_id, { query: obj["query"], from: obj["from"], to: obj["to"] }).pipe(
            map(response => {
                this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }
    public getSupplierFilters(obj): Observable<any> {
        return this.httpService.httpPost("api/supplier/filter/list?user_id=" + this.user_id, { query: obj["query"], from: obj["from"], to: obj["to"] }).pipe(
            map(response => {
                this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }
    public getShipmentFilters(obj): Observable<any> {
        return this.httpService.httpPost("api/shipment/filter/list?user_id=" + this.user_id, { query: obj["query"], from: obj["from"], to: obj["to"] }).pipe(
            map(response => {
                this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }

    public getCompanyShipmentFilters(obj): Observable<any> {
        return this.httpService.httpPost("api/" + obj['type'] + "/shipment/filter/list?user_id=" + this.user_id, { query: obj["query"], company_name: obj["company_name"], from: obj['from'], to: obj['to'] }).pipe(
            map(response => {
                this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }
    public getCompanyShipmentFiltersInside(obj): Observable<any> {
        return this.httpService.httpPost("api/shipment/filter/list?user_id=" + this.user_id, { query: obj["company_name"], from: obj['from'], to: obj['to'] }).pipe(
            map(response => {
                this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }
    public GetExport(obj): Observable<any> {
        if (obj['flag'] === 'consignee') {
            return this.httpService.httpPost("api/export/shipment/consignee?user_id=" + this.user_id, { query: obj["query"], size: obj['size'], type: obj['type'], from: obj['from'], to: obj['to'], filter: obj['filter'] }).pipe(
                map(response => {
                    this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                    if (!response._failed) {
                        response._result = response.response;
                    }
                    return response;
                })
            );
        } else if (obj['flag'] === 'shipper') {
            return this.httpService.httpPost("api/export/shipment/shipper?user_id=" + this.user_id, { query: obj["query"], size: obj['size'], type: obj['type'], from: obj['from'], to: obj['to'], filter: obj['filter'] }).pipe(
                map(response => {
                    this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                    if (!response._failed) {
                        response._result = response.response;
                    }
                    return response;
                })
            );
        } else if (obj['flag'] === 'companyshipment') {
            return this.httpService.httpPost("api/export/" + obj['consumer_type'] + "/matching/shipment?user_id=" + this.user_id, { company_name: obj["company_name"], query: obj["query"], size: obj['size'], type: obj['type'], from: obj['from'], to: obj['to'], filter: obj['filter'] }).pipe(
                map(response => {
                    this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                    if (!response._failed) {
                        response._result = response.response;
                    }
                    return response;
                })
            );
        } else if (obj['flag'] === 'companyshipper') {
            return this.httpService.httpPost("api/export/company/shipper?user_id=" + this.user_id, { company_name: obj["company_name"], query: obj["query"], size: obj['size'], type: obj['type'], from: obj['from'], to: obj['to'], filter: obj['filter'] }).pipe(
                map(response => {
                    this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                    if (!response._failed) {
                        response._result = response.response;
                    }
                    return response;
                })
            );
        } else if (obj['flag'] === 'companyconsignee') {
            return this.httpService.httpPost("api/export/company/consignee?user_id=" + this.user_id, { company_name: obj["company_name"], query: obj["query"], size: obj['size'], type: obj['type'], from: obj['from'], to: obj['to'], filter: obj['filter'] }).pipe(
                map(response => {
                    this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                    if (!response._failed) {
                        response._result = response.response;
                    }
                    return response;
                })
            );
        } else {
            return this.httpService.httpPost('api/export/' + obj['flag'] + '/search?user_id=' + this.user_id, { query: obj["query"], size: obj['size'], type: obj['type'], from: obj['from'], to: obj['to'], filter: obj['filter'] }).pipe(
                map(response => {
                    this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                    if (!response._failed) {
                        response._result = response.response;
                    }
                    return response;
                })
            );
        }
    }
    public GetAdvancedExport(obj): Observable<any> {

        return this.httpService.httpPost('api/multi/search/export?user_id=' + this.user_id, {
            must: obj['must'],
            should: obj['should'],
            no_blank_sb: obj['no_blank_sb'],
            size: obj['size'],
            type: obj['type'],
            from: obj['from'],
            to: obj['to']
        }).pipe(
            map(response => {
                this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );

    }
    public GetExportFile(obj): Observable<any> {
        // const options = { headers, params, responseType: 'blob' };
        // return this.http.get('/', options).share();
        if (obj['flag'] === 'consignee') {
            return this._http.post('https://api.importkey.com/api/export/shipment/consignee?user_id=' + this.user_id, { query: obj["query"], size: obj['size'], type: obj['type'], from: obj['from'], to: obj['to'], filter: obj['filter'] }, {
                responseType: 'blob',
                observe: 'response'
            });
        } else if (obj['flag'] === 'shipper') {
            return this._http.post('https://api.importkey.com/api/export/shipment/shipper?user_id=' + this.user_id, { query: obj["query"], size: obj['size'], type: obj['type'], from: obj['from'], to: obj['to'], filter: obj['filter'] }, {
                responseType: 'blob',
                observe: 'response'
            });
        } else if (obj['flag'] === 'companyshipment') {
            return this._http.post('https://api.importkey.com/api/export/' + obj['consumer_type'] + '/matching/shipment?user_id=' + this.user_id, { company_name: obj["company_name"], query: obj["query"], size: obj['size'], type: obj['type'], from: obj['from'], to: obj['to'], filter: obj['filter'] }, {
                responseType: 'blob',
                observe: 'response'
            });
        } else if (obj['flag'] === 'companyshipper') {
            return this._http.post('https://api.importkey.com/api/export/company/shipper?user_id=' + this.user_id, { company_name: obj["company_name"], query: obj["query"], size: obj['size'], type: obj['type'], from: obj['from'], to: obj['to'], filter: obj['filter'] }, {
                responseType: 'blob',
                observe: 'response'
            });
        } else if (obj['flag'] === 'companyconsignee') {
            return this._http.post('https://api.importkey.com/api/export/company/consignee?user_id=' + this.user_id, { company_name: obj["company_name"], query: obj["query"], size: obj['size'], type: obj['type'], from: obj['from'], to: obj['to'], filter: obj['filter'] }, {
                responseType: 'blob',
                observe: 'response'
            });
        } else {
            return this._http.post('https://api.importkey.com/api/export/' + obj['flag'] + '/search?user_id=' + this.user_id, { query: obj["query"], size: obj['size'], type: obj['type'], from: obj['from'], to: obj['to'], filter: obj['filter'] }, {
                responseType: 'blob',
                observe: 'response'
            });
        }
    }

    public GetAdvancedExportFile(obj): Observable<any> {
        return this._http.post('https://api.importkey.com/api/multi/search/export?user_id=' + this.user_id, {
            must: obj['must'],
            should: obj['should'],
            no_blank_sb: obj['no_blank_sb'],
            size: obj['size'],
            type: obj['type'],
            from: obj['from'],
            to: obj['to']
        }, {
                responseType: 'blob',
                observe: 'response'
            });
    }

    public GetSummary(obj): Observable<any> {
        return this.httpService.httpPost("api/" + obj['type'] + "/summary?user_id=" + this.user_id, { company_name: obj["company_name"] }).pipe(
            map(response => {
                this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }
    public changePassword(obj): Observable<any> {
        return this.httpService.httpPost("auth/change/password/" + this.email + "?user_id=" + this.user_id, obj).pipe(
            map(response => {
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }
    public getUpdates(obj): Observable<any> {
        return this.httpService.httpGet("api/recent/widget?user_id=" + this.user_id).pipe(
            map(response => {
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }
    public GetRecentSearches(obj): Observable<any> {
        return this.httpService.httpGet("api/recent/search/log?user_id=" + this.user_id).pipe(
            map(response => {
                this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }
    public getNews(obj): Observable<any> {
        return this.httpService.httpGet("info/news?user_id=" + this.user_id).pipe(
            map(response => {
                this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }
    public getResearch(obj): Observable<any> {
        return this.httpService.httpGet("info/reserch?user_id=" + this.user_id).pipe(
            map(response => {
                this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }
    public getActivityFeed(obj): Observable<any> {
        return this.httpService.httpGet("api/recent/activity?user_id=" + this.user_id).pipe(
            map(response => {
                this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }
    public getTransactionHistory(obj): Observable<any> {
        return this.httpService.httpGet("auth/transaction/history/" + this.customer_id + "?user_id=" + this.user_id).pipe(
            map(response => {
                this.checkLogout(response.response ? response.response.status_code ? response.response.status_code : null : null);
                if (!response._failed) {
                    response._result = response.response;
                }
                return response;
            })
        );
    }

    checkLogout(val) {
        if (val) {
            if (val === 800) {
                //Logout
                this.rootstore.dispatch(new CommonActions.LogoutRequest({}));
            }
        }
    }





}
