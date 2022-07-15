
/*
 * Map like interface
 */
export interface SharedPropertyMap {
    //basic functions
    delete(key: string): void;
    forEach(callbackfn: (value: string, key: string) => void): void;
    get(key: string): string | undefined;
    has(key: string): boolean;
    set(key: string, value: string): this;
    keys(): string[];
    // enhanced semantics, call fails if the key exists
    insert(key: string, value: string): this;
    // bulk variants for efficiency
    insertMany(map: Map<string, string>): this;
    updateMany(map: Map<string, string>): this;
    deleteMany(keys: string[]): void;
    // map identity to enable distributed / collaborative editing
    mapId(): string;
    // make changes visible to remote peers
    commit(): void;
    // container life-cycle
    dispose(): void;
}

/*
 * Insert & update notification signature
 */
export interface UpdateCallback {
    (name: string, payload: string) : void
}

/*
 * Delete notification signature
 */
export interface DeleteCallback {
    (name: string) : void
}