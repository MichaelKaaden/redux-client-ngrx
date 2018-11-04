import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { combineReducers, Store, StoreModule } from "@ngrx/store";

import * as fromRoot from "../../reducers";
import * as fromCounter from "../../reducers/counter.reducer";
import { CounterContainerComponent } from "./counter-container.component";

describe("CounterContainerComponent", () => {
    let component: CounterContainerComponent;
    let fixture: ComponentFixture<CounterContainerComponent>;
    let store: Store<fromRoot.IAppState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CounterContainerComponent],
            imports: [
                StoreModule.forRoot({
                    counters: combineReducers(fromCounter.reducer),
                }),
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        store = TestBed.get(Store);
        spyOn(store, "dispatch").and.callThrough();

        fixture = TestBed.createComponent(CounterContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit("should create", () => {
        expect(component).toBeTruthy();
    });
});
