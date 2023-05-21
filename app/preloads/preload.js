const { contextBridge, ipcRenderer } = require('electron');

/**
 * Methods and variables exposed to the renderer.
 */
contextBridge.exposeInMainWorld(
    "api",
    {
        send: (name, data) => {
            ipcRenderer.send(name, data);
        },
        receive: (name, func) => {
            ipcRenderer.on(name, (event, ...data) => func(...data));
        }
    });
