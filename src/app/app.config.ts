import { ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { provideIcons } from '@ng-icons/core';
import {
  tablerCheck,
  tablerLock,
  tablerSearch,
  tablerClock,
  tablerMapPin,
  tablerEye,
  tablerCalendarPlus,
  tablerX,
  tablerCalendar,
  tablerUsers,
  tablerPool,
  tablerBarbell,
  tablerMovie,
  tablerMoodSmile,
  tablerBallFootball,
  tablerBallBasketball,
  tablerGrill,
  tablerFlame,
  tablerTrash,
  tablerShield,
  tablerBuilding,
  tablerCreditCard,
  tablerTool,
  tablerHome,
  tablerBell,
  tablerChartBar,
  tablerStar,
  tablerDeviceMobile,
  tablerUserCheck,
  tablerFileText,
  tablerMail,
  tablerHeadphones,
  tablerChevronDown,
  tablerLogin,
  tablerPhone
} from '@ng-icons/tabler-icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true
    }),
    importProvidersFrom(ReactiveFormsModule),
    provideIcons({
      tablerCheck,
      tablerLock,
      tablerSearch,
      tablerClock,
      tablerMapPin,
      tablerEye,
      tablerCalendarPlus,
      tablerX,
      tablerCalendar,
      tablerUsers,
      tablerPool,
      tablerBarbell,
      tablerMovie,
      tablerMoodSmile,
      tablerBallFootball,
      tablerBallBasketball,
      tablerGrill,
      tablerFlame,
      tablerTrash,
      tablerShield,
      tablerBuilding,
      tablerCreditCard,
      tablerTool,
      tablerHome,
      tablerBell,
      tablerChartBar,
      tablerStar,
      tablerDeviceMobile,
      tablerUserCheck,
      tablerFileText,
      tablerMail,
      tablerHeadphones,
      tablerChevronDown,
      tablerLogin,
      tablerPhone
    })
  ]
};
