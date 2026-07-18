import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from "@angular/core/testing";
import { Counter } from "../../models/counter";

import { CounterInputComponent } from "./counter-input.component";

const BASE_VALUE = 60;

describe("CounterInputComponent", () => {
    let component: CounterInputComponent;
    let fixture: ComponentFixture<CounterInputComponent>;
    let compiled: any;
    let index: number;
    let counter: Counter;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [CounterInputComponent],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        index = 21;
        counter = { index, value: BASE_VALUE + index };

        fixture = TestBed.createComponent(CounterInputComponent);
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

    it("should display the counter's value", () => {
        component.counterIndex = index;
        component.counter = counter;
        fixture.detectChanges();
        compiled = fixture.debugElement.nativeElement;
        const span = compiled.querySelector(".counter-value").textContent;
        expect(span).toContain(`${BASE_VALUE + index}`);
    });

    it("should emit decrement when the decrement button is clicked", fakeAsync(() => {
        const spy = jasmine.createSpy("decrement");
        component.decrement.subscribe(spy);
        fixture.detectChanges();

        compiled = fixture.debugElement.nativeElement;
        const button = compiled.querySelector(".decrementButton");
        button.click();
        flush();
        fixture.detectChanges();

        expect(spy).toHaveBeenCalledWith(1);
    }));

    it("should emit increment when the increment button is clicked", fakeAsync(() => {
        const spy = jasmine.createSpy("increment");
        component.increment.subscribe(spy);
        fixture.detectChanges();

        compiled = fixture.debugElement.nativeElement;
        const button = compiled.querySelector(".incrementButton");
        button.click();
        flush();
        fixture.detectChanges();

        expect(spy).toHaveBeenCalledWith(1);
    }));
});
