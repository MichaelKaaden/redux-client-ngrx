import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CounterListComponent } from "./components/counter-list/counter-list.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";

const routes: Routes = [
    { path: "counters", component: CounterListComponent },
    { path: "dashboard", component: DashboardComponent },
    { path: "", redirectTo: "/counters", pathMatch: "full" },
    { path: "**", component: PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
