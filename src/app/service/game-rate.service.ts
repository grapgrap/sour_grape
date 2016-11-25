import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {GameRate} from "../model/game-rate";

@Injectable()
export class GameRateService {
  private url = 'http://52.78.156.169:3000/';
  constructor(private http: Http) {}

  getGameRates(): Observable<GameRate[]> {
    return this.http.get( this.url + 'game-rate')
      .map( res => res.json() );
  }

  getGameRateByTitle(title: string):Observable<GameRate> {
    return this.http.get( this.url + 'game-rate/' + title )
      .map( res => res.json() );
  }

  getGameRateByTitleAndId( title: string, id: string ):Observable<GameRate> {
    return this.http.get( this.url + 'game-rate/' + title + '/' + id )
      .map( res => res.json() );
  }

  getGameRatesById( id: string ):Observable<GameRate[]> {
    return this.http.get( this.url + 'game-rates/' + id )
      .map( res => res.json() );
  }

  getSimilarByTargetAndCompare( target:string, compare:string ):Observable<number> {
    return this.http.get( this.url + 'similar/' + target + '/' + compare )
      .map( res => res.json() );
  }
}
