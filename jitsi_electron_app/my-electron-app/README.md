# My Electron App

This is a simple Electron application that opens the URL http://localhost:3000.

## Setup

To set up and run this application, you will need to have Node.js and npm installed on your machine.

1. Clone this repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install the project dependencies.
4. Run `npm start` to start the Electron application.

## Structure

The application consists of the following files:

- `src/main.js`: This is the main Electron process. It creates a new BrowserWindow instance and loads the HTML file. It also handles system events.
- `src/renderer.js`: This is the renderer process for Electron. It runs in the context of the BrowserWindow and performs tasks related to the web page like user interactions and rendering.
- `package.json`: This is the configuration file for npm. It lists the dependencies and scripts for the project. It also contains the main entry point for the Electron app.
- `index.html`: This is the HTML file that is loaded into the BrowserWindow. It links to the renderer.js file and contains the structure of the web page.

## Usage

Once you've started the application, it will open a new window in your default web browser and navigate to http://localhost:3000.