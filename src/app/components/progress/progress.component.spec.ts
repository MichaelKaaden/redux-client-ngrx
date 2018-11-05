import { NO_ERRORS_SCHEMA, SimpleChange } from "@angular/core";
import { async, ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";

import { DEFAULT_DELAY, ProgressComponent } from "./progress.component";

describe("ProgressComponent", () => {
    let component: ProgressComponent;
    let fixture: ComponentFixture<ProgressComponent>;
    let compiled: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProgressComponent],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProgressComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should not show an animation if isLoading is false", () => {
        component.isLoading = false;
        fixture.detectChanges();
        expect(component.showProgress).toBeFalsy();

        compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector("mat-progress-spinner")).toBe(null);
    });

    it("should show an animation after DELAY if isLoading is true", fakeAsync(() => {
        component.isLoading = true;
        fixture.detectChanges();
        tick(DEFAULT_DELAY + 1); // wait for setTimeout()
        expect(component.showProgress).toBeTruthy();

        compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector("mat-progress-spinner")).toBeDefined();
    }));

    it("should reset showProgress as soon as isLoading is set to false", fakeAsync(() => {
        component.isLoading = true;
        fixture.detectChanges();
        tick(DEFAULT_DELAY + 1); // wait for setTimeout()
        expect(component.showProgress).toBeTruthy();
        compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector("mat-progress-spinner")).toBeDefined();

        component.isLoading = false;
        component.ngOnChanges({
            isLoading: new SimpleChange(true, component.isLoading, true),
        });
        fixture.detectChanges();
        expect(component.showProgress).toBeFalsy();
        compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector("mat-progress-spinner")).toBe(null);
    }));

    it("should respect an individual delay value", fakeAsync(() => {
        const delay = 500;
        component.delay = delay;
        component.isLoading = true;
        fixture.detectChanges();
        tick(delay - 1);
        expect(component.showProgress).toBeFalsy();
        tick(delay + 1);
        expect(component.showProgress).toBeTruthy();
    }));

    it("should show the progress during time travel debugging ", fakeAsync(() => {
        component.isLoading = false;
        component.ngOnChanges({
            isLoading: new SimpleChange(false, component.isLoading, false),
        });
        fixture.detectChanges();
        tick(DEFAULT_DELAY + 1);

        component.isLoading = true;
        component.ngOnChanges({
            isLoading: new SimpleChange(true, component.isLoading, true),
        });
        fixture.detectChanges();
        tick(DEFAULT_DELAY + 1);

        expect(component.showProgress).toBeTruthy();
    }));
});
