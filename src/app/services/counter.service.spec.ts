import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { getTestBed, TestBed, waitForAsync } from "@angular/core/testing";
import { environment } from "../../environments/environment";
import { Counter } from "../models/counter";

import { CounterService, IEnvelope } from "./counter.service";

describe("CounterService", () => {
    let injector: TestBed;
    let service: CounterService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CounterService],
        });

        injector = getTestBed();
        service = injector.inject(CounterService);
        httpMock = injector.inject(HttpTestingController);
    });

    afterEach(() => {
        // finally, assert that there are no outstanding requests
        httpMock.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should correctly retrieve a counter", waitForAsync(() => {
        const index = 0;
        const value = 42;
        const dummyEnvelope: IEnvelope = {
            message: "Okay",
            status: 200,
            data: {
                counter: { index, value },
            },
        };

        // make the HTTP request via the service
        service.counter(index).subscribe((counter: Counter) => {
            expect(counter.index).withContext("index doesn't match").toBe(index);
            expect(counter.value).withContext("value doesn't match").toBe(value);
            expect(counter).withContext("counter should be a copy").not.toBe(dummyEnvelope.data.counter);
        });

        // the request is pending, therefor expect that it sometimes happens
        const req = httpMock.expectOne(`${environment.apiServer}/counters/${index}`);
        expect(req.request.method).withContext("expect a GET request").toBe("GET");

        // fulfill the request by transmitting a response
        req.flush(dummyEnvelope);
    }));

    it("should deal with HTTP errors trying to retrieve a counter", waitForAsync(() => {
        const index = 0;

        // make the HTTP request via the service
        service.counter(index).subscribe({
            next: (counter: Counter) => {
                expect(counter).withContext("shouldn't run into this success case").toBeUndefined();
            },
            error: (error) => {
                expect(error).withContext("should receive an error").toBeDefined();
            },
        });

        // the request is pending, therefor expect that it sometimes happens
        const req = httpMock.expectOne(`${environment.apiServer}/counters/${index}`);
        expect(req.request.method).withContext("expect a GET request").toBe("GET");

        // fulfill the request by transmitting an error
        req.error(new ProgressEvent("some error"));
    }));

    it("should correctly retrieve all counters", waitForAsync(() => {
        const index0 = 0;
        const value0 = 42;
        const index1 = 1;
        const value1 = 4711;
        const dummyEnvelope: IEnvelope = {
            message: "Okay",
            status: 200,
            data: {
                counters: [
                    { index: index0, value: value0 },
                    { index: index1, value: value1 },
                ],
            },
        };

        // make the HTTP request via the service
        service.counters().subscribe((counters: Counter[]) => {
            expect(counters.length).withContext("length incorrect").toBe(2);

            expect(counters[0].index).withContext("first index doesn't match").toBe(index0);
            expect(counters[0].value).withContext("first value doesn't match").toBe(value0);
            expect(counters[0]).withContext("first counter should be a copy").not.toBe(dummyEnvelope.data.counters[0]);

            expect(counters[1].index).withContext("second index doesn't match").toBe(index1);
            expect(counters[1].value).withContext("second value doesn't match").toBe(value1);
            expect(counters[1]).withContext("second counter should be a copy").not.toBe(dummyEnvelope.data.counters[1]);
        });

        // the request is pending, therefor expect that it sometimes happens
        const req = httpMock.expectOne(`${environment.apiServer}/counters`);
        expect(req.request.method).withContext("expect a GET request").toBe("GET");

        // fulfill the request by transmitting a response
        req.flush(dummyEnvelope);
    }));

    it("should deal with HTTP errors trying to retrieve all counters", waitForAsync(() => {
        // make the HTTP request via the service
        service.counters().subscribe({
            next: (counters: Counter[]) => {
                expect(counters).withContext("shouldn't run into this success case").toBeUndefined();
            },
            error: (error) => {
                expect(error).withContext("should receive an error").toBeDefined();
            },
        });

        // the request is pending, therefor expect that it sometimes happens
        const req = httpMock.expectOne(`${environment.apiServer}/counters`);
        expect(req.request.method).withContext("expect a GET request").toBe("GET");

        // fulfill the request by transmitting an error
        req.error(new ProgressEvent("some error"));
    }));

    it("should correctly decrement a counter", waitForAsync(() => {
        const index = 0;
        const by = 1;
        const dummyEnvelope: IEnvelope = {
            message: "Okay",
            status: 200,
            data: {
                counter: { index, value: by },
            },
        };

        // make the HTTP request via the service
        service.decrementCounter(index, by).subscribe((counter: Counter) => {
            expect(counter.index).withContext("index doesn't match").toBe(index);
            expect(counter.value).withContext("value doesn't match").toBe(by);
            expect(counter).withContext("counter should be a copy").not.toBe(dummyEnvelope.data.counter);
        });

        // the request is pending, therefor expect that it sometimes happens
        const req = httpMock.expectOne(`${environment.apiServer}/counters/${index}/decrement`);
        expect(req.request.method).withContext("expect a PUT request").toBe("PUT");

        // fulfill the request by transmitting a response
        req.flush(dummyEnvelope);
    }));

    it("should deal with HTTP errors trying to decrement a counter", waitForAsync(() => {
        const index = 0;
        const by = 1;

        // make the HTTP request via the service
        service.decrementCounter(index, by).subscribe({
            next: (counter: Counter) => {
                expect(counter).withContext("shouldn't run into this success case").toBeUndefined();
            },
            error: (error) => {
                expect(error).withContext("should receive an error").toBeDefined();
            },
        });

        // the request is pending, therefor expect that it sometimes happens
        const req = httpMock.expectOne(`${environment.apiServer}/counters/${index}/decrement`);
        expect(req.request.method).withContext("expect a PUT request").toBe("PUT");

        // fulfill the request by transmitting an error
        req.error(new ProgressEvent("some error"));
    }));

    it("should correctly increment a counter", waitForAsync(() => {
        const index = 0;
        const by = 1;
        const dummyEnvelope: IEnvelope = {
            message: "Okay",
            status: 200,
            data: {
                counter: { index, value: by },
            },
        };

        // make the HTTP request via the service
        service.incrementCounter(index, by).subscribe((counter: Counter) => {
            expect(counter.index).withContext("index doesn't match").toBe(index);
            expect(counter.value).withContext("value doesn't match").toBe(by);
            expect(counter).withContext("counter should be a copy").not.toBe(dummyEnvelope.data.counter);
        });

        // the request is pending, therefor expect that it sometimes happens
        const req = httpMock.expectOne(`${environment.apiServer}/counters/${index}/increment`);
        expect(req.request.method).withContext("expect a PUT request").toBe("PUT");

        // fulfill the request by transmitting a response
        req.flush(dummyEnvelope);
    }));

    it("should deal with HTTP errors trying to increment a counter", waitForAsync(() => {
        const index = 0;
        const by = 1;

        // make the HTTP request via the service
        service.incrementCounter(index, by).subscribe({
            next: (counter: Counter) => {
                expect(counter).withContext("shouldn't run into this success case").toBeUndefined();
            },
            error: (error) => {
                expect(error).withContext("should receive an error").toBeDefined();
            },
        });

        // the request is pending, therefor expect that it sometimes happens
        const req = httpMock.expectOne(`${environment.apiServer}/counters/${index}/increment`);
        expect(req.request.method).withContext("expect a PUT request").toBe("PUT");

        // fulfill the request by transmitting an error
        req.error(new ProgressEvent("some error"));
    }));
});
