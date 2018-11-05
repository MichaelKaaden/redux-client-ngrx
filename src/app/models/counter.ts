export interface ICounter {
    index: number;
    value?: number;
    isLoading?: boolean;
    isSaving?: boolean;
}

export class Counter implements ICounter {
    public isLoading?: boolean;
    public isSaving?: boolean;

    constructor(public index: number, public value?: number) {}
}

export interface ICounterRaw {
    index: number;
    value: number;
}
