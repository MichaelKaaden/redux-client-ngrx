import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { Counter } from "../../models/counter";

import { CounterInputComponent } from "./counter-input.component";

const BASE_VALUE = 60;

describe("CounterInputComponent", () => {
    let component: CounterInputComponent;
    let fixture: ComponentFixture<CounterInputComponent>;
    let compiled: any;
    let index;
    let counter: Counter;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CounterInputComponent],
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

    it("should abort without loadFunc", () => {
        component.counterIndex = index;
        expect(fixture.detectChanges).toThrow();
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
        const span = compiled.querySelector("span").textContent;
        expect(span).toContain(`${BASE_VALUE + index}`);
    });

    it("should use the bound decrement function", fakeAsync(() => {
        const foo = {
            decrement: (by: number): void => {},
        };

        spyOn(foo, "decrement").and.callThrough();
        component.decrementFunc = foo.decrement;
        fixture.detectChanges();

        compiled = fixture.debugElement.nativeElement;
        const button = compiled.querySelector(".decrementButton");
        button.click();
        tick();
        fixture.detectChanges();

        expect(foo.decrement).toHaveBeenCalledWith(1);
    }));

    it("should use the bound increment function", fakeAsync(() => {
        const foo = {
            increment: (by: number): void => {},
        };

        spyOn(foo, "increment").and.callThrough();
        component.incrementFunc = foo.increment;
        fixture.detectChanges();

        compiled = fixture.debugElement.nativeElement;
        const button = compiled.querySelector(".incrementButton");
        button.click();
        tick();
        fixture.detectChanges();

        expect(foo.increment).toHaveBeenCalledWith(1);
    }));
});
