
import { SharedPropertyTree } from "@fluid-experimental/property-dds";
import { v4 as uuid } from "uuid"
import * as assert from 'assert';
import { initMap, SharedPropertyMap, DeleteCallback, UpdateCallback } from "../index";

describe("Local map test", function () {

    let sharedMap: SharedPropertyMap = undefined;

    let localModel: Map<string, string> = new Map<string, string>();

    const updateLocalModel: UpdateCallback = (key: string, value: string) => {
        console.log(`Updating local model ${key} -> ${value}`);
        localModel.set(key, value);
    }

    const deleteLocalModel: DeleteCallback = (key: string) => {
        console.log(`Deleting local model ${key}`);
        localModel.delete(key);
    }

    const publishData = async (data: Map<string, string>) => {
        sharedMap = await initMap(undefined, SharedPropertyTree, updateLocalModel, updateLocalModel, deleteLocalModel);
        console.log(`Initialize remote map w/ initMap("${sharedMap.mapId()}", SharedPropertyTree, updateLocalModel, updateLocalModel, deleteLocalModel) to collaborate`)
        sharedMap.insertMany(data);
        sharedMap.commit();
    }

    const deleteData = () => {
        for (const key of localModel.keys()) {
            sharedMap.delete(key);
        }
        sharedMap.commit();
    }

    const cleanUp = () => {
        localModel = new Map<string, string>();
    }

    const dispose = () => {
        console.log(`Disposing the distributed map "${sharedMap.mapId()}"`);
        sharedMap.dispose();
    }

    afterAll(() => {
        cleanUp();
        dispose();
    });

    test("Data publishing test", async () => {
        const data = new Map([[uuid(), "large & complex payload"]]);
        await publishData(data).then(() => {
            console.log(`Done publishing data`)
            sharedMap.forEach((value, key) => {
                console.log(`Reading entry ok "${key} => ${value}"`)
            });
            assert.equal(1, localModel.size)
        });
    });

    test("Data delete test", () => {
        const propertyTreeKeysBefore = sharedMap.keys();
        console.log(`Before delete, property tree keys ${JSON.stringify(propertyTreeKeysBefore)}`);
        assert.equal(1, propertyTreeKeysBefore.length);
        deleteData();
        const propertyTreeKeysAfter = sharedMap.keys();
        console.log(`After delete, property tree keys ${JSON.stringify(propertyTreeKeysAfter)}`);
        assert.equal(0, propertyTreeKeysAfter.length);
        console.log(`Done deleting data`)
        sharedMap.forEach((value, key) => {
            console.log(`This entry should not exist "${key} => ${value}"`)
        });
        assert.equal(0, localModel.size);
    });
});