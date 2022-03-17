import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Counter } from "../models/counter";
import * as fromCounter from "../reducers/counter.reducer";

export const selectCountersState = createFeatureSelector<fromCounter.CountersState>("counters");
export const selectCounters = createSelector(selectCountersState, fromCounter.selectAll);
export const selectCounter = (index) => createSelector(selectCounters, (counters) => counters.find((counter) => counter.index === index));

export const selectNumOfCounters = createSelector(selectCountersState, fromCounter.selectTotal);

export const selectCounterSum = createSelector(selectCounters, (counters) =>
    counters.reduce((accumulator: number, current: Counter) => accumulator + (current.value ? current.value : 0), 0),
);
export const selectAverageSum = createSelector(selectNumOfCounters, selectCounterSum, (num, sum) =>
    num && num !== 0 ? Number.parseFloat((sum / num).toFixed(2)) : 0,
);
