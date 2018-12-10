import { CounterActions, CounterActionTypes } from "../actions/counter.actions";
import { Counter, ICounter } from "../models/counter";

export interface CountersState {
    counters: ICounter[];
}

export const initialState: CountersState = {
    counters: [],
};

export function reducer(state: CountersState = initialState, action: CounterActions): CountersState {
    let counter: ICounter;
    let newCounter: ICounter;
    let newCounters: ICounter[] = [];

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
            newCounter = new Counter(action.payload.index);
            newCounter.isLoading = true;
            newCounters.push(newCounter);

            // sort the state by counter index
            newCounters = newCounters.sort((a: ICounter, b: ICounter) => {
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
                return new Counter(action.payload.counter.index, action.payload.counter.value);
            });

            return {
                ...state,
                counters: newCounters,
            };

        case CounterActionTypes.LoadAllPending:
            return state;

        case CounterActionTypes.LoadAllCompleted:
            const countersToAdd: ICounter[] = [];
            for (const c of action.payload.counters) {
                if (!state.counters.find((item) => item.index === c.index)) {
                    countersToAdd.push(c);
                }
            }

            // copy the state and add the recently loaded counters
            newCounters = state.counters.map((item) => item).concat(countersToAdd);

            // sort the state by counter index
            newCounters.sort((a: ICounter, b: ICounter) => {
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

                newCounter = new Counter(item.index, item.value);
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
                return new Counter(action.payload.counter.index, action.payload.counter.value);
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
