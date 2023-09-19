interface DataBaseProps {
    dbName: string;
    dbVersion: number;
    config: {
        table: string;
        key: string;
        index: string | string[];
        unique?: boolean;
    };
}
declare class IndexedSync {
    private dbName;
    private dbVersion;
    private tableName;
    private dataToSave;
    private config;
    constructor({ dbName, dbVersion, config }: DataBaseProps);
    private createDatabaseAndTable;
    useTable(tableName: string): IndexedSync;
    dados(data: [{}] | {}): IndexedSync;
    save(): void;
    getAll(callback: (result: any) => void): void;
    getById(key: string, callback: (result: any) => void): void;
    updateId(key: string, newData: object, callback: (result: any) => void): void;
    updateAll(newData: object): void;
    deleteDB(databaseName: string): void;
    saveImage(imageData: ArrayBuffer): void;
}
export default IndexedSync;
