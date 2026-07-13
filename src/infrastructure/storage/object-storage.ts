export interface StoredObject {
  key: string;
  size: number;
  mimeType: string;
  visibility: "private";
}

export interface ObjectStorage {
  put(input: {
    key: string;
    bytes: Uint8Array;
    mimeType: string;
  }): Promise<StoredObject>;
  createAuthorizedDownload(input: {
    key: string;
    expiresInSeconds: number;
  }): Promise<string>;
  remove(key: string): Promise<void>;
}

export class UnavailableObjectStorage implements ObjectStorage {
  private unavailable(): never {
    throw new Error(
      "Object storage is not configured. No file was uploaded or deleted.",
    );
  }
  put(): Promise<StoredObject> {
    return Promise.reject(this.unavailable());
  }
  createAuthorizedDownload(): Promise<string> {
    return Promise.reject(this.unavailable());
  }
  remove(): Promise<void> {
    return Promise.reject(this.unavailable());
  }
}
