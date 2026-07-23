import { initialState } from "../reducers/error.reducer";
import { selectErrors, selectErrorsState } from "./errors.selectors";

describe("errors selectors", () => {
    describe("selectErrorsState", () => {
        it("should select the errors state", () => {
            expect(selectErrorsState.projector(initialState).errors).toEqual([]);
            expect(selectErrorsState.projector({ errors: ["foo"] })).toEqual({ errors: ["foo"] });
            expect(selectErrorsState.projector({ errors: ["foo", "bar"] })).toEqual({ errors: ["foo", "bar"] });
        });
    });

    describe("getErrors", () => {
        it("should select errors", () => {
            expect(selectErrors.projector(initialState).length).toBe(0);
            expect(selectErrors.projector({ errors: ["foo"] }).length).toBe(1);
            expect(selectErrors.projector({ errors: ["foo", "bar"] }).length).toBe(2);
        });
    });
});
