import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { Action, createReducer, on } from "@ngrx/store";
import * as counterActions from "../actions/counter.actions";
import { Counter } from "../models/counter";

export const adapter = createEntityAdapter<Counter>({
    selectId: (counter) => counter.index,
    sortComparer: (counterA, counterB) => counterA.index - counterB.index,
});

export interface CountersState extends EntityState<Counter> {}

export const initialState: CountersState = adapter.getInitialState();

function incDecPending(action, state: CountersState) {
    return adapter.updateOne(
        {
            id: action.index,
            changes: {
                isSaving: true,
            },
        },
        state,
    );
}

function incDecCompleted(action, state: CountersState) {
    return adapter.updateOne(
        {
            id: action.index,
            changes: {
                value: action.counter.value,
                isSaving: false,
            },
        },
        state,
    );
}

const counterReducer = createReducer(
    initialState,
    on(counterActions.loadPending, (state, action) => adapter.addOne({ index: action.index, isLoading: true }, state)),
    on(counterActions.loadCompleted, (state, action) =>
        adapter.updateOne(
            {
                id: action.index,
                changes: {
                    value: action.counter.value,
                    isLoading: false,
                },
            },
            state,
        ),
    ),
    on(counterActions.loadAllPending, (state) => state),
    on(counterActions.loadAllCompleted, (state, action) => adapter.addMany(action.counters, state)),
    on(counterActions.decrementPending, (state, action) => incDecPending(action, state)),
    on(counterActions.incrementPending, (state, action) => incDecPending(action, state)),
    on(counterActions.decrementCompleted, (state, action) => incDecCompleted(action, state)),
    on(counterActions.incrementCompleted, (state, action) => incDecCompleted(action, state)),
);

export function reducer(state: CountersState = initialState, action: Action): CountersState {
    return counterReducer(state, action);
}

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
