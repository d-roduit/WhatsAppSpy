// Default config object
const defaultConfig = {
    screenshots: {
        from_coord_x: 0,
        from_coord_y: 0,
        width: 70,
        height: 20
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
