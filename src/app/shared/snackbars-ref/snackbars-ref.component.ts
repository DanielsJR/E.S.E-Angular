import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { User } from '../../models/user';

@Component({
  selector: 'nx-snackbars-ref',
  templateUrl: './snackbars-ref.component.html',
  styleUrls: ['./snackbars-ref.component.css']
})
export class SnackbarsRefComponent implements OnInit {

  uriRole: any;
  user: User;
  type;
  message: string;

  constructor(public snackBarRef: MatSnackBarRef<SnackbarsRefComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any) {

    this.type = data.type;
    this.message = data.message;
    console.log('SnackBar*** message: ' + data.message + ' uriRol: ' + data.uriRole + ' type: ' + data.type);
  }

  ngOnInit() {
  }

  close() {
    this.snackBarRef.dismiss();
  }

}
