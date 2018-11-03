import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CounterContainerComponent } from "./counter-container.component";

describe("CounterContainerComponent", () => {
    let component: CounterContainerComponent;
    let fixture: ComponentFixture<CounterContainerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CounterContainerComponent],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CounterContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
