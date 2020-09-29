import { Component, OnInit } from '@angular/core';
import { UserStoreService } from '../../services/user-store.service';


@Component({
    selector: 'nx-admin',
    template: `<router-outlet></router-outlet>`,
    styles: [`
    :host {
        display: block;
        width: 100%;
        margin-bottom: 64px;
      }
    `],
})
export class AdminComponent implements OnInit {
    constructor(
        private userStoreService: UserStoreService,
    ) { }

    ngOnInit(): void {
        this.userStoreService.loadAllManagers();
        this.userStoreService.loadAllTeachers();
    }

}