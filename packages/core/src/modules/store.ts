import {BrowserWindow, ipcMain} from 'electron'
import {writable} from 'svelte/store'
import type {Writable} from 'svelte/store'
import {log} from './log'

// Map of the data being stored
//      could be persisted to disk/etc later
const data: Map<string, any> = new Map([['isLoading', true]])

ipcMain.handle('STORE_GET', async (event: Electron.IpcMainInvokeEvent, key: any) => {
    if (data.has(key)) {
        return data.get(key)
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
