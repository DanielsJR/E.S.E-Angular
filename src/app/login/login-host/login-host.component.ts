import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IsLoadingService } from '../../services/isLoadingService.service';
import { Theme } from '../../shared/theme-picker/theme';
import { THEMESLIGHT } from '../../shared/theme-picker/themes';
import { ThemePickerComponent } from '../../shared/theme-picker/theme-picker.component';
import { SessionStorageService } from '../../services/session-storage.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'nx-login-host',
  templateUrl: './login-host.component.html',
  styleUrls: ['./login-host.component.css']
})

export class LoginHostComponent implements OnInit, OnDestroy {
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


}
