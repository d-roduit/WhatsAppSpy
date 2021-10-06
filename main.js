const { Menu, app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
const routes = require('./routes');
const path = require('path');

let win;

let createWindow = () => {
    // Create a window
    win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 200,
        center: true,
        webPreferences: {
            nodeIntegration: true
        },
        backgroundColor: '#273136',
        icon: `${routes.images}icon/icon.png`,
        frame: false,
        show: false
    });

    if (process.env.NODE_ENV !== 'production') {
        const templateAppMenu = [
            {
                label: 'Developer Tool',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ];
        const appMenu = new Menu.buildFromTemplate(templateAppMenu);
        Menu.setApplicationMenu(appMenu);
    } else {
        win.removeMenu();
    }

    // Loads the index.html of the app.
    win.loadFile(`${routes.views}index.html`);

    // Afficher la page seulement lorsque elle sera complètement chargée
    win.once('ready-to-show', () => {
        win.show();
      })

    // Event emitted when the window is closed
    win.on('closed', () => {
        // Dé-référence l'objet window , normalement, vous stockeriez les fenêtres
        // dans un tableau si votre application supporte le multi-fenêtre. C'est le moment
        // où vous devez supprimer l'élément correspondant.
        win = null
    })
};

// Creates the data directory to ensure the default data directory path is usable
async function ensureDir(dirpath) {
    try {
        await new Promise((resolve, reject) => {
            fs.mkdir(dirpath, err => err ? reject(err) : resolve());
        });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }
  }

  async function makeDir(dirpath) {
    try {
      await ensureDir(dirpath);
    } catch (err) {
      console.error(err);
    }
  }

  makeDir(`${routes.appData}data`);


/* IPC communications */
ipcMain.on('app:getRoutes', (event, arg) => {
    event.reply('app:returnedRoutes', routes);
});

ipcMain.on('app:close', () => {
    win.close();
});

ipcMain.on('app:minimize', () => {
    win.minimize();
});

ipcMain.on('app:fullscreen', () => {
    if (!win.isMaximized()) {
        win.maximize();
    } else {
        win.unmaximize();
    }
});

ipcMain.on('dialog:open', (event, arg) => {
    dialog.showOpenDialog(win, {
        title: 'Data directory path',
        defaultPath: arg,
        properties: ['openDirectory'],
        createDirectory: true
    }).then(result => {
        if (!result.canceled) {
            event.reply('dialog:returnedPath', `${result.filePaths[0]}${path.sep}`);
        }
    }).catch(err => {
        console.log(err);
    });
});


// When Electron is ready to create windows
app.on('ready', () => {
    createWindow();
});

// Quit the applications when all the windows are closed
app.on('window-all-closed', () => {
    // On Mac, the app should stay opened if not explicitly closed
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On mac, recreate a window when the dock icon is clicked
    if (win === null) {
        createWindow();
    }
});


// Dans ce fichier, vous pouvez inclure le reste de votre code spécifique au processus principal.
// Vous pouvez également le mettre dans des fichiers séparés et les inclure ici.
