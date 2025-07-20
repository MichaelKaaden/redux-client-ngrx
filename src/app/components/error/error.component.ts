import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { ErrorActions } from "../../actions";
import { selectErrors } from "../../selectors/errors.selectors";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";
import { AsyncPipe } from "@angular/common";

@Component({
    selector: "mk-error",
    templateUrl: "./error.component.html",
    styleUrls: ["./error.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButton, MatIcon, AsyncPipe]
})
export class ErrorComponent implements OnInit {
    errors$: Observable<string[]>;

    constructor(private store: Store) {}

    ngOnInit(): void {
        this.errors$ = this.store.select(selectErrors);
    }

    reset() {
        this.store.dispatch(ErrorActions.resetErrors());
    }
}
