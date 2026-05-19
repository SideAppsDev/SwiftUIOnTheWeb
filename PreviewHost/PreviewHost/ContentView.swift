import SwiftUI 

struct ContentView: View {

    var body: some View {
        VStack(spacing: 20) {
            Text("Hello SwiftUI")
                .font(.largeTitle)

            Button("Tap Me") {
                print("Tapped")
            }
        }
        .padding()
    }
}