import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Counter } from "../models/counter";

export const CounterActions = createActionGroup({
    source: "Counter",
    events: {
        "Load Pending": props<{ index: number }>(),
        "Load Completed": props<{ index: number; counter: Counter }>(),
        "Load All Pending": emptyProps(),
        "Load All Completed": props<{ counters: Counter[] }>(),
        "Decrement Pending": props<{ index: number; by: number }>(),
        "Decrement Completed": props<{ index: number; counter: Counter }>(),
        "Increment Pending": props<{ index: number; by: number }>(),
        "Increment Completed": props<{ index: number; counter: Counter }>(),
    },
});
