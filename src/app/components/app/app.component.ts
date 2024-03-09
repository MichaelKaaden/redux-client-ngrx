import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

@Component({
    selector: "mk-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    standalone: true,
    imports: [RouterLink, RouterLinkActive, RouterOutlet],
})
export class AppComponent {
    title = "Redux Demo Application";
}
