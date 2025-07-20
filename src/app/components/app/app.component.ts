import { Component } from "@angular/core";
import { MatTabLink, MatTabNav, MatTabNavPanel } from "@angular/material/tabs";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

@Component({
    selector: "mk-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    imports: [RouterLink, RouterLinkActive, RouterOutlet, MatTabNav, MatTabLink, MatTabNavPanel]
})
export class AppComponent {
    title = "Redux Demo Application";
}
