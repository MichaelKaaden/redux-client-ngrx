import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { ErrorActions } from "../../actions";
import { selectErrors } from "../../selectors/errors.selectors";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";

@Component({
    selector: "mk-error",
    templateUrl: "./error.component.html",
    styleUrls: ["./error.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButton, MatIcon],
})
export class ErrorComponent {
    private store = inject(Store);

    errors = this.store.selectSignal(selectErrors);

    reset() {
        this.store.dispatch(ErrorActions.resetErrors());
    }
}
