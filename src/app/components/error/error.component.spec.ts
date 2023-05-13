import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Store, StoreModule } from "@ngrx/store";
import { ErrorActions } from "../../actions";
import { reducers } from "../../reducers";

import { ErrorComponent } from "./error.component";

describe("ErrorComponent", () => {
    let component: ErrorComponent;
    let fixture: ComponentFixture<ErrorComponent>;
    let store: Store;
    let dispatchSpy;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ErrorComponent],
            imports: [StoreModule.forRoot(reducers)],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        store = TestBed.inject(Store);
        dispatchSpy = spyOn(store, "dispatch").and.callThrough();

        fixture = TestBed.createComponent(ErrorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should initially show no errors", () => {
        component.errors$.subscribe((data) => {
            expect(data.length).toBe(0);
        });
    });

    it("should show an error if its action is dispatched", () => {
        const error = "foo";
        const action = ErrorActions.errorOccurred({ error });
        store.dispatch(action);

        component.errors$.subscribe((data) => {
            expect(data.length).toBe(1);
            expect(data[0]).toEqual(error);
        });
    });

    it("should dispatch an action when reset() is called", () => {
        const action = ErrorActions.resetErrors();

        component.reset();

        expect(dispatchSpy).toHaveBeenCalledWith(action);
    });

    it("should reset the errors", () => {
        const error = "bar";
        const action = ErrorActions.errorOccurred({ error });
        store.dispatch(action);

        component.reset();

        component.errors$.subscribe((data) => {
            expect(data.length).toBe(0);
        });
    });
});
