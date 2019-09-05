const { ipcRenderer } = require('electron');

const generateAbsoluteRoutes = (routes, elementToReplaceIn) => {
    // <link> tag paths
    const linkTags = elementToReplaceIn.getElementsByTagName('link');

    for (let linkTag of linkTags) {
        if (linkTag.hasAttribute('data-href') && linkTag.hasAttribute('data-folder')) {
            let data_hrefAttribute = linkTag.getAttribute('data-href');
            let data_folderAttribute = linkTag.getAttribute('data-folder');
            linkTag.href = `${routes[data_folderAttribute]}${data_hrefAttribute}`;
        }
    }

    // <img> tag paths
    const imgTags = elementToReplaceIn.getElementsByTagName('img');

    for (let imgTag of imgTags) {
        if (imgTag.hasAttribute('data-src') && imgTag.hasAttribute('data-folder')) {
            let data_srcAttribute = imgTag.getAttribute('data-src');
            let data_folderAttribute = imgTag.getAttribute('data-folder');
            imgTag.src = `${routes[data_folderAttribute]}${data_srcAttribute}`;
        }
    }

    // <script> tag paths
    const scriptTags = elementToReplaceIn.getElementsByTagName('script');

    for (let scriptTag of scriptTags) {
        if (scriptTag.hasAttribute('data-src') && scriptTag.hasAttribute('data-folder')) {
            let data_srcAttribute = scriptTag.getAttribute('data-src');
            let data_folderAttribute = scriptTag.getAttribute('data-folder');
            scriptTag.src = `${routes[data_folderAttribute]}${data_srcAttribute}`;
        }
    }
};

// Request the absolutes routes from the main process
ipcRenderer.send('app:getRoutes');

let routes;

// Gets the absolute routes back from the main process
ipcRenderer.on('app:returnedRoutes', (event, arg) => {
    routes = arg;
    generateAbsoluteRoutes(routes, document);
});
