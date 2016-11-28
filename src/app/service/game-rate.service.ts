import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {GameRate} from "../model/game-rate";

@Injectable()
export class GameRateService {
  private url = 'http://52.78.156.169:3000/';
  constructor(private http: Http) {}
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  //get game-rate
  getGameRates(): Observable<GameRate[]> {
    return this.http.get( this.url + 'game-rate')
      .map( res => res.json() );
  }

  //get game-rate :title
  getGameRateByTitle(title: string):Observable<GameRate> {
    return this.http.get( this.url + 'game-rate/' + title )
      .map( res => res.json() );
  }

  //get game-rate :title :id
  getGameRateByTitleAndId( title: string, id: string ):Observable<GameRate> {
    return this.http.get( this.url + 'game-rate/' + title + '/' + id )
      .map( res => res.json() );
  }

  //get game-rate :id
  getGameRatesById( id: string ):Observable<GameRate[]> {
    return this.http.get( this.url + 'game-rates/' + id )
      .map( res => res.json() );
  }

  //get similar :target :compare
  getSimilarByTargetAndCompare( target:string, compare:string ):Observable<number> {
    return this.http.get( this.url + 'calcul_simScore/' + target + '/' + compare )
      .map( res => res.json() );
  }

  //post game-rate :id :title :rate :rate-date
  addGameRate( gameRate: GameRate ):Observable<GameRate[]> {
    let body: string = JSON.stringify( gameRate );
    console.log( body );
    return this.http.post( this.url + 'game-rate/insert/', body, this.options )
      .map(
        res => {
          res.json();
        }
      ).catch(
        error => Observable.throw( error.json().error || 'server error')
      );
  }

  //get game-rate/game :title
  getCountAboutGameRateByTitle( title: string ):Observable<number>{
    return this.http.get( this.url + 'game-rates/game/' + title )
      .map( res => res.json() );
  }

  //get game-rate/game :id
  getCountAboutGameRateById( id: string ):Observable<number>{
    return this.http.get( this.url + 'game-rates/user/' + id )
      .map( res => res.json() );
  }
}
