import { Component } from '@angular/core';

import 'rxjs/Rx';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    public isOpen = false;
    public toggleMenu($event) {
        this.isOpen = !(this.isOpen);
    }
}
