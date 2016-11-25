import { Injectable } from '@angular/core';
import {User} from "../model/user";
import {Observable} from "rxjs";
import {Http, Response} from "@angular/http";

@Injectable()
export class UserService {
  private url = 'http://52.78.156.169:3000/';
  constructor(private http: Http) { }

  getUserById(id:string):Observable<User> {
    return this.http.get( this.url + 'user/' + id )
      .map( res => res.json() );
  }

  getCompareUsersByTargetUserId(id: string, num:number):Observable<User[]> {
    return this.http.get( this.url + 'users/' + id + '/' + num )
      .map( res => res.json() );
  }
}
