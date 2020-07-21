# What is WhatsAppSpy
WhatsAppSpy is a cross-platform desktop application that allows you to spy on status changes of a WhatsApp contact.

![WhatsAppSpy Home Presentation](/public/images/screenshot_example/home-presentation.jpg)

# How to use

## 1. Download this program

Download this program by clicking first on the green "Code" button and then on the "Download ZIP" button of the dropdown. See the following example :

![Download Steps Example](/public/images/screenshot_example/download-step-example.png)

Once the ZIP file has been downloaded, you can unzip it wherever you want on your computer (on the Desktop for example) to be able to start the program in the following step.

## 2. Start the program

1. Open any terminal prompt (CMD, PowerShell, Terminal, Bash, ZSH, etc)
2. In your terminal, move into the unzipped folder (maybe named `whatsappspy-master`) by executing the following command `cd path/to/folder/whatsappspy-master`.
3. Execute the following command `npm install` to locally install all the necessary Node.js dependencies used by WhatsAppSpy. :warning: This step requires [Node.js](https://nodejs.org/en/) and NPM (included in Node.js) to be installed on your machine.
4. Start WhatsAppSpy by executing `npm run start` *(alias of `npm start electon .`)*.

## 3. Configure the settings

Once WhatsAppSpy is running, the last thing to do before spying on your friend is to configure the settings in order for the program to work properly.

Configure the following settings :

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
![Online Status Example](/public/images/screenshot_example/online-status-example.png)

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

## 4. Start spying
You're all set to start spying on someone's connection ! :eyes:

Go to the home page and start now ! :clap:


# Supported OS
* **MacOS** : 10.10 (Yosemite) or higher.
* **Windows** : Windows 7 or higher.
* **Linux** : Ubuntu 12.04, Fedora 21, Debian 8 and more.

# Issues found ?
If something doesn't work or behave as you expected, let us know by reporting a new issue on [github.com/d-roduit/whatsappspy/issues](https://github.com/d-roduit/whatsappspy/issues).
