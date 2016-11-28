import { Component, OnInit } from '@angular/core';
import {UserService} from "../service/user.service";
import {User} from "../model/user";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [
    UserService
  ]
})
export class LoginComponent implements OnInit {
  user: any = {};

  constructor(
    private userService:UserService,
    private router:Router
  ) { }

  ngOnInit() {
  }

  public getAuth() {
    console.log(this.user);
    this.userService.getUserById(this.user.id).subscribe(res=>{
      if(res.length == 0) alert("아이디를 확인해 주세요");
      else {
        let compare = res[0];
        if( this.user.password != compare.password ) alert("비밀번호를 확인해 주세요");
        else {
          sessionStorage.setItem('currentUser', JSON.stringify(compare));
          this.router.navigate(['/']);
        }
      }
    });
  }
}
