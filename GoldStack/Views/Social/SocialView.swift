import SwiftUI

struct SocialView: View {
    // This is a placeholder for the social tab
    // In a real app, this would include features like sharing portfolio insights,
    // comparing with friends, or community insights

    let sampleUsers = [
        "Alex Wong": "3 gold coins, 56g",
        "Sarah Chen": "1 gold bar, 100g",
        "Michael Tan": "5 jewelry pieces, 78g",
        "Lisa Nguyen": "2 gold bars, 250g",
        "David Kim": "10 gold coins, 150g"
    ]

    var body: some View {
        NavigationView {
            ZStack {
                Color(hex: "F0EAD6").opacity(0.6).edgesIgnoringSafeArea(.all)

                VStack {
                    // Disclaimer at the top
                    Text("Social features are for personal comparison only")
                        .font(.caption)
                        .padding()
                        .frame(maxWidth: .infinity)
                        .background(Color.yellow.opacity(0.3))

                    List {
                        Section(header: Text("Community Leaderboard")) {
                            ForEach(Array(sampleUsers.keys.sorted()), id: \.self) { user in
                                HStack {
                                    Text(user)
                                    Spacer()
                                    Text(sampleUsers[user] ?? "")
                                        .foregroundColor(.secondary)
                                }
                            }
                        }

                        Section(header: Text("Connect")) {
                            Button("Find Friends") {
                                // Placeholder for friend-finding functionality
                            }
                            Button("Invite Friends") {
                                // Placeholder for invite functionality
                            }
                        }

                        Section(header: Text("Privacy Settings")) {
                            Toggle("Show my collection", isOn: .constant(false))
                            Toggle("Allow friend requests", isOn: .constant(true))
                        }
                    }
                    .listStyle(InsetGroupedListStyle())

                    // Disclaimer notice at the bottom
                    Text("Note: This app does not share your personal data or actual gold holdings with third parties. All social features are opt-in and can be disabled.")
                        .font(.footnote)
                        .padding()
                        .multilineTextAlignment(.center)
                        .foregroundColor(.secondary)
                }
            }
            .navigationTitle("Social")
        }
    }
}

struct SocialView_Previews: PreviewProvider {
    static var previews: some View {
        SocialView()
    }
}