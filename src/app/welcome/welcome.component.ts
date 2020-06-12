import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Theme } from '../shared/theme-picker/theme';
import { IsLoadingService } from '../services/isLoadingService.service';
import { ThemePickerComponent } from '../shared/theme-picker/theme-picker.component';
import { SessionStorageService } from '../services/session-storage.service';
import { THEMESLIGHT } from '../shared/theme-picker/themes';
import { Subscription } from 'rxjs';


@Component({
  selector: 'nx-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;

  private defaultTheme: Theme = THEMESLIGHT[4]; //indigo-pink
  @ViewChild("theme") theme: ThemePickerComponent;
  initialTheme: Theme;
  teamPickerSubs: Subscription;

  constructor(private isLoadingService: IsLoadingService, private sessionStorage: SessionStorageService,) { }


  ngOnInit() {
    this.isLoadingService.isLoading$.subscribe(result => this.isLoading = result);

    this.teamPickerSubs = this.sessionStorage.isThemeInstalled$.subscribe(isThemeInstalled => {
      if (!isThemeInstalled) this.theme.installTheme(this.defaultTheme);
    })
  }

  ngOnDestroy(): void {
    this.teamPickerSubs.unsubscribe();
  }

  get year() {
    return new Date().getFullYear();
  }

}
