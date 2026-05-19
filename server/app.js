const express = require('express');
const { execFile } = require('child_process');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors');
const util = require('util')

// CONSTANTS 
const PORT = 8080 
const SIMULATOR_NAME = 'iPhone 17 Pro Max';
const PROJECT_PATH = '/Users/azamsharp/Desktop/SwiftOnBrowser/PreviewHost';
const XCODE_PROJECT_PATH = `${PROJECT_PATH}/PreviewHost.xcodeproj`;
const SCREENSHOT_DIR = path.join(__dirname, "screenshots");
const CONTENT_VIEW_PATH = `${PROJECT_PATH}/PreviewHost/ContentView.swift`;
const BUNDLE_ID = 'com.azamsharp.PreviewHost';
const DERIVED_DATA_PATH = `${PROJECT_PATH}/DerivedData`;
const BUILT_APP_PATH = `${DERIVED_DATA_PATH}/Build/Products/Debug-iphonesimulator/PreviewHost.app`;

const execFileAsync = util.promisify(execFile);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/previews", express.static(SCREENSHOT_DIR));

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run(command, args) {
    const { stdout } = await execFileAsync(command, args);
    return stdout;
}

async function startup() {

    // create the screenshots folder 
    await fs.mkdir(SCREENSHOT_DIR, { recursive: true })

    bootSimulator()
    ensurePreviewHostExists()
}

async function ensurePreviewHostExists() {
    try {
        fs.access(XCODE_PROJECT_PATH)
        fs.access(CONTENT_VIEW_PATH)
    } catch {
        throw new Error(
            `PreviewHost project was not found at ${PROJECT_PATH}. Create the Xcode project once before starting the server.`
        );
    }

}

async function bootSimulator() {
    console.log(`Booting simulator: ${SIMULATOR_NAME}`);
    try {
        await run('xcrun', ['simctl', 'boot', SIMULATOR_NAME])
        console.log("Simulator booted.");
        await run("open", ["-a", "Simulator"]);
        console.log("Simulator app is opened.");

    } catch (error) {
        console.log('Unable to boot the simulator. Please check if it is already booted.')
    }
}

async function terminatePreviewHost() {
    try {
        await run("xcrun", [
            "simctl",
            "terminate",
            "booted",
            BUNDLE_ID
        ]);
    } catch { }

}

async function buildPreviewHost() {
  await run("xcodebuild", [
    "-project",
    XCODE_PROJECT_PATH,
    "-scheme",
    "PreviewHost",
    "-destination",
    `platform=iOS Simulator,name=${SIMULATOR_NAME}`,
    "-derivedDataPath",
    DERIVED_DATA_PATH,
    "build"
  ]);
}

async function installPreviewHost() {

    await run("xcrun", [
        "simctl",
        "install",
        "booted",
        BUILT_APP_PATH
    ]);
}

async function launchPreviewHost() {
    await run("xcrun", [
        "simctl",
        "launch",
        "booted",
        BUNDLE_ID
    ]);
}

async function captureScreenshot(screenshotPath) {
    await run("xcrun", [
        "simctl",
        "io",
        "booted",
        "screenshot",
        screenshotPath
    ]);
}

app.post('/api/preview', async (req, res) => {

    const code = req.body.code

    if (!code) {
        return res.status(400).json({
            error: 'Missing code property in request body.'
        })
    }

    // write code to the preview host ContentView file 
    try {
        await fs.writeFile(CONTENT_VIEW_PATH, code)
        console.log("Building preview app...")
        await buildPreviewHost()
        console.log("Terminating old app...");
        await terminatePreviewHost()
        console.log("Installing updated app...");
        await installPreviewHost()
        console.log("Launching app...");
        await launchPreviewHost()
        await delay(1000);

        const filename = `preview.png`

        const screenshotPath = path.join(
            SCREENSHOT_DIR,
            filename
        )

        console.log('Taking screenshot...')
        await captureScreenshot(screenshotPath)

        await fs.access(screenshotPath)

        const imageUrl =
            `http://127.0.0.1:${PORT}/previews/${filename}`;

        console.log("Preview created:", imageUrl);

        res.json({
            imageUrl
        });

    } catch (error) {
        console.error(error)
        res.status(400).json({
            error: String(error)
        });
    }
})

app.listen(PORT, async () => {
    console.log('Server is running...')
    startup()
})

