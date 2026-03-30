import SwiftUI

struct MainTabView: View {
    @State private var selectedTab = 0
    private let disclaimerText = "This app is for personal asset tracking only and does not facilitate trading."

    var body: some View {
        TabView(selection: $selectedTab) {
            VaultView()
                .tabItem {
                    Label("Vault", systemImage: "shield.lefthalf.filled")
                }
                .tag(0)

            RecordView()
                .tabItem {
                    Label("Record", systemImage: "plus.circle")
                }
                .tag(1)

            SocialView()
                .tabItem {
                    Label("Social", systemImage: "person.2")
                }
                .tag(2)

            MarketView()
                .tabItem {
                    Label("Market", systemImage: "chart.line.uptrend.xyaxis")
                }
                .tag(3)
        }
        .accentColor(Color(hex: "B8860B")) // Dark gold color for selected tab
        .onAppear {
            // Global disclaimer notice when app starts
            showDisclaimerIfNeeded()
        }
    }

    private func showDisclaimerIfNeeded() {
        // In a real app, this would check if the user has already seen the disclaimer
        let hasSeenDisclaimer = UserDefaults.standard.bool(forKey: "hasSeenDisclaimer")

        if !hasSeenDisclaimer {
            // In a real app, this would show a modal disclaimer
            print("Showing disclaimer: \(disclaimerText)")

            // Mark as seen (in a real app, this would be called after user accepts)
            UserDefaults.standard.set(true, forKey: "hasSeenDisclaimer")
        }
    }
}

struct MainTabView_Previews: PreviewProvider {
    static var previews: some View {
        MainTabView()
    }
}