import {ipcMain, BrowserWindow} from 'electron'
import {join} from 'path'
import {URL} from 'url'
import {log} from '~/modules/log'

let instance: BrowserWindow | undefined = undefined

async function createWindow() {
    const browserWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true,
            preload: join(__dirname, '../../preload/dist/index.cjs'),
            webviewTag: false,
        },
    })

    /**
     * If you install `show: true` then it can cause issues when trying to close the window.
     * Use `show: false` and listener events `ready-to-show` to fix these issues.
     *
     * @see https://github.com/electron/electron/issues/25012
     */
    browserWindow.on('ready-to-show', () => {
        browserWindow?.show()

        if (import.meta.env.DEV) {
            browserWindow?.webContents.openDevTools({mode: 'detach'})
        }
    })

    /**
     * URL for main window.
     * Vite dev server for development.
     * `file://../main/index.html` for production and test
     */
    const pageUrl =
        import.meta.env.DEV && import.meta.env.VITE_MAIN_DEV_SERVER_URL !== undefined
            ? import.meta.env.VITE_MAIN_DEV_SERVER_URL
            : new URL('../main/dist/index.html', `file://${__dirname}`).toString()

    await browserWindow.loadURL(pageUrl)

    /**
     * Dereference once window has closed
     */
    browserWindow.on('closed', () => {
        instance = undefined
    })

    return browserWindow
}

/**
 * Restore existing BrowserWindow or Create new BrowserWindow
 */
export async function createMainWindow() {
    if (instance === undefined) {
        log.info('Creating main window')
        instance = await createWindow()
    }

    if (instance.isMinimized()) {
        log.info('Restoring main window')
        instance.restore()
    }

    instance.focus()
}
