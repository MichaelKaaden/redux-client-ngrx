export interface Counter {
    index: number;
    value?: number;
    isLoading?: boolean;
    isSaving?: boolean;
    error?: string;
}

export interface CounterRaw {
    index: number;
    value: number;
}
