// Loads the corresponding template
loadDynamicCSS('home');
loadView('home');

// Self-invoked function to keep the the variables and the functions in a local scope
(() => {
    // Elements
    const logPreviewElem = document.getElementById('logPreview');
    const nbrOfConnectionsElem = document.getElementById('nbrOfConnections');
    const lastConnectionTimeElem = document.getElementById('lastConnectionTime');

    // Buttons
    const startStopButton = document.getElementById('startStopButton');
    const resetLogsButton = document.getElementById('resetLogsButton');

    // Functions
    const toggleIsScriptRunning = () => {
        let isScriptRunning = sessionStorage.getItem('isScriptRunning');

        if (isScriptRunning === 'true') {
            sessionStorage.setItem('isScriptRunning', false);
        } else {
            sessionStorage.setItem('isScriptRunning', true);
        }
    };

    const saveToLogFile = (text) => {
        try {
            fs.appendFile(logFile.savingPath, text, (err) => {
                if (err) throw err;
            });
        } catch (err) {
            console.error(`LogFile Writing: ${err}`);
        }
    };

    const addToLogFileContent = (statusText, statusTime = null) => {
        let textToWrite = '';

        if (statusTime) {
            textToWrite = `\n${statusText} | ${statusTime}`;
        } else {
            textToWrite = `\n${statusText}`;
        }

        logFileContent += textToWrite;
    };

    const writeToLogHistory = (pText, spanText = null, pClasses = null, spanClasses = null) => {
        const pElem = document.createElement('p');
        const pTextNode = document.createTextNode(pText);
        pElem.appendChild(pTextNode);

        if (pClasses) {
            if (Array.isArray(pClasses)) {
                pClasses.forEach((pClassItem) => {
                    pElem.classList.add(pClassItem);
                });
            } else if (typeof pClasses === 'string') {
                pElem.classList.add(pClasses);
            }
        }

        if (spanText) {
            const spanElem = document.createElement('span');
            const spanTextNode = document.createTextNode(spanText);
            spanElem.appendChild(spanTextNode);


            if (spanClasses) {
                if (Array.isArray(spanClasses)) {
                    spanClasses.forEach((spanClassItem) => {
                        spanElem.classList.add(spanClassItem);
                    });
                } else if (typeof spanClasses === 'string') {
                    spanElem.classList.add(spanClasses);
                }
            }

            pElem.appendChild(spanElem);
        }

        logHistory.appendChild(pElem);
    };

    const write = (statusText, statusTime = null, pClasses = null, spanClasses = null, mustWriteToLogHistory = true, mustWriteToLogFile = true) => {
        if (mustWriteToLogHistory) {
            writeToLogHistory(statusText, statusTime, pClasses, spanClasses);
        }

        if (logFile.writeLog) {
            if (mustWriteToLogFile) {
                addToLogFileContent(statusText, statusTime);
            }
        }

    }

    const showLogHistory = () => {
        // Gets the element to be sure to have the correct htmlElem
        // and not a reference to an old htmlElem already deleted
        // when loadView() was called when changing of page
        const logPreviewLocalElem = document.getElementById('logPreview');

        if (logPreviewLocalElem) {
            logPreviewLocalElem.innerHTML = logHistory.innerHTML;
        }
    };

    const removeFromLogHistory = (elemSelector) => {
        const elementsFound = logHistory.querySelectorAll(elemSelector);
        elementsFound.forEach((elem) => elem.remove());
    };

    const scrollToBottom = (htmlElemId) => {
        const htmlElem = document.getElementById(htmlElemId);

        if (htmlElem) {
            const isScrolledToBottom = htmlElem.scrollHeight - htmlElem.clientHeight <= htmlElem.scrollTop + 1;

            if (!isScrolledToBottom) {
                // Scrolls to bottom
                htmlElem.scrollTop = htmlElem.scrollHeight - htmlElem.clientHeight;
            }
        }
    };

    // Format the date
    const getDate = () => {
        const date = new Date();

        return {
            day: (date.getDate() < 10 ? '0' : '') + date.getDate(),
            month: ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1),
            year: date.getFullYear(),
            hours: (date.getHours() < 10 ? '0' : '') + date.getHours(),
            minutes: (date.getMinutes() < 10 ? '0' : '') + date.getMinutes(),
            seconds: (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()
        }
    };

    const updateConnectionsInfo = (counter, time) => {
        // Updated the nbr of connections detected
        nbrOfConnectionsElem.textContent = counter;

        // Update the last connection time detected
        lastConnectionTimeElem.textContent = time;

        // Stores the new last time in the variable to be reused
        lastConnectionTime = time;
    };

    // Spy function that checks the status every 5 seconds
    const spy = (userConfig) => {

        let date = getDate();
        const currentDate = `${date.hours}:${date.minutes}:${date.seconds} / ${date.day}.${date.month}.${date.year}`;

        // Whether to save the screenshots or not
        const saveImages = userConfig.settings.save_images;
        const colorToSearch = Jimp.intToRGBA(Jimp.cssColorToHex(userConfig.advanced_settings.color_to_search));
        const resetLogFile = userConfig.settings.reset_log_file;

        // Resets the content of the logFileContent to append to file only the current new spy session logs
        logFileContent = '';

        if (logFile.writeLog) {
            // Empties log file before starting a new spy session
            if (resetLogFile) {
                // Empties the logHistory HTML content
                logHistory.innerHTML = '';
                showLogHistory();

                // Erases all the logfile data
                fs.writeFile(logFile.savingPath, logFileContent, (err) => {
                    if (err) throw err;
                });
            }
        }

        // Resets the information variables
        connectionsCounter = 0;
        lastConnectionTime = '__:__:__';

        // Updates the connection informations
        updateConnectionsInfo(connectionsCounter, lastConnectionTime);

        write('> New spying session', currentDate, null, 'time');
        write('Spying', null, ['animated_waiter'], null, true, false);

        showLogHistory();

        scrollToBottom('logPreview');

        return setInterval(() => {

            // Format the date
            date = getDate();

            const currentTime = `${date.hours}:${date.minutes}:${date.seconds}`;
            const screenshotFileName = `${date.day}-${date.month}-${date.year}_${date.hours}h${date.minutes}min${date.seconds}s`;

            const screenshots = {
                fromCoordX: userConfig.screenshots.from_coord_x,
                fromCoordY: userConfig.screenshots.from_coord_y,
                width: userConfig.screenshots.width,
                height: userConfig.screenshots.height,
                savingPath: `${userConfig.settings.data_directory}screenshots/screenshot-${screenshotFileName}`
            };

            // Takes a screenshot
            ScreenshotLib()
                .then(imgFromBuffer => {
                    Jimp.read(imgFromBuffer)
                        .then(img => {
                            let imgLeft = img.clone();
                            let imgRight = img.clone();

                            // let pixels = [];
                            let imgLeftUniqueColors = new Set();
                            let imgRightUniqueColors = new Set();

                            let imgRightHasStatus = false;
                            let imgLeftHasStatus = false;

                            // Crops the image
                            imgLeft.crop(
                                screenshots.fromCoordX,
                                screenshots.fromCoordY,
                                screenshots.width,
                                screenshots.height
                            );

                            if (saveImages) {
                                // Saves the image
                                imgLeft.writeAsync(`${screenshots.savingPath}-left.jpg`);
                            }

                            // Loop on each pixel of the left image
                            imgLeft
                                .scan(0, 0, imgLeft.bitmap.width, imgLeft.bitmap.height, (pixelCoordX, pixelCoordY) => {
                                    // Retrieve the RGBA value of the pixel
                                    let rgbaOfPixel = Jimp.intToRGBA(imgLeft.getPixelColor(pixelCoordX, pixelCoordY));

                                    // Stores the unique color values by using a Set()
                                    imgLeftUniqueColors.add(JSON.stringify(rgbaOfPixel));

                                    // Callback of scan() function
                                }, () => {
                                    // Turns back the JSON value into a JavaScript Object
                                    imgLeftUniqueColors = Array.from(imgLeftUniqueColors).map(jsonColor => JSON.parse(jsonColor));

                                    imgLeftHasStatus = imgLeftUniqueColors.some(color => {
                                        return (
                                            color.r >= colorToSearch.r - 2 && color.r <= colorToSearch.r + 2
                                            && color.g >= colorToSearch.g - 2 && color.g <= colorToSearch.g + 2
                                            && color.r >= colorToSearch.b - 2 && color.b <= colorToSearch.b + 2
                                            && color.a === colorToSearch.a
                                        );
                                    });
                                });


                            imgRight.crop(
                                screenshots.fromCoordX + screenshots.width,
                                screenshots.fromCoordY,
                                screenshots.width,
                                screenshots.height
                            );

                            if (saveImages) {
                                imgRight.writeAsync(`${screenshots.savingPath}-right.jpg`);
                            }

                            // Loop on each pixel of the left image
                            imgRight
                                .scan(0, 0, imgRight.bitmap.width, imgRight.bitmap.height, (pixelCoordX, pixelCoordY) => {
                                    // Retrieve the RGBA value of the pixel
                                    let rgbaOfPixel = Jimp.intToRGBA(imgRight.getPixelColor(pixelCoordX, pixelCoordY));

                                    // Stores the unique color values by using a Set()
                                    imgRightUniqueColors.add(JSON.stringify(rgbaOfPixel));

                                    // Callback of scan() function
                                }, () => {
                                    // Turns back the JSON value into a JavaScript Object
                                    imgRightUniqueColors = Array.from(imgRightUniqueColors).map(jsonColor => JSON.parse(jsonColor));

                                    imgRightHasStatus = imgRightUniqueColors.some(color => {
                                        return (
                                            color.r >= colorToSearch.r - 2 && color.r <= colorToSearch.r + 2
                                            && color.g >= colorToSearch.g - 2 && color.g <= colorToSearch.g + 2
                                            && color.r >= colorToSearch.b - 2 && color.b <= colorToSearch.b + 2
                                            && color.a === colorToSearch.a
                                        );
                                    });
                                });

                            if (imgLeftHasStatus && !imgRightHasStatus) {
                                status = 'online';
                            } else if (imgLeftHasStatus && imgRightHasStatus) {
                                status = 'lastSeen';
                            } else if (!imgLeftHasStatus && !imgRightHasStatus) {
                                status = 'noStatus';
                            } else {
                                status = 'text detection found no result';
                            }

                            // If the status has changed from the previous one
                            if (status !== lastStatus) {
                                if (status === 'online') {
                                    // Updates the connection informations
                                    updateConnectionsInfo(++connectionsCounter, currentTime);
                                }

                                removeFromLogHistory('.animated_waiter')

                                write(status, currentTime, null, 'time');
                                write('Spying', null, ['animated_waiter'], null, true, false);

                                // Displays the logHistory variable into logPreviewElem
                                showLogHistory();

                                lastStatus = status;

                                scrollToBottom('logPreview');
                            }
                        })
                        .catch(err => {
                            console.error(`Jimp : ${err}`)
                            showActionPopup('Spy Error', `${icons.exclamation_circle} Jimp : ${err}`);
                            clearInterval(spyCycle);
                            toggleIsScriptRunning();
                            startStopButton.classList.toggle('startStopAnimation');
                            removeFromLogHistory('.animated_waiter');
                            write(`Nbr of connections detected: ${connectionsCounter}`, null, null, null, false, true);
                            write(`Last connection time: ${lastConnectionTime}`, null, null, null, false, true);
                            write('> Session End', currentDate, 'endSession', 'time');
                            write('\n', null, null, null, false, true);

                            // If writeLog is enabled, save status in logFile
                            if (logFile.writeLog) {
                                saveToLogFile(logFileContent);
                            }

                            // Displayes the changes
                            showLogHistory();

                            scrollToBottom('logPreview');
                        });
                })
                .catch(err => {
                    console.error(`Screenshot : ${err}`)
                    showActionPopup('Spy Error', `${icons.exclamation_circle} Screenshot : ${err}`);
                    clearInterval(spyCycle);
                    toggleIsScriptRunning();
                    startStopButton.classList.toggle('startStopAnimation');
                    removeFromLogHistory('.animated_waiter');
                    write(`Nbr of connections detected: ${connectionsCounter}`, null, null, null, false, true);
                    write(`Last connection time: ${lastConnectionTime}`, null, null, null, false, true);
                    write('> Session End', currentDate, 'endSession', 'time');
                    write('\n', null, null, null, false, true);

                    // If writeLog is enabled, save status in logFile
                    if (logFile.writeLog) {
                        saveToLogFile(logFileContent);
                    }

                    // Displayes the changes
                    showLogHistory();

                    scrollToBottom('logPreview');
                });
        }, 5000);
    };


    /* Operation */

    // Get the user configuration to pass to the spy function
    const userConfig = getConfig();

    // Define the logFile settings
    const logFile = {
        writeLog: userConfig.settings.write_log,
        savingPath: `${userConfig.settings.data_directory}log.txt`
    };

    // Displays the logHistory in logPreviewElem
    showLogHistory();

    const htmlEl = document.getElementById('logPreview');
    if (htmlEl) {
        const isScrolledToBottom = ((htmlEl.scrollHeight - htmlEl.clientHeight) <= (htmlEl.scrollTop + 1)) ? true : false;

        if (!isScrolledToBottom) {
            // Scrolls to bottom
            htmlEl.scrollTop = htmlEl.scrollHeight - htmlEl.clientHeight;
        }
    }

    // Displays the updated connections informations
    updateConnectionsInfo(connectionsCounter, lastConnectionTime);

    // Get script status from sessionStorage
    const isScriptRunning = sessionStorage.getItem('isScriptRunning');

    // Displays the correct button icon
    if (isScriptRunning === 'true') {
        startStopButton.classList.add('startStopAnimation');
    } else {
        startStopButton.classList.remove('startStopAnimation');
    }


    startStopButton.addEventListener('click', () => {
        // Changes the button icon
        startStopButton.classList.toggle('startStopAnimation');

        const isScriptRunning = sessionStorage.getItem('isScriptRunning');

        // If the script was running, stop it
        if (isScriptRunning === 'true') {
            // Stops the setInterval
            clearInterval(spyCycle);

            // Resets the lastStatus in order to begin with an empty variable on the next spying session
            lastStatus = null;

            removeFromLogHistory('.animated_waiter');

            // Gets the script ending time
            const date = getDate();
            const currentDate = `${date.hours}:${date.minutes}:${date.seconds} / ${date.day}.${date.month}.${date.year}`;

            write(`Nbr of connections detected: ${connectionsCounter}`, null, null, null, false, true);

            if (connectionsCounter !== 0) {
                write(`Last connection time: ${lastConnectionTime}`, null, null, null, false, true);
            }

            write('> Session End', currentDate, 'endSession', 'time');
            write('\n', null, null, null, false, true);

            // If writeLog is enabled, save status in logFile
            if (logFile.writeLog) {
                saveToLogFile(logFileContent);
            }

            // Displayes the changes
            showLogHistory();

            scrollToBottom('logPreview');

        } else if (isScriptRunning === 'false') {
            // Starts the spying script
            spyCycle = spy(userConfig);
        }

        // Change the sessionStorage value of isScriptRunning
        toggleIsScriptRunning();
    });

    resetLogsButton.addEventListener('click', () => {
        // Empty the logPreview
        logPreviewElem.innerHTML = '';

        // Empty the logHistory
        logHistory.innerHTML = '';

        const isScriptRunning = sessionStorage.getItem('isScriptRunning');

        if (isScriptRunning === 'true') {
            write('Spying', null, ['animated_waiter'], null, true, false);
            showLogHistory();
        }
    });
})();
