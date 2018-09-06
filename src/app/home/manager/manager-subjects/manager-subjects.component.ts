import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '../../../../../node_modules/@angular/material/sort';
import { MatPaginator } from '../../../../../node_modules/@angular/material/paginator';
import { DomSanitizer } from '../../../../../node_modules/@angular/platform-browser';
import { SessionStorageService } from '../../../services/session-storage.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'nx-manager-subjects',
  templateUrl: './manager-subjects.component.html',
  styleUrls: ['./manager-subjects.component.css']
})
export class ManagerSubjectsComponent implements OnInit {

      // mat table
      displayedColumns = ['subjectName', 'crud'];
      dataSource;
      @ViewChild(MatSort) sort: MatSort;
      @ViewChild(MatPaginator) paginator: MatPaginator;
      pageSize = 20;
      pageSizeOptions = [5, 10, 20];

  constructor(private sessionStorage: SessionStorageService,
    private snackbarService: SnackbarService, public sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

}
