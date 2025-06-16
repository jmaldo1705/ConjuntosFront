
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { provideToastr } from 'ngx-toastr';

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
  tablerPhone,
  tablerRocket,
  tablerBuildingStore,
  tablerNews,
  tablerArrowRight,
  tablerSparkles,
  tablerBrandFacebook,
  tablerBrandTwitter,
  tablerBrandInstagram,
  tablerBrandLinkedin
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
      timeOut: 4000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
      enableHtml: true,
      tapToDismiss: true,
      maxOpened: 5,
      autoDismiss: true,
      newestOnTop: true,
      toastClass: 'ngx-toastr',
      titleClass: 'toast-title',
      messageClass: 'toast-message'
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
      tablerPhone,
      tablerRocket,
      tablerBuildingStore,
      tablerNews,
      tablerArrowRight,
      tablerSparkles,
      tablerBrandFacebook,
      tablerBrandTwitter,
      tablerBrandInstagram,
      tablerBrandLinkedin
    })
  ]
};
