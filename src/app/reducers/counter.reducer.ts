import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { CounterActions, CounterActionTypes } from "../actions/counter.actions";
import { Counter } from "../models/counter";

export const adapter = createEntityAdapter<Counter>({
    selectId: (counter) => counter.index,
    sortComparer: (counterA, counterB) => counterA.index - counterB.index,
});

export interface CountersState extends EntityState<Counter> {}

export const initialState: CountersState = adapter.getInitialState();

export function reducer(state: CountersState = initialState, action: CounterActions): CountersState {
    switch (action.type) {
        case CounterActionTypes.LoadPending:
            return adapter.addOne({ index: action.payload.index, isLoading: true }, state);

        case CounterActionTypes.LoadCompleted:
            return adapter.updateOne(
                {
                    id: action.payload.index,
                    changes: {
                        value: action.payload.counter.value,
                        isLoading: false,
                    },
                },
                state,
            );

        case CounterActionTypes.LoadAllPending:
            return state;

        case CounterActionTypes.LoadAllCompleted:
            return adapter.addMany(action.payload.counters, state);

        case CounterActionTypes.DecrementPending:
        case CounterActionTypes.IncrementPending:
            return adapter.updateOne(
                {
                    id: action.payload.index,
                    changes: {
                        isSaving: true,
                    },
                },
                state,
            );

        case CounterActionTypes.DecrementCompleted:
        case CounterActionTypes.IncrementCompleted:
            return adapter.updateOne(
                {
                    id: action.payload.index,
                    changes: {
                        value: action.payload.counter.value,
                        isSaving: false,
                    },
                },
                state,
            );

        default:
            return state;
    }
}

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
