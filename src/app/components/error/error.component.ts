import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
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
export class ErrorComponent implements OnInit {
    errors$: Observable<string[]>;

    constructor(private store: Store<IAppState>) {}

    ngOnInit(): void {
        this.errors$ = this.store.pipe(select(fromRoot.getErrors));
    }

    reset() {
        this.store.dispatch(new ResetErrors());
    }
}
