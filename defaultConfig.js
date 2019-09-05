// Default config object
const defaultConfig = {
    screenshots: {
        from_coord_x: null,
        from_coord_y: null,
        width: null,
        height: null
    },
    settings: {
        data_directory: `${routes.appData}data${path.sep}`,
        save_images: false,
        write_log: true,
        reset_log_file: false,
        send_notification_when_connected: false
    },
    advanced_settings: {
        color_to_search: '#7c7c7c'
    }
};

module.exports = defaultConfig;
