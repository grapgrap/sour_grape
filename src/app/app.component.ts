import { Component } from '@angular/core';


import './rxjs-operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
  private isOpen:boolean = false;

  public toggleMenu() {
    this.isOpen = !(this.isOpen);
  }
}
