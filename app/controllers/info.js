// Loads the corresponding template
loadDynamicCSS('info');
loadView('info');

generateAbsoluteRoutes(routes, pageContentElem);

// Self-invoked function to keep the the variables and the functions in a local scope
(() => {

    const { shell } = require('electron');

    /* Operation */
    pageContentElem.addEventListener('click', (event) => {
        if (event.target.localName === 'a') {
            event.preventDefault();

            shell.openExternal(event.target.href);
        }
    });

})();
