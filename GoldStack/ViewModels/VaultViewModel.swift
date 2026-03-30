import Foundation
import Combine
import SwiftUI

class VaultViewModel: ObservableObject {
    private let coreDataManager = CoreDataManager.shared
    private let goldPriceService = GoldPriceService()

    @Published var goldEntries: [GoldEntry] = []
    @Published var totalWeight: Double = 0.0
    @Published var totalValue: Double = 0.0
    @Published var isLoading: Bool = false
    @Published var errorMessage: String? = nil
    @Published var selectedCurrency: Currency = .usd

    var formattedTotalWeight: String {
        return String(format: "%.2f", totalWeight) + " g"
    }

    var formattedTotalValue: String {
        return selectedCurrency.symbol + String(format: "%.2f", totalValue)
    }

    // Fetch all gold entries from CoreData
    func loadGoldEntries() {
        goldEntries = coreDataManager.fetchGoldEntries()
        calculateTotals()
    }

    // Add a new gold entry
    func addGoldEntry(weight: Double, purity: Double, type: String, cost: Double) {
        let _ = coreDataManager.createGoldEntry(
            weight: weight,
            purity: purity,
            type: type,
            cost: cost
        )
        loadGoldEntries()
    }

    // Update an existing gold entry
    func updateGoldEntry(_ entry: GoldEntry) {
        coreDataManager.updateGoldEntry(entry)
        loadGoldEntries()
    }

    // Delete a gold entry
    func deleteGoldEntry(_ entry: GoldEntry) {
        coreDataManager.deleteGoldEntry(entry)
        loadGoldEntries()
    }

    // Calculate totals (weight and value)
    func calculateTotals() {
        totalWeight = goldEntries.reduce(0) { $0 + $1.weight }
        fetchTotalValue()
    }

    // Fetch current gold price and calculate total value
    func fetchTotalValue() {
        isLoading = true
        errorMessage = nil

        Task {
            do {
                // Get the current gold price per gram
                let goldPrice = try await goldPriceService.fetchCurrentGoldPrice(currency: selectedCurrency)

                // Calculate total value based on weight, purity, and current price
                let value = goldEntries.reduce(0.0) { total, entry in
                    return total + (entry.weight * (entry.purity / 100.0) * goldPrice.pricePerGram)
                }

                // Update UI on the main thread
                await MainActor.run {
                    self.totalValue = value
                    self.isLoading = false
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = "Failed to fetch gold price: \(error.localizedDescription)"
                    self.isLoading = false
                }
            }
        }
    }

    // Change the selected currency and update value
    func changeCurrency(_ currency: Currency) {
        selectedCurrency = currency
        fetchTotalValue()
    }
}