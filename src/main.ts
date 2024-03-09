import { enableProdMode, importProvidersFrom } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { environment } from "./environments/environment";
import { AppComponent } from "./app/components/app/app.component";
import { StoreRouterConnectingModule } from "@ngrx/router-store";
import { CounterEffects } from "./app/effects/counter.effects";
import { EffectsModule } from "@ngrx/effects";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { reducers, metaReducers } from "./app/reducers";
import { StoreModule } from "@ngrx/store";
import { provideAnimations } from "@angular/platform-browser/animations";
import { withInterceptorsFromDi, provideHttpClient } from "@angular/common/http";
import { AppRoutingModule } from "./app/app-routing.module";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { CounterService } from "./app/services/counter.service";

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            BrowserModule,
            AppRoutingModule,
            StoreModule.forRoot(reducers, {
                metaReducers,
                runtimeChecks: { strictStateImmutability: true, strictActionImmutability: true },
            }),
            !environment.production ? StoreDevtoolsModule.instrument({ connectInZone: true }) : [],
            StoreModule.forFeature("errors", fromError.reducer),
            StoreModule.forFeature("counters", fromCounter.reducer),
            EffectsModule.forRoot([]),
            EffectsModule.forFeature([CounterEffects]),
            StoreRouterConnectingModule.forRoot(),
        ),
        CounterService,
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
    ],
}).catch((err) => console.error(err));
