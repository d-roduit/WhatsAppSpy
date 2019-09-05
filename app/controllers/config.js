// Loads the corresponding template
loadDynamicCSS('config');
loadView('config');

generateAbsoluteRoutes(routes, pageContentElem);

(() => {

    // Electron modules
    const { ipcRenderer } = require('electron');

    // Inputs
    const screenshotFromCoordXInput = document.getElementById('screenshotFromCoordX');
    const screenshotFromCoordYInput = document.getElementById('screenshotFromCoordY');
    const screenshotWidthInput = document.getElementById('screenshotWidth');
    const screenshotHeightInput = document.getElementById('screenshotHeight');
    const dataDirectoryInput = document.getElementById('dataDirectory');
    const saveImagesInput = document.getElementById('saveImages');
    const writeLogInput = document.getElementById('writeLog');
    const resetLogFileInput = document.getElementById('resetLogFile');
    const sendNotificationWhenConnectedInput = document.getElementById('sendNotificationWhenConnected');
    const colorSelectorInput = document.getElementById('colorSelector');

    // Elements
    const errIsNotDirectoryElem = document.getElementById('errIsNotDirectory');
    const imgCheckScreenshotElem = document.getElementById('imgCheckScreenshot');
    const resetLogFileEntryElem = document.getElementById('resetLogFileEntry');

    // Buttons
    const checkScreenshotConfigButton = document.getElementById('checkScreenshotConfig');
    const saveConfigButton = document.getElementById('saveConfig');
    const resetConfigButton = document.getElementById('resetConfig');
    const browseDirectoriesButton = document.getElementById('browseDirectories');

    // Save the config in JSON into settings.json
    const saveConfig = (config, successCallback = null) => {
        const jsonData = JSON.stringify(config);

        // Writing the new config into the file
        fs.writeFile(`${routes.appData}settings.json`, jsonData, (err) => {
            if (err) throw err;

            if (successCallback) {
                successCallback();
            }
        });
    };

    // Update the config in the view
    const applyConfig = (configObj) => {
        // Screenshots
        screenshotFromCoordXInput.value = configObj.screenshots.from_coord_x;
        screenshotFromCoordYInput.value = configObj.screenshots.from_coord_y;
        screenshotWidthInput.value = configObj.screenshots.width;
        screenshotHeightInput.value = configObj.screenshots.height;

        // Settings
        dataDirectoryInput.value = configObj.settings.data_directory;
        saveImagesInput.checked = configObj.settings.save_images;
        writeLogInput.checked = configObj.settings.write_log;
        resetLogFileInput.checked = configObj.settings.reset_log_file;
        sendNotificationWhenConnectedInput.checked = configObj.settings.send_notification_when_connected;

        // Advanced Settings
        colorSelectorInput.value = configObj.advanced_settings.color_to_search;
    };

    // Reset the settings in the app and save the default config in settings.json
    const resetConfig = function() {
        // Checks if the variable has already been defined
        if (typeof this.isPlayable == 'undefined') {
            this.isPlayable = true;
        }

        // If the script execution is finished
        if (this.isPlayable === true) {
            // The script is running
            this.isPlayable = false;

            // Get the innerHTML of the button for later
            const resetConfigButtonText = resetConfigButton.innerHTML;

            // Update button text with a loading icon during the reset process
            updateElementText(resetConfigButton, icons.loader);

            const defaultConfig = require(`${routes.root}defaultConfig`);

            console.log(defaultConfig);

            // Update the view with the default config
            applyConfig(defaultConfig);

            // Save the config into settings.json
            saveConfig(defaultConfig, () => {
                updateElementText(resetConfigButton, `Resetted ${icons.check}`);
                showActionPopup('Configuration', `Settings resetted &nbsp; ${icons.check}`);

                // After 3 seconds, put the button text back
                updateElementText(resetConfigButton, resetConfigButtonText, 3000, () => {
                    this.isPlayable = true;
                });
            });
        } else {
            console.log('Impossible to reset the settings for the moment');
        }
    };

    // Update the textContent of a button when it gets clicked
    const updateElementText = (htmlElem, text, delay = null, callback = null) => {
        if (delay === null) {
            htmlElem.innerHTML = text;

            if (callback) {
                callback();
            }
        } else {
            setTimeout(() => {
                htmlElem.innerHTML = text;

                if (callback) {
                    callback();
                }
            }, delay);
        }
    };

    const animation = {
        makeAppear: (htmlElem) => {
            if (htmlElem.classList.contains('disappear')) {
                htmlElem.classList.remove('none');
                setTimeout(() => {
                    htmlElem.classList.remove('disappear');
                }, 200);
            }
        },
        makeDisappear: (htmlElem) => {
            htmlElem.classList.add('disappear');
            setTimeout(() => {
                htmlElem.classList.add('none');
            }, 200);
        },
        toggleAppear: (htmlElem) => {
            if (htmlElem.classList.contains('disappear')) {
                htmlElem.classList.remove('none');
                setTimeout(() => {
                    htmlElem.classList.remove('disappear');
                }, 200);
            } else {
                htmlElem.classList.add('disappear');
                setTimeout(() => {
                    htmlElem.classList.add('none');
                }, 200);
            }
        }
    };


    /* Operation */

    // Get the user config from settings.json
    let userConfig = {};
    try {
        console.log('getConfig tried');
        userConfig = getConfig();
    } catch (err) {
        console.log(`${err}`);
        resetConfig();
        userConfig = getConfig();
    }

    // Update the html with the user config
    applyConfig(userConfig);

    // Hide the resetLogFile settings if writeLog isn't checked
    if (!writeLogInput.checked) {
        animation.makeDisappear(resetLogFileEntryElem);
        resetLogFileInput.checked = false;
    }

    // Anonymous function uses "function(){}" to be able to use the button's "this"
    resetConfigButton.addEventListener('click', resetConfig);

    // Anonymous function uses "function(){}" to be able to use the button's "this"
    saveConfigButton.addEventListener('click', function() {
        // Checks if the variable has already been defined
        if (typeof this.isPlayable == 'undefined') {
            this.isPlayable = true;
        }

        // If the script execution is finished
        if (this.isPlayable === true) {
            // The script is running
            this.isPlayable = false;

            // Get the innerHTML of the button for later
            const saveConfigButtonText = saveConfigButton.innerHTML;

            // Update button text with a loading icon during the configuration saving process
            updateElementText(saveConfigButton, icons.loader);

            // Get the new settings
            const newConfig = {
                screenshots: {
                    from_coord_x: Number(screenshotFromCoordXInput.value),
                    from_coord_y: Number(screenshotFromCoordYInput.value),
                    width: Number(screenshotWidthInput.value),
                    height: Number(screenshotHeightInput.value)
                },
                settings: {
                    data_directory: dataDirectoryInput.value,
                    save_images: saveImagesInput.checked,
                    write_log: writeLogInput.checked,
                    reset_log_file: resetLogFileInput.checked,
                    send_notification_when_connected: sendNotificationWhenConnectedInput.checked
                },
                advanced_settings: {
                    color_to_search: colorSelectorInput.value
                }
            };

            saveConfig(newConfig, () => {
                updateElementText(saveConfigButton, `Saved ${icons.check}`);
                showActionPopup('Configuration', `Settings saved &nbsp; ${icons.check}`);

                // After 3 seconds, put the button text back
                updateElementText(saveConfigButton, saveConfigButtonText, 3000, () => {
                    this.isPlayable = true;
                });
            });
        } else {
            console.log('Impossible to save the settings for the moment');
        }

    });

    dataDirectoryInput.addEventListener('keyup', function() {
        const dirPath = this.value;
        const isDirectory = fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory() && dirPath[dirPath.length - 1] === path.sep;

        if (!isDirectory) {
            errIsNotDirectoryElem.innerHTML = `${icons.exclamation_circle} This path is not a directory`;
        } else {
            errIsNotDirectoryElem.innerHTML = '';
        }
    });

    checkScreenshotConfigButton.addEventListener('click', () => {

        const screenshotCheck = {
            fromCoordX: Number(screenshotFromCoordXInput.value),
            fromCoordY: Number(screenshotFromCoordYInput.value),
            width: Number(screenshotWidthInput.value),
            height: Number(screenshotHeightInput.value)
        };

        // Takes screenshot
        ScreenshotLib()
            .then(imgFromBuffer => {
                console.log('Screenshot : screenshot taken');

                Jimp.read(imgFromBuffer)
                    .then(img => {
                        // Crops the image
                        img.crop(
                            screenshotCheck.fromCoordX,
                            screenshotCheck.fromCoordY,
                            screenshotCheck.width,
                            screenshotCheck.height
                        );

                        // Convert buffer into base64
                        img.getBase64Async(Jimp.MIME_JPEG)
                            .then(data => {
                                imgCheckScreenshotElem.src = data;
                            });
                    })
                    .catch(err => {
                        console.log(`Jimp : ${err}`)
                    });
            })
            .catch(err => {
                console.log(`Screenshot : ${err}`)
            });

        // imgCheckScreenshotElem.src = 'data:image/jpeg;base64,' + buf.toString('base64');
    });

    writeLogInput.addEventListener('change', function() {
        animation.toggleAppear(resetLogFileEntryElem);
        if (!this.checked) {
            resetLogFileInput.checked = false;
        }
    });

    browseDirectoriesButton.addEventListener('click', () => {
        ipcRenderer.send('dialog:open', dataDirectoryInput.value);
    });

    ipcRenderer.on('dialog:returnedPath', (event, arg) => {
        dataDirectoryInput.value = arg;
    });

})();
