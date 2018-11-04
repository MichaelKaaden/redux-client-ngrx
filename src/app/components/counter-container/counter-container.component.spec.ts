import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Store, StoreModule } from "@ngrx/store";
import * as fromRoot from "../../reducers";
import { reducers } from "../../reducers";
import { CounterContainerComponent } from "./counter-container.component";

describe("CounterContainerComponent", () => {
    const counterIndex = 0;
    let component: CounterContainerComponent;
    let fixture: ComponentFixture<CounterContainerComponent>;
    let store: Store<fromRoot.IAppState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CounterContainerComponent],
            imports: [StoreModule.forRoot(reducers)],
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

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
