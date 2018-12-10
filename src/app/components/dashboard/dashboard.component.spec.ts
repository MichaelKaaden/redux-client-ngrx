import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Store, StoreModule } from "@ngrx/store";
import { LoadAllCompleted, LoadAllPending } from "../../actions/counter.actions";
import { Counter } from "../../models/counter";
import * as fromRoot from "../../reducers";
import { reducers } from "../../reducers";

import { DashboardComponent } from "./dashboard.component";

describe("DashboardComponent", () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;
    let store: Store<fromRoot.IAppState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DashboardComponent],
            imports: [StoreModule.forRoot(reducers)],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        store = TestBed.get(Store);
        spyOn(store, "dispatch").and.callThrough();

        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should dispatch an action to load the counter when created", () => {
        const action = new LoadAllPending();

        component.ngOnInit();

        expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it("should show the counter after the counter has been loaded", () => {
        const counters = [new Counter(0, 1), new Counter(1, 2)];
        const action = new LoadAllCompleted({ counters });
        store.dispatch(action);

        component.numOfCounters$.subscribe((num) => {
            expect(num).toBe(counters.length);
        });
    });
});
