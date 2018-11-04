import { CounterActions, CounterActionTypes } from "../actions/counter.actions";
import { Counter, ICounter } from "../models/counter";

export interface State {
    counters: ICounter[];
}

export const initialState: State = {
    counters: [],
};

export function reducer(state = initialState, action: CounterActions): State {
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

        default:
            return state;
    }
}

export const getCounters = (state: State) => state.counters;
