/*jslint node: true */
/*jslint esversion: 6 */
const electron = require("electron");
const app = electron.app; // a life cycle module
const BrowserWindow = electron.BrowserWindow; // a browser window module
const path = require("path");
// sending bugs to Electron project.
electron.crashReporter.start({
	productName : "mytushino",
	companyName : "mytushino.github.io",
	submitURL : "https://github.com/mytushino/mytushino.github.io/issues",
	autoSubmit : true
});
// a global link
// the window will close once the JS object is cleared
var mainWindow = null;
// check if all the app’s windows are closed and shut down the app
app.on("window-all-closed", function () {
	// in OS X stay active until Cmd + Q is pressed
	if (process.platform !== "darwin") {
		app.quit();
	}
});
// called when Electron inits and is ready to create a browser window
app.on("ready", function () {
	// create the window
	mainWindow = new BrowserWindow({
			width : 844,
			height : 640,
			icon : "favicon.ico",
			title : "Услуги в Тушино"
		});
	// load index.html
	/* mainWindow.loadURL("file://" + __dirname + "/index.html"); */
	mainWindow.loadURL(path.join("file://", __dirname, "/index.html"));
	// open DevTools.
	// mainWindow.webContents.openDevTools();
	// gets executed when window close event is generated
	mainWindow.on("closed", function () {
		// remove the link to the window
		mainWindow = null;
	});
});
