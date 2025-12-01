import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from "@angular/core";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

export const DEFAULT_DELAY = 250;

@Component({
    selector: "mk-progress",
    templateUrl: "./progress.component.html",
    styleUrls: ["./progress.component.css"],
    changeDetection: ChangeDetectionStrategy.Default,
    imports: [MatProgressSpinner],
})
export class ProgressComponent implements OnInit, OnChanges, OnDestroy {
    private ref = inject(ChangeDetectorRef);
    private delayTimer: NodeJS.Timeout;

    @Input()
    delay = DEFAULT_DELAY;
    @Input()
    diameter = 40;
    @Input({ required: true })
    isLoading: boolean;

    public showProgress = false;

    ngOnInit() {
        this.showProgressAfterDelay();
    }

    ngOnDestroy() {
        if (this.delayTimer) {
            clearTimeout(this.delayTimer);
        }
    }

    private showProgressAfterDelay() {
        if (this.delayTimer) {
            clearTimeout(this.delayTimer);
        }

        this.delayTimer = setTimeout(() => {
            if (this.isLoading) {
                // console.log(`${this.delay}ms passed, showing progress...`);
                this.showProgress = true;
                this.ref.detectChanges();
            }
        }, this.delay);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.isLoading.previousValue === true) {
            // console.log(`disabling progress.`);
            if (this.delayTimer) {
                clearTimeout(this.delayTimer);
                this.delayTimer = null;
            }
            this.showProgress = false;
            this.ref.detectChanges();
        }

        if (changes.isLoading.currentValue === true) {
            this.showProgressAfterDelay();
        }
    }
}
