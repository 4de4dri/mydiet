const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { DB } = require(path.join(__dirname, './utils/db'));
const db = new DB();

/**
 * Start of the application.
 */
app.whenReady().then(() => {
    // *** TEMPORAL *** => Directly open the home screen for design and functionality.
    createHomeView({
        AGE: 1,
        HEIGHT: 1,
        ID: 10,
        PASSWORD: "root",
        USERNAME: "root",
        WEIGHT: 1
    });
    // TODO: Delete it when you have finished developing the home screen.
    // createMainView();

    // TODO: Delete it whet you have finished developing the food view.
    // createFoodView(new BrowserWindow({}));
});

/**
 * Principal view.
 */
function createMainView() {
    let winPrincipal = new BrowserWindow({
        width: 600,
        height: 500,
        resizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, "./preloads/preload.js"),
            sandbox: false // This way you can import modules into the preloads.
        }
    });
    winPrincipal.loadFile('app/views/pages/main.html');

    // Listen to the login call.
    ipcMain.on("login", (event, data) => {
        db.getUser(data, (res) => { // Search the database to see if the credentials exist.
            if (res.length === 0) {
                winPrincipal.webContents.send('failLogin', 'Datos incorrectos'); // Send the message to the preload.
                return;
            }

            // If the credentials are found, the main window closes and the home window opens.
            winPrincipal.close();
            createHomeView(res);
        });
    });

    // Listen to the call register.
    ipcMain.on('register', (event, data) => {
        db.insertUser(data, (res) => { // Insert the new user and his data.
            if (res[0] === 'error') {
                winPrincipal.webContents.send('failRegister', res[1]);
            }
            if (res[0] === 'success') {
                winPrincipal.webContents.send('successRegister', res[1]);
            }
        });
    });
}

/**
 * Home view.
 */
function createHomeView(userData) {
    let winHome = new BrowserWindow({
        width: 1130,
        height: 870,
        resizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, "./preloads/preload.js"),
            sandbox: false // This way you can import moduls into of the preloads.
        }
    });

    winHome.loadFile('app/views/pages/home.html').then(() => {
        // The user data is sent to the preload to be received from the renderer.
        winHome.webContents.send('userData', userData);
    });

    // Listen to the open-food call.
    ipcMain.on('open-food', (event, data) => {
        createFoodView(winHome);
    });
}

/**
 * Food view.
 */
function createFoodView(winHome) {
    let winFood = new BrowserWindow({
        width: 720,
        height: 700,
        resizable: true,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, "./preloads/preload.js"),
            sandbox: false // This way you can import moduls into of the preloads.
        }
    });
    winFood.loadFile('app/views/pages/food.html');

    // The food button in the Home view is disabled.
    winHome.webContents.send('stateFoodButton', true);
    // When food view is closed, the food button is enabled.
    winFood.on('closed', () => {
        winFood = null;
        winHome.setEnabled(true);
        winHome.focus();
        winHome.webContents.send('stateFoodButton', false);
    });
}
