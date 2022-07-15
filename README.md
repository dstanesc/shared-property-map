# Shared Property Map

Minimal [property tree]((https://github.com/microsoft/FluidFramework/tree/main/experimental/PropertyDDS) instantiation with data binding and distributed change notifications. Intended to simplify the testing of the [FluidFramework's](https://github.com/microsoft/FluidFramework) larger data use-cases.


## API

```ts
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
```

## Usage

```ts
import { SharedPropertyTree } from "@fluid-experimental/property-dds";
import { 
    initMap, 
    SharedPropertyMap, 
} from "@dstanesc/shared-property-map";

let sharedMap: SharedPropertyMap = await initMap(undefined, SharedPropertyTree, insertCallback, updateCallback, deleteCallback);

sharedMap.set('123', 'abc');
sharedMap.delete('123');
sharedMap.commit()
```

## Configure Fluid Service

Configure the Fluid service w/ environment variables `FLUID_MODE=frs|router|tiny`

If `frs` is opted for, set-up both `SECRET_FLUID_TENANT` and  `SECRET_FLUID_TOKEN` env. vars. (as configured in your azure service  - `Tenant Id` respectively `Primary key` )

Example

```
FLUID_MODE=frs
SECRET_FLUID_TOKEN=xyz
SECRET_FLUID_TENANT=xyz
```

## Build & Test

> Note: npm tests are pre-configured with the `FLUID_MODE=frs` setting (see `package.json`)

```
npm run clean
npm install
npm run build
npm run test
```


