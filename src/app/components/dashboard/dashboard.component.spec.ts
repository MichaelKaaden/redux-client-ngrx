import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Store, StoreModule } from "@ngrx/store";
import * as counterActions from "../../actions/counter.actions";
import * as fromRoot from "../../reducers";
import { reducers } from "../../reducers";

import { DashboardComponent } from "./dashboard.component";

describe("DashboardComponent", () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;
    let store: Store<fromRoot.IAppState>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [DashboardComponent],
                imports: [StoreModule.forRoot(reducers)],
                schemas: [NO_ERRORS_SCHEMA],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        store = TestBed.inject(Store);
        spyOn(store, "dispatch").and.callThrough();

        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should dispatch an action to load the counter when created", () => {
        const action = counterActions.loadAllPending();

        component.ngOnInit();

        expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it("should show the counter after the counter has been loaded", () => {
        const counters = [
            { index: 0, value: 1 },
            { index: 1, value: 2 },
        ];
        const action = counterActions.loadAllCompleted({ counters });
        store.dispatch(action);

        component.numOfCounters$.subscribe((num) => {
            expect(num).toBe(counters.length);
        });
    });
});
