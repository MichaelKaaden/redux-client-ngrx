import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CounterListComponent } from "./counter-list.component";

describe("CounterListComponent", () => {
    let component: CounterListComponent;
    let fixture: ComponentFixture<CounterListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CounterListComponent],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CounterListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should contain counters", () => {
        const compiled = fixture.debugElement.nativeElement;
        const counters = compiled.querySelectorAll("mk-counter-container");
        expect(counters.length).toBe(component.numOfCounters);
    });
});
