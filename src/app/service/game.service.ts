import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Game} from "../model/game";

@Injectable()
export class GameService {

  private url = 'http://52.78.156.169:3000/';
  constructor(private http: Http) {}

  getGames(): Observable<Game[]> {
    return this.http.get( this.url + 'games' )
      .map( res => res.json() ).timeout(10000);
  }
  getGameByTitle(title: string):Observable<Game> {
    return this.http.get(this.url + 'game/' + title)
      .map( res => res.json() ).timeout(10000);
  }
  getGamesByKeyword(keyword: string):Observable<Game[]> {
    return this.http.get(this.url + 'search/' + keyword)
      .map( res => res.json() ).timeout(10000);
  }
}
