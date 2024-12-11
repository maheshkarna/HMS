const { app, BrowserWindow, Menu } = require("electron");
const httpServerObj = require("./httpserver.js");
const path = require("path");
const busboy = require("connect-busboy");
const form = require("connect-form");


app.disableHardwareAcceleration();
app.commandLine.appendSwitch("enable-features", "ElectronSerialChooser");
// app.use(busboy());

app.whenReady().then(() => {
  console.log(app.getPath("userData"));
 // Menu.setApplicationMenu(null);

  createHttpServer();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createHttpServer();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

function createHttpServer() {
  httpServerObj.httpserver.intialize();
  httpServerObj.httpserver.intializeSocket();
  createWindow();
}

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // movable: false,
    // resizable: false,
    // maximizable: false,
    // minimizable: false,
    // titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // win.webContents.openDevTools();
  // win.loadFile("./www/index.html");
  win.maximize();
  win.loadURL("http://localhost:8686");

  // win.webContents.session.on(
  //   "select-serial-port",
  //   (event, portList, webContents, callback) => {
  //     event.preventDefault();
  //     callback(portList[0].portId);
  //   }
  // );

  // const portSelected = await win.webContents.executeJavaScript(
  //   "navigator.serial.requestPort().then(port => port.toString()).catch(err => err.toString());",
  //   true
  // );
  // win.webContents.executeJavaScript("alert('Got port')");
};
