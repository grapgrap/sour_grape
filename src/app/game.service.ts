import {Injectable} from '@angular/core';
import {Http,Headers,Response, RequestOptions} from '@angular/http';

import {Observable} from 'rxjs/observable';

import {Game} from './game';

@Injectable()
export class GameService {
  private url = '52.78.156.169/';

  private errorMsg : string;
  private games : Game[];

  constructor(
    private http: Http,
    private headers: Headers,
    private response: Response,
  ) {}

  public getGames(): Observable <Game[]> {
    return this.http.get(this.url + '').map(this.extractData)
      .catch(this.handleError);
  }

  public getGameByTitle(title: string) : Observable<Game[]> {
    return this.http.get(this.url + title)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  public addGame(game: Game): Observable<Game> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.url, { name }, options)
                    .map(this.extractData)
                    .catch(this.handleError); 
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
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
