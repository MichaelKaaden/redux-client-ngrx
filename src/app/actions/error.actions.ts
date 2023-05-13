import { createActionGroup, emptyProps, props } from "@ngrx/store";

export const ErrorActions = createActionGroup({
    source: "Error",
    events: {
        "Error Occurred": props<{ error: string }>(),
        "Reset Errors": emptyProps(),
    },
});
