# What is WhatsAppSpy
WhatsAppSpy is a cross-platform desktop application that allows you to spy on status changes of a WhatsApp contact.

# How to use

## 1. Configure the settings

### Screenshots settings

#### X coordinate
Sets the pixel on the horizontal axis from which the screenshot will be taken.

Default value: `null`

#### Y coordinate
Sets the pixel on the vertical axis from which the screenshot will be taken.

Default value: `null`

#### Screenshot width
The screenshot's width in pixel.

Default value: `10px`

#### Screenshot height
The screenshot's height in pixel.

Default value: `10px`

To have the correct size and location settings, you must only see the "online" status text of the person and the top-left corner of the image must start at the top-left corner of the first letter.

The screenshot must be like the following one :
![Screenshot Example](/public/images/screenshot_example/screenshot_example.jpg)

### Application settings

#### Data directory
The absolute path of the directory where the screenshots *(if enabled)* and the log file *(if enabled)* are going to be saved.

Default value: `' '`

#### Save the screenshots
If enabled, the screenshots the application makes in order to find if a person is online will be saved in a subfolder called "screenshots" in the data directory specified.

Default value: `false`

#### Write status changes in log file
If enabled, writes every new status change in a log.txt file.

Default value: `true`

#### Reset log file before starting a new spy session
If enabled, clears the log file content before every new spy session.
The file will therefore contain only the log changes of the session started.

Default value: `false`

#### Send notifications when online
If enabled, the application will automatically push notifiation to your phone to alert you in real time of every new connection detected.
This option requires a token, which one can be obtained by going to [droduit.ch](https://droduit.ch/).

Default value: `false`

### Advanced settings

#### Color to identify the text
Sets the pixel color which will be used to determine if there's text or not.
The greater the contrast between the status text color and its background, the more reliable the detection will be every time.

Default value: `'#7c7c7c'`

## 2. Start spying
You're all set to start spying on someone's connection ! :eyes:

Go to the home page and start now ! :clap:


# Supported OS
* **MacOS** : 10.10 (Yosemite) or higher.
* **Windows** : Windows 7 or higher.
* **Linux** : Ubuntu 12.04, Fedora 21, Debian 8 and more.

# Issues found ?
If something doesn't work or behave as you expected, let us know by reporting a new issue on [github.com/d-roduit/whatsappspy/issues](https://github.com/droduit/whatsappspy/issues).
