import {BrowserWindow, ipcMain} from 'electron'
import {writable} from 'svelte/store'
import type {Writable} from 'svelte/store'
import {log} from './log'

// Map of the data being stored
//      could be persisted to disk/etc later
const data: Map<string, any> = new Map([['isLoading', true]])

ipcMain.handle('STORE_FETCH', async (event: Electron.IpcMainInvokeEvent, name: any) => {
    if (data.has(name)) {
        return data.get(name)
    }
    return undefined
})

ipcMain.on('STORE_SET', async (event: Electron.IpcMainInvokeEvent, key: string, value: any) => {
    // Save data locally
    data.set(key, value)
    // Load all browser window instances
    const windows = BrowserWindow.getAllWindows()
    // Send a sync event to each one with the key/value pair
    windows.forEach((window) => window.webContents.send('STORE_SYNC', key, value))
})
