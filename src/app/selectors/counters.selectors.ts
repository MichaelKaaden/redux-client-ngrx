import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Counter } from "../models/counter";
import * as fromCounter from "../reducers/counter.reducer";

export const selectCountersState = createFeatureSelector<fromCounter.CountersState>("counters");
export const getCounters = createSelector(
    selectCountersState,
    fromCounter.selectAll,
);
export const getCounter = createSelector(
    getCounters,
    (counters, props) => counters.find((counter) => counter.index === props.index),
);
export const getNumOfCounters = createSelector(
    selectCountersState,
    fromCounter.selectTotal,
);

export const getCounterSum = createSelector(
    getCounters,
    (counters) => counters.reduce((accumulator: number, current: Counter) => accumulator + (current.value ? current.value : 0), 0),
);
export const getAverageSum = createSelector(
    getNumOfCounters,
    getCounterSum,
    (num, sum) => (num && num !== 0 ? Number.parseFloat((sum / num).toFixed(2)) : 0),
);
