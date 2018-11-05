import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { StoreModule } from "@ngrx/store";
import { Observable } from "rxjs";
import { reducers } from "../reducers";
import { CounterService } from "../services/counter.service";

import { CounterEffects } from "./counter.effects";

describe("CounterEffects", () => {
    // tslint:disable-next-line:prefer-const
    let actions$: Observable<any>;
    let effects: CounterEffects;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot(reducers)],
            providers: [
                CounterEffects,
                provideMockActions(() => actions$),
                CounterService,
                // dependencies of CounterService, needed for instantiation
                // never used because of the spies, therefore may be an empty object
                {
                    provide: HttpClient,
                    useValue: {},
                },
            ],
        });

        effects = TestBed.get(CounterEffects);
    });

    it("should be created", () => {
        expect(effects).toBeTruthy();
    });
});
