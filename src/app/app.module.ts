import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./components/app/app.component";
import { CounterContainerComponent } from "./components/counter-container/counter-container.component";
import { CounterListComponent } from "./components/counter-list/counter-list.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { ErrorComponent } from "./components/error/error.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { MaterialModule } from "./material.module";

@NgModule({
    declarations: [
        AppComponent,
        CounterListComponent,
        DashboardComponent,
        PageNotFoundComponent,
        ErrorComponent,
        CounterContainerComponent,
    ],
    imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, MaterialModule, FlexLayoutModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
