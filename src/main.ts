import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { enableProdMode, importProvidersFrom } from "@angular/core";
import { bootstrapApplication, BrowserModule } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { EffectsModule } from "@ngrx/effects";
import { StoreRouterConnectingModule } from "@ngrx/router-store";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { routes } from "./app/app-routing";
import { AppComponent } from "./app/components/app/app.component";
import { CounterEffects } from "./app/effects/counter.effects";
import { metaReducers, reducers } from "./app/reducers";
import * as fromCounter from "./app/reducers/counter.reducer";
import * as fromError from "./app/reducers/error.reducer";
import { CounterService } from "./app/services/counter.service";

import { environment } from "./environments/environment";

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            BrowserModule,
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
        provideRouter(routes),
    ],
}).catch((err) => console.error(err));
