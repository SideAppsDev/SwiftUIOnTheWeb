
# SwiftUI On The Web

A lightweight development server that allows users to write SwiftUI code in the browser and generate real iOS Simulator previews using Xcode and the iOS Simulator.

Unlike mock renderers or syntax based previews, this project uses the real SwiftUI rendering engine through the iOS Simulator.

The project works by taking SwiftUI code from a web client, injecting it into a small SwiftUI host app, building the app using `xcodebuild`, launching it in the iOS Simulator, capturing a screenshot, and returning the preview image back to the browser.

---

## Demo Video

[![Watch the video](https://img.youtube.com/vi/zAtyGYQqXGk/maxresdefault.jpg)](https://www.youtube.com/watch?v=zAtyGYQqXGk)

---

## Features

* Write SwiftUI code in the browser
* Generate real SwiftUI previews
* Uses the actual iOS Simulator
* Incremental builds using DerivedData
* Automatically installs and launches updated builds
* Generates screenshot previews
* Simple HTML client
* Express.js backend
* Supports automatic simulator boot on startup

---

## How It Works

```text
Browser Client
    ↓
POST /api/preview
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
````

---

## Requirements

* macOS
* Xcode installed
* Node.js
* Homebrew
* xcodegen

---

## Project Structure

```text
SwiftUIOnTheWeb
├── client
│   └── index.html
├── server
│   └── app.js
├── PreviewHost
│   ├── PreviewHost.xcodeproj
│   └── PreviewHost
│       ├── PreviewHostApp.swift
│       └── ContentView.swift
```

---

## What Is PreviewHost?

`PreviewHost` is a small native SwiftUI application used as the rendering engine for browser previews.

The server dynamically writes incoming SwiftUI code into `ContentView.swift` inside the `PreviewHost` project. The app is then rebuilt using `xcodebuild`, installed into the iOS Simulator, launched, and captured as a screenshot using `simctl`.

Because the project uses a real SwiftUI application running inside the actual iOS Simulator, the previews are rendered using the real SwiftUI rendering engine rather than a mock renderer or custom parser.

The `PreviewHost` project is intentionally minimal and exists only to host dynamically generated SwiftUI views.


## Installing Dependencies

Inside the server folder:

```bash
npm install express cors
```

---

## Running the Server

```bash
npm start
```

Or directly:

```bash
node app.js
```

Or using nodemon:

```bash
npx nodemon app.js
```

---

## Booting the Simulator

The server automatically boots the simulator on startup.

Current simulator:

```text
iPhone 17 Pro Max
```

---

## Starting the Client

Open:

```text
client/index.html
```

You can use VSCode Live Server or any static file server.

---

## API

### POST /api/preview

Request:

```json
{
  "code": "import SwiftUI\n\nstruct ContentView: View { var body: some View { Text(\"Hello\") } }"
}
```

Response:

```json
{
  "imageUrl": "http://127.0.0.1:8080/previews/preview.png"
}
```

---

## Example SwiftUI Code

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

## Important Notes

This project uses:

* `xcodebuild`
* `xcrun simctl`
* iOS Simulator

Because of this, the backend must run on macOS.

This will not run on Linux servers or normal VPS hosting providers.

---

## Performance Notes

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

## Future Improvements

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

## License

MIT License

---

## Support My Work

If this project helped you, consider supporting my work by checking out my book:

**SwiftUI Architecture: Patterns and Practices for Building Scalable Applications**

👉 [https://azamsharp.school/swiftui-architecture-book.html](https://azamsharp.school/swiftui-architecture-book.html)
