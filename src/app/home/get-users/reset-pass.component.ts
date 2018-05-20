import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'nx-reset-pass',
  template: ``,
  styles: []
})
export class ResetPassComponent implements OnInit {

  @Input()
  user:User;

  @Input()
  uriRole:string;


  constructor(private dialogService: DialogService) { }

  ngOnInit() {
  }

  openDialogResetPass(): void {
    let data = {
        user: this.user,
        uriRole: this.uriRole,
        type: 'resetPass'
    };

    let dialogRef = this.dialogService.openDialogResetPass(data);
    dialogRef.afterClosed().subscribe(result => {
        if (result === 'canceled') {
            console.log('canceled!');
        } else if (result === 'reseted') {
            console.log('reseted!');
        } else if (result === 'error') {
            console.log('error!');
        }
    });
}

}
