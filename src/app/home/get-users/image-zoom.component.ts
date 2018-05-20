import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'nx-image-zoom',
  template: ``,
  styles: []
})
export class ImageZoomComponent implements OnInit {

  @Input()
  user: User;

  @Input()
  uriRole: string;


  constructor(private dialogService: DialogService) { }

  ngOnInit() {
  }

  openDialogImage(): void {
    let data = {
        user: this.user,
        uriRole: this.uriRole,
        type: 'imageZoom'
    };

    let dialogRef = this.dialogService.openDialogImage(data);
    dialogRef.afterClosed().subscribe(result => {
        if (result === 'canceled') {
            console.log('canceled!');
        }
    });
}

}
