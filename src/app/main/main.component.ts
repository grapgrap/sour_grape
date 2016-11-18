import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import { Game } from '../game';
import { GameRate } from '../game-rate';
import {GameRateService} from "../game-rate.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [
    GameRateService
  ]
})
export class MainComponent implements OnInit {
  gameRates: GameRate[];

  isOpen = false;
  errorMsg: string;

  title: string;
  param: any;

  constructor(
    private gameRateService: GameRateService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.getGameRates();
  }

  ngOnInit() {
    this.route.params
      .map(params => params['title'])
      .switchMap(title => this.title = title);
  }

  public getGameRates() {
    this.gameRateService.getGameRates()
      .subscribe(
        gameRates => this.gameRates = gameRates,
        error => this.errorMsg = <any>error
      );
  }

  public onSelect(title: string) {
    this.router.navigate(['/game', title]);
  }
  public toggleMenu($event) {
    this.isOpen = !(this.isOpen);
  }
}
