// Node.js modules
const fs = require('fs');
const path = require('path');

// Node.js modules for the spy script
const ScreenshotLib = require('screenshot-desktop');
const Jimp = require('jimp');

// Global variables
const icons = {
    check: '<i class="fas fa-check"></i>',
    exclamation_circle: '<i class="fas fa-exclamation-circle"></i>',
    loader: '<i class="fas fa-circle-notch fa-spin"></i>'
};


/* Useful variables for the spying script */
let logHistory = document.createElement('div'); // Keeps the history of the current spying session's log
let logFileContent = ''; // Keeps the history of the current spying session's log for saving into the log file
let spyCycle = null; // Keeps track of the setInterval
let status = null;
let lastStatus = null; // Keeps the last status detected to detect a status change
let connectionsCounter = 0; // Counts the number of connections detected
let lastConnectionTime = '__:__:__'; // Keeps the last connection time


// Elements
const pageContentElem = document.getElementById('pageContent');
const staticScriptElem = document.getElementById('staticScript');
const dynamicLinkElem = document.getElementById('dynamicLink');
const actionPopupElem = document.getElementById('actionPopup');
const actionPopupMessageElem = document.getElementById('popupMessage');
const actionPopupTitleElem = document.getElementById('popupTitle');

// Buttons
const homeButton = document.getElementById('homeButton');
const settingsButton = document.getElementById('settingsButton');
const infoButton = document.getElementById('infoButton');
const minimizeButton = document.getElementById('minimizeButton');
const fullScreenButton = document.getElementById('fullScreenButton');
const closeButton = document.getElementById('closeButton');

const loadDynamicJS = (jsFileName) => {
    const dynamicScriptElem = document.getElementById('dynamicScript');

    if (dynamicScriptElem) {
        dynamicScriptElem.remove();
    }

    const newDynamicScriptElem = document.createElement('script');
    newDynamicScriptElem.src = `${routes.controllers}${jsFileName}.js`;
    newDynamicScriptElem.id = 'dynamicScript';
    document.body.insertBefore(newDynamicScriptElem, staticScriptElem);
};

const loadDynamicCSS = (cssFileName) => {
    dynamicLinkElem.href = `${routes.styles}${cssFileName}.css`;
};

// Gets the content of a file and displays it in the <main> Element
const loadView = (htmlFileName) => {
    const data = fs.readFileSync(`${routes.views}${htmlFileName}.html`);

    // Show the HTML content
    pageContentElem.innerHTML = data;
};

// Add the "active" class to the HTML element passed in parameters
const showActive = (element) => {
    const activeElem = document.getElementsByClassName('active');

    for (let elem of activeElem) {
        elem.classList.remove('active');
    }

    element.classList.add('active');
};

const showActionPopup = (title, message) => {
    actionPopupTitleElem.innerHTML = title;
    actionPopupMessageElem.innerHTML = message;
    actionPopupElem.classList.add('showActionPopup');
    setTimeout(() => {
        actionPopupElem.classList.remove('showActionPopup');
    }, 3000);
};

// Get the JSON Config from settings.json
const getConfig = () => {
    // Default config object
    const defaultConfig = require(`${routes.root}defaultConfig`);

    // JSON Default Config
    const jsonData = JSON.stringify(defaultConfig);

    let rawdata = null;

    try {
        rawdata = fs.readFileSync(`${routes.appData}settings.json`);
    } catch (err) {
        console.error(err);

        // Create settings.json file with default json config
        fs.writeFileSync(`${routes.appData}settings.json`, jsonData);
        rawdata = fs.readFileSync(`${routes.appData}settings.json`);
        const data = JSON.parse(rawdata);

        return data;
    }

    let data = null;

    try {
        data = JSON.parse(rawdata);
    } catch (err) {
        console.error(err);

         // Replaces the settings.json content file with empty json
         fs.writeFileSync(`${routes.appData}settings.json`, jsonData);
         rawdata = fs.readFileSync(`${routes.appData}settings.json`);
         data = JSON.parse(rawdata);
    }

    return data;
};


/* Operation */

// Save script status to sessionStorage at launch
sessionStorage.setItem('isScriptRunning', false);

// Show the home page at launch
showActive(homeButton);
loadDynamicJS('home');

homeButton.addEventListener('click', () => {
    showActive(homeButton);
    loadDynamicJS('home');
});

settingsButton.addEventListener('click', () => {
    showActive(settingsButton);
    loadDynamicJS('config');
});

infoButton.addEventListener('click', () => {
    showActive(infoButton);
    loadDynamicJS('info');
});

minimizeButton.addEventListener('click', () => {
    ipcRenderer.send('app:minimize');
});

fullScreenButton.addEventListener('click', () => {
    ipcRenderer.send('app:fullscreen');
});

closeButton.addEventListener('click', () => {
    ipcRenderer.send('app:close');
});
