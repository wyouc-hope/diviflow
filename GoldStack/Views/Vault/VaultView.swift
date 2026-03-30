import SwiftUI

struct VaultView: View {
    @StateObject private var viewModel = VaultViewModel()

    var body: some View {
        NavigationView {
            ZStack {
                Color(hex: "F0EAD6").opacity(0.6).edgesIgnoringSafeArea(.all)

                VStack(spacing: 20) {
                    // Summary Card
                    VStack {
                        Text("Gold Assets")
                            .font(.title2)
                            .fontWeight(.bold)
                            .padding(.top)

                        HStack(spacing: 20) {
                            VStack {
                                Text("Total Weight")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                                Text(viewModel.formattedTotalWeight)
                                    .font(.title3)
                                    .fontWeight(.semibold)
                            }
                            .padding()
                            .neumorphicStyle()

                            VStack {
                                Text("Total Value")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                                if viewModel.isLoading {
                                    ProgressView()
                                } else {
                                    Text(viewModel.formattedTotalValue)
                                        .font(.title3)
                                        .fontWeight(.semibold)
                                }
                            }
                            .padding()
                            .neumorphicStyle()
                        }

                        // Currency picker
                        Picker("Currency", selection: $viewModel.selectedCurrency) {
                            ForEach(Currency.allCases) { currency in
                                Text(currency.rawValue).tag(currency)
                            }
                        }
                        .pickerStyle(SegmentedPickerStyle())
                        .padding()
                        .onChange(of: viewModel.selectedCurrency) { _ in
                            viewModel.fetchTotalValue()
                        }
                    }
                    .padding()
                    .neumorphicStyle()

                    // Gold entries list
                    List {
                        ForEach(viewModel.goldEntries) { entry in
                            NavigationLink(destination: Text("Gold Entry Detail")) {
                                HStack {
                                    VStack(alignment: .leading) {
                                        Text(entry.type ?? "Unknown")
                                            .font(.headline)
                                        Text("Purity: \(Int(entry.purity))%")
                                            .font(.subheadline)
                                            .foregroundColor(.secondary)
                                    }

                                    Spacer()

                                    VStack(alignment: .trailing) {
                                        Text("\(String(format: "%.2f", entry.weight)) g")
                                            .font(.headline)
                                        Text(entry.timestamp?.formatted(date: .abbreviated, time: .omitted) ?? "")
                                            .font(.caption)
                                            .foregroundColor(.secondary)
                                    }
                                }
                                .padding(.vertical, 8)
                            }
                        }
                        .onDelete(perform: deleteEntries)
                    }
                    .listStyle(PlainListStyle())
                    .background(Color.clear)
                }
                .padding()
            }
            .navigationTitle("Vault")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        // Add new gold entry (to be implemented)
                    }) {
                        Image(systemName: "plus")
                    }
                }
            }
        }
        .onAppear {
            viewModel.loadGoldEntries()
        }
    }

    private func deleteEntries(offsets: IndexSet) {
        offsets.forEach { index in
            let entry = viewModel.goldEntries[index]
            viewModel.deleteGoldEntry(entry)
        }
    }
}

struct VaultView_Previews: PreviewProvider {
    static var previews: some View {
        VaultView()
    }
}