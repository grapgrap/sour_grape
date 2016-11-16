import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import { Game } from '../game';
import { GameService } from '../game.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [ GameService ]
})
export class MainComponent implements OnInit {

  games: Game[];
  isOpen = false;
  errorMsg: string;

  title: string;
  param: any;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.getGames();
    this.param = this.route.params.subscribe(param => this.title = param);
  }

  ngOndestroy() {
    this.param.unsubscribe();
  }

  public getGames(){
    this.gameService.getGames()
      .subscribe(
        games => this.games = games,
        error => this.errorMsg = <any>error
      );
  }
  public toggleMenu($event) {
    this.isOpen = !(this.isOpen);
  }

  public onSelect(title: string) {
    console.log(title);
    this.router.navigate(['/game', title]);
  }
}
