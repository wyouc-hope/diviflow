import SwiftUI

@main
struct GoldStackApp: App {
    // Initialize CoreData manager
    let persistenceController = CoreDataManager.shared

    // Global app disclaimer text
    let disclaimerText = "This app is designed for personal gold asset tracking only and does not facilitate trading or provide financial advice."

    var body: some Scene {
        WindowGroup {
            MainTabView()
                // Inject the managed object context into the SwiftUI environment
                .environment(\.managedObjectContext, persistenceController.viewContext)
                // Apply global app styling
                .preferredColorScheme(.light) // The neumorphic design works better in light mode
                .accentColor(Color(hex: "B8860B")) // Dark gold accent color
                // Global modifier for accessibility and design consistency
                .onAppear {
                    // Set global appearance for UIKit elements
                    setGlobalAppearance()

                    // Log app launch for analytics (in a real app)
                    print("GoldStack app launched")
                    print("Disclaimer: \(disclaimerText)")
                }
        }
    }

    private func setGlobalAppearance() {
        // Set navigation bar appearance
        UINavigationBar.appearance().largeTitleTextAttributes = [
            .foregroundColor: UIColor(Color(hex: "B8860B"))
        ]

        UINavigationBar.appearance().titleTextAttributes = [
            .foregroundColor: UIColor(Color(hex: "B8860B"))
        ]

        // Set tab bar appearance
        UITabBar.appearance().unselectedItemTintColor = .gray
        UITabBar.appearance().tintColor = UIColor(Color(hex: "B8860B"))

        // Set table view appearance
        UITableView.appearance().backgroundColor = .clear

        // In a real app, we would also set other global UI properties here
    }
}

// MARK: - Constants

struct AppConstants {
    // Global disclaimer that can be shown on every input screen
    static let disclaimer = "This app is for personal asset tracking purposes only. Not intended for trading or financial advice."

    // App theme colors
    struct Colors {
        static let background = Color(hex: "F0EAD6") // Light gold background
        static let accent = Color(hex: "B8860B") // Dark gold accent
        static let text = Color(hex: "5D4037") // Brown text color
    }

    // Default currency
    static let defaultCurrency: Currency = .usd
}