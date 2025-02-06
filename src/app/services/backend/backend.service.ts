import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class BackendService {
    private apiUrl = 'http://localhost:8062/api/v1/system';


    constructor(private http: HttpClient) {}


    getProductsData() {
        return [];
    }

    getProductsWithOrdersData() {
        return [];
    }

    getProductsMini() {
        return Promise.resolve(this.getProductsData().slice(0, 5));
    }

    getProductsSmall() {
        return Promise.resolve(this.getProductsData().slice(0, 10));
    }

    getProducts() {
        return Promise.resolve(this.getProductsData());
    }

    getProductsWithOrdersSmall() {
        return Promise.resolve(this.getProductsWithOrdersData().slice(0, 10));
    }

    getProductsWithOrders() {
        return Promise.resolve(this.getProductsWithOrdersData());
    }

    getSavedData(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/manager-data`);
    }

}
