export interface Counter {
    index: number;
    value?: number;
    isLoading?: boolean;
    isSaving?: boolean;
}

export interface CounterRaw {
    index: number;
    value: number;
}
