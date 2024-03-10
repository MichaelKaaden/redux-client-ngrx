import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { provideStore } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import * as fromRoot from "../../reducers";

import { CounterListComponent } from "./counter-list.component";

describe("CounterListComponent", () => {
    let component: CounterListComponent;
    let fixture: ComponentFixture<CounterListComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [CounterListComponent],
            providers: [provideMockStore(), provideStore(fromRoot.reducers)],
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
