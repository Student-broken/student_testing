import type { MBSData } from './types';

export interface StorageAdapter {
    loadData(): Promise<MBSData | null>;
    saveData(data: MBSData): Promise<void>;
}

export class LocalStorageAdapter implements StorageAdapter {
    private key = 'mbsData';

    async loadData(): Promise<MBSData | null> {
        try {
            const raw = localStorage.getItem(this.key);
            if (!raw) return null;
            return JSON.parse(raw) as MBSData;
        } catch (e) {
            console.error("Failed to load data from localStorage", e);
            return null;
        }
    }

    async saveData(data: MBSData): Promise<void> {
        try {
            localStorage.setItem(this.key, JSON.stringify(data));
        } catch (e) {
            console.error("Failed to save data to localStorage", e);
        }
    }
}

// Singleton instance for easy access, but can be DI'd later
export const storage = new LocalStorageAdapter();
