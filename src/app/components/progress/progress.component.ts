import { ChangeDetectionStrategy, Component, effect, input, signal } from "@angular/core";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

export const DEFAULT_DELAY = 250;

@Component({
    selector: "mk-progress",
    templateUrl: "./progress.component.html",
    styleUrls: ["./progress.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner],
})
export class ProgressComponent {
    delay = input(DEFAULT_DELAY);
    diameter = input(40);
    isLoading = input.required<boolean>();

    public showProgress = signal(false);

    constructor() {
        effect((onCleanup) => {
            if (!this.isLoading()) {
                this.showProgress.set(false);
                return;
            }

            const timer = setTimeout(() => this.showProgress.set(true), this.delay());
            onCleanup(() => clearTimeout(timer));
        });
    }
}
