# SwiftUI On The Web

A lightweight development server that allows users to write SwiftUI code in the browser and generate real iOS Simulator previews using Xcode and the iOS Simulator.

The project works by taking SwiftUI code from a web client, injecting it into a small SwiftUI host app, building the app using `xcodebuild`, launching it in the iOS Simulator, capturing a screenshot, and returning the preview image back to the browser.

---

# Features

* Write SwiftUI code in the browser
* Generate real SwiftUI previews
* Uses the actual iOS Simulator
* Incremental builds using DerivedData
* Automatically installs and launches updated builds
* Generates screenshot previews
* Simple HTML client. 
* Express.js backend
* Supports automatic simulator boot on startup

---

# How It Works

```text
Browser Client
    ↓
POST /preview
    ↓
Server injects SwiftUI code into ContentView.swift
    ↓
xcodebuild builds PreviewHost
    ↓
Simulator app is installed
    ↓
Simulator app launches
    ↓
simctl captures screenshot
    ↓
Image URL returned to client
```

---

# Requirements

* macOS
* Xcode installed
* Node.js
* Homebrew
* xcodegen

Install xcodegen:

```bash
brew install xcodegen
```

---

# Project Structure

```text
SwiftUIOnTheWeb
├── client
│   └── index.html
├── server
│   └── server.js
├── PreviewHost
│   ├── PreviewHost.xcodeproj
│   └── PreviewHost
│       ├── PreviewHostApp.swift
│       └── ContentView.swift
```

---

# Installing Dependencies

Inside the server folder:

```bash
npm install express cors
```

---

# Running the Server

```bash
node server.js
```

Or using nodemon:

```bash
npx nodemon server.js
```

---

# Booting the Simulator

The server automatically boots the simulator on startup.

Current simulator:

```text
iPhone 17 Pro Max
```

---

# Starting the Client

Open:

```text
client/index.html
```

You can use:

* VSCode Live Server
* Python HTTP server
* Any static file server

Example:

```bash
python3 -m http.server 5500
```

Then open:

```text
http://127.0.0.1:5500
```

---

# API

## POST /preview

Request:

```json
{
  "code": "struct ContentView: View { var body: some View { Text(\"Hello\") } }"
}
```

Response:

```json
{
  "imageUrl": "http://127.0.0.1:3000/previews/preview-12345.png"
}
```

---

# Example SwiftUI Code

```swift
import SwiftUI 

struct ContentView: View {

    var body: some View {
        VStack(spacing: 20) {

            Text("Hello SwiftUI")
                .font(.largeTitle)

            Button("Tap Me") {

            }
        }
        .padding()
    }
}
```

---

# Important Notes

This project uses:

* `xcodebuild`
* `xcrun simctl`
* iOS Simulator

Because of this, the backend must run on macOS.

This will not run on Linux servers or normal VPS hosting providers.

---

# Performance Notes

The simulator preview is not instant like Xcode previews.

Typical flow:

```text
Write code
→ Build app
→ Install app
→ Launch simulator
→ Capture screenshot
→ Return image
```

Preview times usually range from:

```text
2–10 seconds
```

depending on machine speed.

---

# Future Improvements

* WebSocket live updates
* Monaco Editor
* Swift syntax highlighting
* Multiple device support
* Interactive previews
* Preview caching
* Multi-user sessions
* Sandboxed execution
* AI generated SwiftUI

---

# License

MIT License
