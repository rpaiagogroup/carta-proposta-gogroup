import { get, set, del } from 'idb-keyval';

const STORAGE_KEY = 'carta-proposta-draft';

export const saveDraft = async (data) => {
    try {
        // Add timestamp for metadata if needed
        await set(STORAGE_KEY, { ...data, lastUpdated: new Date().toISOString() });
    } catch (err) {
        console.error('Failed to save draft:', err);
    }
};

export const loadDraft = async () => {
    try {
        const data = await get(STORAGE_KEY);
        return data || null;
    } catch (err) {
        console.error('Failed to load draft:', err);
        return null;
    }
};

export const clearDraft = async () => {
    try {
        await del(STORAGE_KEY);
    } catch (err) {
        console.error('Failed to clear draft:', err);
    }
};
