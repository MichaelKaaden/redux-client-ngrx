import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
    selector: "mk-page-not-found",
    templateUrl: "./page-not-found.component.html",
    styleUrls: ["./page-not-found.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink],
})
export class PageNotFoundComponent {}
