import { provideHttpClient } from "@angular/common/http";
import { enableProdMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { provideEffects } from "@ngrx/effects";
import { provideState, provideStore } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
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
        CounterService,
        provideHttpClient(),
        provideAnimations(),
        provideRouter(routes),
        provideStore(reducers, {
            metaReducers,
            runtimeChecks: { strictStateImmutability: true, strictActionImmutability: true },
        }),
        provideState("errors", fromError.reducer),
        provideState("counters", fromCounter.reducer),
        provideEffects([CounterEffects]),
        provideStoreDevtools({
            maxAge: 25, // Retains last 25 states
            logOnly: environment.production, // Restrict extension to log-only mode
            connectInZone: true,
        }),
    ],
}).catch((err) => console.error(err));
