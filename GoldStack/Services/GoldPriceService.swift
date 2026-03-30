import Foundation

enum Currency: String, CaseIterable, Identifiable {
    case usd = "USD"
    case idr = "IDR"
    case vnd = "VND"
    case thb = "THB"

    var id: String { self.rawValue }

    var symbol: String {
        switch self {
        case .usd: return "$"
        case .idr: return "Rp"
        case .vnd: return "₫"
        case .thb: return "฿"
        }
    }
}

struct GoldPrice: Codable, Identifiable {
    var id = UUID()
    let timestamp: Date
    let pricePerGram: Double
    let currency: String

    enum CodingKeys: String, CodingKey {
        case timestamp = "timestamp"
        case pricePerGram = "price_gram"
        case currency = "currency"
    }
}

enum GoldPriceError: Error {
    case invalidURL
    case invalidResponse
    case networkError(Error)
    case decodingError(Error)
}

actor GoldPriceService {
    private let apiKey: String = "YOUR_GOLD_API_KEY" // Replace with actual key in production

    // Mocked exchange rates for SE Asia currencies
    private let exchangeRates: [Currency: Double] = [
        .usd: 1.0,
        .idr: 15600.0, // 1 USD = 15,600 IDR
        .vnd: 24800.0, // 1 USD = 24,800 VND
        .thb: 36.5     // 1 USD = 36.5 THB
    ]

    // Fetch live gold price (mocked for now)
    func fetchCurrentGoldPrice(currency: Currency = .usd) async throws -> GoldPrice {
        // In a real app, this would make an API call to GoldAPI.io
        // Simulating network delay
        try await Task.sleep(nanoseconds: 1_000_000_000)

        // Mock gold price in USD (price per gram)
        let basePrice = 65.34 // Example: $65.34 per gram in USD

        // Convert to requested currency
        let exchangeRate = exchangeRates[currency] ?? 1.0
        let localPrice = basePrice * exchangeRate

        return GoldPrice(
            timestamp: Date(),
            pricePerGram: localPrice,
            currency: currency.rawValue
        )
    }

    // Calculate gold value based on weight, purity, and current price
    func calculateGoldValue(weightInGrams: Double, purity: Double, currency: Currency = .usd) async throws -> Double {
        let goldPrice = try await fetchCurrentGoldPrice(currency: currency)
        return weightInGrams * (purity / 100.0) * goldPrice.pricePerGram
    }

    // In a real implementation, this would fetch from GoldAPI.io
    private func fetchFromAPI(currency: Currency) async throws -> GoldPrice {
        guard let url = URL(string: "https://www.goldapi.io/api/XAU/\(currency.rawValue)") else {
            throw GoldPriceError.invalidURL
        }

        var request = URLRequest(url: url)
        request.addValue(apiKey, forHTTPHeaderField: "x-access-token")
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")

        do {
            let (data, response) = try await URLSession.shared.data(for: request)

            guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
                throw GoldPriceError.invalidResponse
            }

            do {
                // In reality, you would map the API response to the GoldPrice struct
                // This is just a placeholder for the actual implementation
                let decoder = JSONDecoder()
                let dateFormatter = DateFormatter()
                dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss'Z'"
                decoder.dateDecodingStrategy = .formatted(dateFormatter)

                let goldPrice = try decoder.decode(GoldPrice.self, from: data)
                return goldPrice
            } catch {
                throw GoldPriceError.decodingError(error)
            }
        } catch {
            throw GoldPriceError.networkError(error)
        }
    }
}