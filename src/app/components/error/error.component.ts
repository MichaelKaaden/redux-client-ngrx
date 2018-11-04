import { ChangeDetectionStrategy, Component } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { ResetErrors } from "../../actions/error.actions";
import * as fromRoot from "../../reducers";
import { IAppState } from "../../reducers";

@Component({
    selector: "mk-error",
    templateUrl: "./error.component.html",
    styleUrls: ["./error.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
    errors$: Observable<string[]>;

    constructor(private store: Store<IAppState>) {
        this.errors$ = this.store.pipe(select(fromRoot.getErrors));
    }

    reset() {
        this.store.dispatch(new ResetErrors());
    }
}
