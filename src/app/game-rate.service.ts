import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {GameRate} from "./game-rate";

@Injectable()
export class GameRateService {
  private url = 'http://52.78.156.169:3000/';
  constructor(private http: Http) {}

  getGameRates(): Observable<GameRate[]> {
    return this.http.get( this.url + 'game-rate')
      .map(this.extractData)
      .catch(this.handleError);
  }

  getGameRateByTitle(title: string):Observable<GameRate> {
    return this.http.get( this.url + 'game-rate/' + title )
      .map(this.extractData)
      .catch(this.handleError);
  }


  private extractData(res: Response) {
    let body = res.json();
    let data = body || {};
    return data;
  }

  private handleError(error: Response | any ) {
    let errMsg: string;
    if( error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
