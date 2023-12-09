import { HttpClientModule } from "@angular/common/http";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { EffectsModule } from "@ngrx/effects";
import { StoreRouterConnectingModule } from "@ngrx/router-store";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

import { environment } from "../environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./components/app/app.component";
import { CounterContainerComponent } from "./components/counter-container/counter-container.component";
import { CounterHeadingComponent } from "./components/counter-heading/counter-heading.component";
import { CounterInputComponent } from "./components/counter-input/counter-input.component";
import { CounterListComponent } from "./components/counter-list/counter-list.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { ErrorComponent } from "./components/error/error.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { ProgressComponent } from "./components/progress/progress.component";
import { CounterEffects } from "./effects/counter.effects";
import { MaterialModule } from "./material.module";
import { metaReducers, reducers } from "./reducers";
import * as fromCounter from "./reducers/counter.reducer";
import * as fromError from "./reducers/error.reducer";
import { CounterService } from "./services/counter.service";

@NgModule({
    declarations: [
        AppComponent,
        CounterListComponent,
        DashboardComponent,
        PageNotFoundComponent,
        ErrorComponent,
        CounterContainerComponent,
        ProgressComponent,
        CounterHeadingComponent,
        CounterInputComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MaterialModule,
        StoreModule.forRoot(reducers, { metaReducers, runtimeChecks: { strictStateImmutability: true, strictActionImmutability: true } }),
        !environment.production ? StoreDevtoolsModule.instrument({connectInZone: true}) : [],
        StoreModule.forFeature("errors", fromError.reducer),
        StoreModule.forFeature("counters", fromCounter.reducer),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([CounterEffects]),
        StoreRouterConnectingModule.forRoot(),
    ],
    providers: [CounterService],
    bootstrap: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
