import SwiftUI

struct RecordView: View {
    @StateObject private var vaultViewModel = VaultViewModel()
    @State private var showAddForm = false

    @State private var weight: String = ""
    @State private var purity: String = "99.9"
    @State private var type: String = "Coin"
    @State private var cost: String = ""

    let goldTypes = ["Bar", "Coin", "Jewelry", "Other"]

    var body: some View {
        NavigationView {
            ZStack {
                Color(hex: "F0EAD6").opacity(0.6).edgesIgnoringSafeArea(.all)

                VStack {
                    Form {
                        Section(header: Text("Add New Gold Entry")) {
                            TextField("Weight (grams)", text: $weight)
                                .keyboardType(.decimalPad)

                            TextField("Purity (%)", text: $purity)
                                .keyboardType(.decimalPad)

                            Picker("Gold Type", selection: $type) {
                                ForEach(goldTypes, id: \.self) {
                                    Text($0)
                                }
                            }

                            TextField("Purchase Cost", text: $cost)
                                .keyboardType(.decimalPad)

                            HStack {
                                Spacer()
                                Button("Add Entry") {
                                    addGoldEntry()
                                }
                                .padding()
                                .background(
                                    RoundedRectangle(cornerRadius: 10)
                                        .fill(Color(hex: "F0EAD6"))
                                        .neumorphicStyle()
                                )
                                .foregroundColor(.primary)
                                .disabled(!isFormValid)
                                Spacer()
                            }
                            .padding(.vertical)
                        }

                        // Disclaimer Section
                        Section(header: Text("Disclaimer")) {
                            Text("This app is for personal asset tracking purposes only. Not intended for trading or financial advice.")
                                .font(.footnote)
                                .foregroundColor(.secondary)
                        }
                    }
                }
            }
            .navigationTitle("Record")
        }
    }

    private var isFormValid: Bool {
        guard let weightValue = Double(weight), weightValue > 0 else { return false }
        guard let purityValue = Double(purity), purityValue > 0, purityValue <= 100 else { return false }
        guard let costValue = Double(cost), costValue >= 0 else { return false }
        return true
    }

    private func addGoldEntry() {
        guard let weightValue = Double(weight),
              let purityValue = Double(purity),
              let costValue = Double(cost) else {
            return
        }

        vaultViewModel.addGoldEntry(
            weight: weightValue,
            purity: purityValue,
            type: type,
            cost: costValue
        )

        // Reset form
        weight = ""
        purity = "99.9"
        type = "Coin"
        cost = ""
    }
}

struct RecordView_Previews: PreviewProvider {
    static var previews: some View {
        RecordView()
    }
}