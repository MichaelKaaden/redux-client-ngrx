import { CounterActions, CounterActionTypes } from "../actions/counter.actions";
import { Counter } from "../models/counter";

export interface CountersState {
    counters: Counter[];
}

export const initialState: CountersState = {
    counters: [],
};

export function reducer(state: CountersState = initialState, action: CounterActions): CountersState {
    let counter: Counter;
    let newCounter: Counter;
    let newCounters: Counter[] = [];

    switch (action.type) {
        case CounterActionTypes.LoadPending:
            /*
             * This is the only case where the counter does probably not yet exist.
             * It will be created and initialized with the counter and isLoading.
             */
            counter = state.counters.find((item) => item.index === action.payload.index);
            if (counter) {
                // another LoadPending action when the counter is already in the list means: do nothing.
                return state;
            }

            // copy the state
            newCounters = state.counters.map((item) => item);

            // add the counter with uninitialized value
            newCounter = { index: action.payload.index };
            newCounter.isLoading = true;
            newCounters.push(newCounter);

            // sort the state by counter index
            newCounters = newCounters.sort((a: Counter, b: Counter) => {
                return a.index - b.index;
            });

            // return the resulting state
            return {
                ...state,
                counters: newCounters,
            };

        case CounterActionTypes.LoadCompleted:
            newCounters = state.counters.map((item) => {
                if (item.index !== action.payload.index) {
                    // This isn't the item we care about - keep it as-is
                    return item;
                }

                // Otherwise, this is the one we want - return a new value
                return { index: action.payload.counter.index, value: action.payload.counter.value };
            });

            return {
                ...state,
                counters: newCounters,
            };

        case CounterActionTypes.LoadAllPending:
            return state;

        case CounterActionTypes.LoadAllCompleted:
            const countersToAdd: Counter[] = [];
            for (const c of action.payload.counters) {
                if (!state.counters.find((item) => item.index === c.index)) {
                    countersToAdd.push(c);
                }
            }

            // copy the state and add the recently loaded counters
            newCounters = state.counters.map((item) => item).concat(countersToAdd);

            // sort the state by counter index
            newCounters.sort((a: Counter, b: Counter) => {
                return a.index - b.index;
            });

            // return the resulting state
            return {
                ...state,
                counters: newCounters,
            };

        case CounterActionTypes.DecrementPending:
        case CounterActionTypes.IncrementPending:
            /*
             * Get the counter we're saving so we can use its old value until the new one
             * is retrieved from the server.
             */
            newCounters = state.counters.map((item) => {
                if (item.index !== action.payload.index) {
                    // This isn't the item we care about - keep it as-is
                    return item;
                }

                newCounter = { index: item.index, value: item.value };
                newCounter.isSaving = true;
                return newCounter;
            });

            return {
                ...state,
                counters: newCounters,
            };

        case CounterActionTypes.DecrementCompleted:
        case CounterActionTypes.IncrementCompleted:
            newCounters = state.counters.map((item) => {
                if (item.index !== action.payload.index) {
                    // This isn't the item we care about - keep it as-is
                    return item;
                }

                // Otherwise, this is the one we want - return an updated value resetting all flags
                return { index: action.payload.counter.index, value: action.payload.counter.value };
            });

            return {
                ...state,
                counters: newCounters,
            };

        default:
            return state;
    }
}

export const getCounters = (state: CountersState) => state.counters;
