import { writable } from "svelte/store";

//Custom Store
const defaultSettings = {
    colorSchema: 'dark',
    language: 'en',
    fontSize: 12
}

function createSettingStore() {
    const { subscribe, set, update } = writable({ ...defaultSettings })
    return {
        subscribe,
        set,
        update,
        updateSettings: (setting: any, value: any) => {
            update((settings) => ({ ...settings, [setting]: value }))
        },
        toggleColorSchema: () => {
            update((settings) => ({...settings, colorSchema: settings.colorSchema === 'dark' ? 'light' : 'dark'}))
        },
        reset: () => {
            set({ ...defaultSettings })
        }
    }
}

const settings = createSettingStore();

export default settings