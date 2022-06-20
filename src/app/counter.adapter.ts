import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createAdapter, createSelectors } from "@state-adapt/core";
import { Counter } from "./models/counter";

const counterEntityAdapter = createEntityAdapter<Counter>({
    selectId: (counter) => counter.index,
    sortComparer: (counterA, counterB) => counterA.index - counterB.index,
});

const entitySelectors = counterEntityAdapter.getSelectors();

export interface CountersState extends EntityState<Counter> {
    error: string;
}
export const countersInitialState = counterEntityAdapter.getInitialState();

const selectors = createSelectors<CountersState>()(
    {
        numOfCounters: (s) => entitySelectors.selectTotal(s),
        all: (s) => entitySelectors.selectAll(s),
    },
    {
        counterSum: (s) => s.all.reduce((accumulator: number, current: Counter) => accumulator + (current.value ? current.value : 0), 0),
        errors: (s) => s.all.map(({ error }) => error).filter((e) => !!e),
    },
    {
        average: ({ numOfCounters: num, counterSum: sum }) => (num && num !== 0 ? Number.parseFloat((sum / num).toFixed(2)) : 0),
    },
);

export const counterAdapter = createAdapter<CountersState>()({
    awaitCounter: (state, id: number) => {
        return counterEntityAdapter.updateOne({ id, changes: { isLoading: true } }, state);
    },
    receiveCounter: (state, { index: id, value }: Counter) =>
        counterEntityAdapter.updateOne({ id, changes: { value, isLoading: false } }, state),
    setCounterError: (state, [error, id]: [string, number]) =>
        counterEntityAdapter.updateOne({ id, changes: { isLoading: false, error } }, state),
    receiveAll: (state, counters: Counter[]) => counterEntityAdapter.addMany(counters, state),
    setError: (state, error: string) => ({ ...state, error }),
    awaitUpdate: (state, [id]: number[]) => counterEntityAdapter.updateOne({ id, changes: { isSaving: true } }, state),
    receiveUpdate: (state, { index: id, value }: Counter) =>
        counterEntityAdapter.updateOne({ id, changes: { value, isSaving: false } }, state),
    resetErrors: (state) =>
        counterEntityAdapter.updateMany(
            state.ids.map((id) => ({ id, changes: { error: "" } })),
            state,
        ),
    selectors,
});
