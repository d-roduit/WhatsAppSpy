// Loads the corresponding template
loadDynamicCSS('info');
loadView('info');

generateAbsoluteRoutes(routes, pageContentElem);

// Self-invoked function to keep the the variables and the functions in a local scope
(() => {

    // Electron modules
    const { shell } = require('electron');

    // Inputs
    const dataDirectoryDefaultValueField = document.getElementById('default_value_data_directory');
    const screenshotFromCoordXDefaultValueField = document.getElementById('default_value_screenshot_from_coord_x');
    const screenshotFromCoordYDefaultValueField = document.getElementById('default_value_screenshot_from_coord_y');
    const screenshotWidthDefaultValueField = document.getElementById('default_value_screenshot_width');
    const screenshotHeightDefaultValueField = document.getElementById('default_value_screenshot_height');
    const colorToSearchDefaultValueField = document.getElementById('default_value_color_to_search');
    const saveImagesDefaultValueField = document.getElementById('default_value_save_images');
    const writeLogDefaultValueField = document.getElementById('default_value_write_log');
    const resetLogFileDefaultValueField = document.getElementById('default_value_reset_log_file');
    const sendNotificationWhenConnectedDefaultValueField = document.getElementById('default_value_send_notification_when_connected');

    /* Operation */
    pageContentElem.addEventListener('click', (event) => {
        if (event.target.localName === 'a') {
            event.preventDefault();

            shell.openExternal(event.target.href);
        }
    });

    // Display default settings values coming from the defaultConfig file
    const defaultConfig = require(`${routes.root}defaultConfig`);
    dataDirectoryDefaultValueField.textContent = defaultConfig.settings.data_directory;
    screenshotFromCoordXDefaultValueField.textContent = defaultConfig.screenshots.from_coord_x;
    screenshotFromCoordYDefaultValueField.textContent = defaultConfig.screenshots.from_coord_y;
    screenshotWidthDefaultValueField.textContent = defaultConfig.screenshots.width;
    screenshotHeightDefaultValueField.textContent = defaultConfig.screenshots.height;
    colorToSearchDefaultValueField.textContent = defaultConfig.advanced_settings.color_to_search;
    saveImagesDefaultValueField.textContent = defaultConfig.settings.save_images;
    writeLogDefaultValueField.textContent = defaultConfig.settings.write_log;
    resetLogFileDefaultValueField.textContent = defaultConfig.settings.reset_log_file;
    sendNotificationWhenConnectedDefaultValueField.textContent = defaultConfig.settings.send_notification_when_connected;

})();
