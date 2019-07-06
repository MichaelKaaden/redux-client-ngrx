import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import * as errorActions from "../../actions/error.actions";
import { IAppState } from "../../reducers";
import { getErrors } from "../../selectors/errors.selectors";

@Component({
    selector: "mk-error",
    templateUrl: "./error.component.html",
    styleUrls: ["./error.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent implements OnInit {
    errors$: Observable<string[]>;

    constructor(private store: Store<IAppState>) {}

    ngOnInit(): void {
        this.errors$ = this.store.pipe(select(getErrors));
    }

    reset() {
        this.store.dispatch(errorActions.resetErrors());
    }
}
