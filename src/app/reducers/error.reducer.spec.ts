import * as errorActions from "../actions/error.actions";
import { ErrorsState, initialState, reducer } from "./error.reducer";

describe("Error Reducer", () => {
    describe("unknown action", () => {
        it("should return the initial state", () => {
            const action = {} as any;

            const result = reducer(initialState, action);

            expect(result).toBe(initialState);
        });
    });

    describe("error occurred", () => {
        it("should set the array to the new error", () => {
            const error = "Oops!";
            const action = errorActions.errorOccurred({ error });

            const result = reducer(initialState, action);

            expect(result.errors).toBeDefined();
            expect(result.errors.length).toBe(1);
            expect(result.errors[0]).toEqual(error);
        });

        it("should append new errors to the existing ones", () => {
            const prevError1 = "error1";
            const prevError2 = "error2";
            const state: ErrorsState = { errors: [prevError1, prevError2] };
            const error = "error3";
            const action = errorActions.errorOccurred({ error });

            const result = reducer(state, action);

            expect(result.errors).toBeDefined();
            expect(result.errors.length).toBe(3);
            expect(result.errors[0]).toEqual(prevError1);
            expect(result.errors[1]).toEqual(prevError2);
            expect(result.errors[2]).toEqual(error);
        });
    });

    describe("reset errors", () => {
        it("should reset the errors", () => {
            const prevError1 = "error1";
            const prevError2 = "error2";
            const state: ErrorsState = { errors: [prevError1, prevError2] };
            const action = errorActions.resetErrors();

            const result = reducer(state, action);

            expect(result.errors).toBeDefined();
            expect(result.errors.length).toBe(0);
        });

        it("should not do any harm to reset the counters if no errors are present", () => {
            const action = errorActions.resetErrors();

            const result = reducer(initialState, action);

            expect(result.errors).toBeDefined();
            expect(result.errors.length).toBe(0);
        });
    });
});
