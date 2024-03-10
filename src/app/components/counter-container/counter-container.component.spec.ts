import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { provideStore, Store } from "@ngrx/store";
import { CounterActions } from "../../actions";
import { Counter } from "../../models/counter";
import * as fromRoot from "../../reducers";
import { CounterContainerComponent } from "./counter-container.component";

describe("CounterContainerComponent", () => {
    const counterIndex = 0;
    const by = 1;

    let component: CounterContainerComponent;
    let fixture: ComponentFixture<CounterContainerComponent>;
    let store: Store;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [CounterContainerComponent],
            providers: [provideStore(fromRoot.reducers)],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        store = TestBed.inject(Store);
        spyOn(store, "dispatch").and.callThrough();

        fixture = TestBed.createComponent(CounterContainerComponent);
        component = fixture.componentInstance;
        component.counterIndex = counterIndex;

        fixture.detectChanges();
    });

    it("should be created", () => {
        expect(component).toBeTruthy();
    });

    it("should dispatch an action to load the counter when created", () => {
        const action = CounterActions.loadPending({ index: counterIndex });

        component.ngOnInit();

        expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it("should show the counter after the counter has been loaded", () => {
        const myCounter: Counter = { index: counterIndex, value: 1 };
        const action = CounterActions.loadCompleted({ index: counterIndex, counter: myCounter });
        store.dispatch(action);

        component.counter$.subscribe({
            next: (data) => {
                expect(data.index).toBe(myCounter.index);
                expect(data.value).toBe(myCounter.value);
            },
            error: (error) => {
                expect(error).toBeUndefined();
            },
        });
    });

    it("should dispatch an action to decrement the counter", () => {
        const action = CounterActions.decrementPending({ index: counterIndex, by });

        component.decrement(by);

        expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it("should show the decremented counter after the decrement action is dispatched", () => {
        const myCounter: Counter = { index: counterIndex, value: 42 };
        const action = CounterActions.decrementCompleted({ index: counterIndex, counter: myCounter });
        store.dispatch(action);

        component.counter$.subscribe((data) => {
            expect(data.index).toBe(myCounter.index);
            expect(data.value).toBe(myCounter.value);
        });
    });

    it("should dispatch an action to increment the counter", () => {
        const action = CounterActions.incrementPending({ index: counterIndex, by });

        component.increment(by);

        expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it("should show the incremented counter after the increment action is dispatched", () => {
        const myCounter: Counter = { index: counterIndex, value: 2 };
        const action = CounterActions.incrementCompleted({ index: counterIndex, counter: myCounter });
        store.dispatch(action);

        component.counter$.subscribe((data) => {
            expect(data.index).toBe(myCounter.index);
            expect(data.value).toBe(myCounter.value);
        });
    });
});
