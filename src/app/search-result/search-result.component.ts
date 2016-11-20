import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {GameService} from "../game.service";
import {Game} from "../game";

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css'],
  providers: [
    GameService
  ]
})
export class SearchResultComponent implements OnInit {
  private results: Game[];
  private errorMsg: string;
  private keyword: string;

  constructor(
    private gameService: GameService,
    private router: Router
  ) { }
  ngOnInit() {
    this.splitTitleFromUrl();
    this.getGamesByKeyword(this.keyword);
  }

  private getGamesByKeyword(keyword: string) {
    this.gameService.getGamesByKeyword(keyword)
      .subscribe(
        games => this.results = games,
        error => this.errorMsg = error
      );
  }

  private splitTitleFromUrl() {
    let currentPath = this.router.url;
    let temp: string[] = currentPath.split('/search/');
    this.keyword = temp[1];
  }

  public moveToGameDetailPage(title: string) {
    this.router.navigate(['/game', title]);
  }
}
