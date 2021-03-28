import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Store, StoreModule } from "@ngrx/store";
import * as counterActions from "../../actions/counter.actions";
import { Counter } from "../../models/counter";
import * as fromRoot from "../../reducers";
import { CounterContainerComponent } from "./counter-container.component";

describe("CounterContainerComponent", () => {
    const counterIndex = 0;
    const by = 1;

    let component: CounterContainerComponent;
    let fixture: ComponentFixture<CounterContainerComponent>;
    let store: Store<fromRoot.IAppState>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CounterContainerComponent],
            imports: [StoreModule.forRoot(fromRoot.reducers)],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        store = TestBed.get(Store);
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
        const action = counterActions.loadPending({ index: counterIndex });

        component.ngOnInit();

        expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it("should show the counter after the counter has been loaded", () => {
        const myCounter: Counter = { index: counterIndex, value: 1 };
        const action = counterActions.loadCompleted({ index: counterIndex, counter: myCounter });
        store.dispatch(action);

        component.counter$.subscribe(
            (data) => {
                expect(data.index).toBe(myCounter.index);
                expect(data.value).toBe(myCounter.value);
            },
            (error) => {
                expect(error).toBeUndefined();
            },
        );
    });

    it("should dispatch an action to decrement the counter", () => {
        const action = counterActions.decrementPending({ index: counterIndex, by });

        component.decrement(by);

        expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it("should show the decremented counter after the decrement action is dispatched", () => {
        const myCounter: Counter = { index: counterIndex, value: 42 };
        const action = counterActions.decrementCompleted({ index: counterIndex, counter: myCounter });
        store.dispatch(action);

        component.counter$.subscribe((data) => {
            expect(data.index).toBe(myCounter.index);
            expect(data.value).toBe(myCounter.value);
        });
    });

    it("should dispatch an action to increment the counter", () => {
        const action = counterActions.incrementPending({ index: counterIndex, by });

        component.increment(by);

        expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it("should show the incremented counter after the increment action is dispatched", () => {
        const myCounter: Counter = { index: counterIndex, value: 2 };
        const action = counterActions.incrementCompleted({ index: counterIndex, counter: myCounter });
        store.dispatch(action);

        component.counter$.subscribe((data) => {
            expect(data.index).toBe(myCounter.index);
            expect(data.value).toBe(myCounter.value);
        });
    });
});
