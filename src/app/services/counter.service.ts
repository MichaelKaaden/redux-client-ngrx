import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, delay, map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Counter, CounterRaw } from "../models/counter";

export interface IEnvelope<T> {
    data: T;
    message: string;
    status: number;
}

@Injectable({ providedIn: "root" })
export class CounterService {
    private http = inject(HttpClient);

    private readonly API_HOME = ""; // one would use /restApi/v3 here, for example
    private readonly BASE_URL: string = environment.apiServer + this.API_HOME;
    private readonly DELAY = 0;

    /**
     * Get a counter.
     *
     * @param index The counter's index
     */
    public counter(index: number): Observable<Counter> {
        return this.http.get<IEnvelope<{ counter: CounterRaw }>>(`${this.BASE_URL}/counters/${index}`).pipe(
            delay(this.DELAY),
            map((result: IEnvelope<{ counter: CounterRaw }>) => {
                return { index: result.data.counter.index, value: result.data.counter.value };
            }),
            catchError(this.errorHandler),
        );
    }

    /**
     * Get all counters.
     */
    public counters(): Observable<Counter[]> {
        return this.http.get<IEnvelope<{ counters: CounterRaw[] }>>(`${this.BASE_URL}/counters`).pipe(
            delay(this.DELAY),
            map((result: IEnvelope<{ counters: CounterRaw[] }>) => this.rawCountersToCounters(result.data.counters)),
            catchError(this.errorHandler),
        );
    }

    /**
     * Decrements a counter's value on the API server.
     *
     * @param index The counter's index
     * @param by The value by which the counter is decremented
     */
    public decrementCounter(index: number, by: number): Observable<Counter> {
        return this.http.put<IEnvelope<{ counter: CounterRaw }>>(`${this.BASE_URL}/counters/${index}/decrement`, { by }).pipe(
            delay(this.DELAY),
            map((result: IEnvelope<{ counter: CounterRaw }>) => {
                return { index: result.data.counter.index, value: result.data.counter.value };
            }),
            catchError(this.errorHandler),
        );
    }

    /**
     * Increments a counter's value on the API server.
     *
     * @param index The counter's index
     * @param by The value by which the counter is incremented
     */
    public incrementCounter(index: number, by: number): Observable<Counter> {
        return this.http.put<IEnvelope<{ counter: CounterRaw }>>(`${this.BASE_URL}/counters/${index}/increment`, { by }).pipe(
            delay(this.DELAY),
            map((result: IEnvelope<{ counter: CounterRaw }>) => {
                return { index: result.data.counter.index, value: result.data.counter.value };
            }),
            catchError(this.errorHandler),
        );
    }

    /**
     * Handle HTTP errors.
     *
     * @param error The error
     */
    private errorHandler(error: { message: string }): Observable<never> {
        return throwError(() => error.message);
    }

    /**
     * Convert conters as returned by the API into Counter instances.
     *
     * @param rawCounters Counters as returned from the API
     */
    private rawCountersToCounters(rawCounters: CounterRaw[]): Counter[] {
        const counters: Counter[] = [];
        for (const rc of rawCounters) {
            counters.push({ index: rc.index, value: rc.value });
        }
        return counters;
    }
}
