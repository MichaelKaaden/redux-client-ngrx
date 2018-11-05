import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Counter } from "../../models/counter";

import { CounterHeadingComponent } from "./counter-heading.component";

const BASE_VALUE = 30;

describe("CounterHeadingComponent", () => {
    let component: CounterHeadingComponent;
    let fixture: ComponentFixture<CounterHeadingComponent>;
    let compiled: any;
    let index;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CounterHeadingComponent],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        index = 12;

        fixture = TestBed.createComponent(CounterHeadingComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("initially, no index is set", () => {
        expect(component.counterIndex).toBeUndefined();
    });

    it("should use the correct index", () => {
        component.counterIndex = index;
        fixture.detectChanges();
        expect(component.counterIndex).toBe(index);
    });

    it("should display the index", () => {
        component.counterIndex = index;
        fixture.detectChanges();
        compiled = fixture.debugElement.nativeElement;
        const heading = compiled.querySelector("h3").textContent;
        expect(heading).toContain(`#${index}`);
    });

    it("should display the counter value", () => {
        component.counterIndex = index;
        component.counter = new Counter(index, BASE_VALUE + index);
        fixture.detectChanges();
        compiled = fixture.debugElement.nativeElement;
        const heading = compiled.querySelector("h3").textContent;
        expect(heading).toContain(`${BASE_VALUE + index}`);
    });
});
