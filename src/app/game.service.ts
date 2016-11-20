import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Game} from "./game";

@Injectable()
export class GameService {

  private url = 'http://52.78.156.169:3000/';
  constructor(private http: Http) {}

  getGames(): Observable<Game[]> {
    return this.http.get( this.url + 'games' )
      .map(this.extractData)
      .catch(this.handleError);
  }

  getGameByTitle(title: string):Observable<Game>{
    return this.http.get(this.url + 'game/' + title)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getGamesByKeyword(keyword: string):Observable<Game[]>{
    return this.http.get(this.url + 'search/' + keyword)
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
