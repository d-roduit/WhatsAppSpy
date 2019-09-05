const { app } = require('electron');
const path = require('path');

const appPath = app.getAppPath();
const appDataFolder = app.getPath('userData');
const sep = path.sep;

const routes = {
    root: `${appPath}${sep}`,
    appData: `${appDataFolder}${sep}`,
    controllers: `${appPath}${sep}app${sep}controllers${sep}`,
    views: `${appPath}${sep}app${sep}views${sep}`,
    styles: `${appPath}${sep}public${sep}styles${sep}dist${sep}`,
    images: `${appPath}${sep}public${sep}images${sep}`,
    vendors: `${appPath}${sep}app${sep}vendors${sep}`
};

module.exports = routes;
