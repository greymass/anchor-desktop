import {BrowserWindow, Menu} from 'electron'
import {join} from 'path'
import {URL} from 'url'
import {log as logger} from '~/modules/log'

const log = logger.scope('electron:signer')

let instance: BrowserWindow | undefined = undefined

const isMac = () => process.platform === 'darwin'

const config = {
    // alwaysOnTop: true,
    center: true,
    // frame: false,
    icon: join(__dirname, '../../../build/assets/icons/png/64x64.png'),
    nodeIntegration: true,
    resizable: true,
    show: false,
    skipTaskbar: true,
    webPreferences: {
        webviewTag: false,
        preload: join(__dirname, '../../preload/dist/index.cjs'),
    },
}

async function createWindow() {
    const browserWindow = new BrowserWindow(config)

    /**
     * If you install `show: true` then it can cause issues when trying to close the window.
     * Use `show: false` and listener events `ready-to-show` to fix these issues.
     *
     * @see https://github.com/electron/electron/issues/25012
     */
    browserWindow.on('ready-to-show', () => {
        if (import.meta.env.DEV) {
            browserWindow?.webContents.openDevTools({mode: 'detach'})
        }
    })

    /**
     * URL for main window.
     * Vite dev server for development.
     * `file://../signer/index.html` for production and test
     */
    const pageUrl =
        import.meta.env.DEV && import.meta.env.VITE_SIGNER_DEV_SERVER_URL !== undefined
            ? import.meta.env.VITE_SIGNER_DEV_SERVER_URL
            : new URL('../signer/dist/index.html', `file://${__dirname}`).toString()

    await browserWindow.loadURL(pageUrl)

    /**
     * Dereference once window has closed
     */
    browserWindow.on('closed', () => {
        instance = undefined
    })

    /**
     * On default close, hide instead
     */
    browserWindow.on('close', async (e) => {
        /**
         * If this is macOS, call hide on the main Anchor app to return to the original app
         */
        if (isMac() && Menu.sendActionToFirstResponder) {
            Menu.sendActionToFirstResponder('hide:')
        }
    })

    return browserWindow
}

/**
 * Restore existing BrowserWindow or Create new BrowserWindow
 */
export async function createSignerWindow(): Promise<BrowserWindow> {
    if (instance === undefined) {
        log.info('Creating signer window')
        instance = await createWindow()
    }

    if (instance.isMinimized()) {
        log.info('Restoring signer window')
        instance.restore()
    }

    return instance
}
