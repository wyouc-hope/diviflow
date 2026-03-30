import SwiftUI
import Charts

struct GoldPricePoint: Identifiable {
    var id = UUID()
    var date: Date
    var price: Double
}

struct MarketView: View {
    @StateObject private var goldPriceService = GoldPriceService()
    @State private var selectedCurrency: Currency = .usd
    @State private var currentGoldPrice: Double = 0.0
    @State private var isLoading = true
    @State private var errorMessage: String? = nil

    // Mock historical data for the chart
    let mockHistoricalData: [GoldPricePoint] = [
        GoldPricePoint(date: Calendar.current.date(byAdding: .day, value: -30, to: Date()) ?? Date(), price: 59.88),
        GoldPricePoint(date: Calendar.current.date(byAdding: .day, value: -25, to: Date()) ?? Date(), price: 61.22),
        GoldPricePoint(date: Calendar.current.date(byAdding: .day, value: -20, to: Date()) ?? Date(), price: 62.47),
        GoldPricePoint(date: Calendar.current.date(byAdding: .day, value: -15, to: Date()) ?? Date(), price: 63.85),
        GoldPricePoint(date: Calendar.current.date(byAdding: .day, value: -10, to: Date()) ?? Date(), price: 64.26),
        GoldPricePoint(date: Calendar.current.date(byAdding: .day, value: -5, to: Date()) ?? Date(), price: 63.92),
        GoldPricePoint(date: Date(), price: 65.34)
    ]

    var body: some View {
        NavigationView {
            ZStack {
                Color(hex: "F0EAD6").opacity(0.6).edgesIgnoringSafeArea(.all)

                ScrollView {
                    VStack(spacing: 20) {
                        // Current Gold Price Card
                        VStack {
                            Text("Current Gold Price")
                                .font(.headline)
                                .padding(.top)

                            if isLoading {
                                ProgressView()
                                    .padding()
                            } else if let error = errorMessage {
                                Text(error)
                                    .foregroundColor(.red)
                                    .padding()
                            } else {
                                Text("\(selectedCurrency.symbol) \(String(format: "%.2f", currentGoldPrice))")
                                    .font(.system(size: 36, weight: .bold))
                                    .padding()

                                Text("per gram")
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)

                                Text("Last updated: \(Date().formatted(date: .abbreviated, time: .shortened))")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                                    .padding(.bottom)
                            }

                            // Currency picker
                            Picker("Currency", selection: $selectedCurrency) {
                                ForEach(Currency.allCases) { currency in
                                    Text(currency.rawValue).tag(currency)
                                }
                            }
                            .pickerStyle(SegmentedPickerStyle())
                            .padding()
                            .onChange(of: selectedCurrency) { _ in
                                fetchCurrentPrice()
                            }
                        }
                        .padding()
                        .neumorphicStyle()

                        // Chart
                        VStack(alignment: .leading) {
                            Text("30 Day Price Trend")
                                .font(.headline)
                                .padding(.leading)

                            if #available(iOS 16.0, *) {
                                // Use Swift Charts if available
                                Chart {
                                    ForEach(mockHistoricalData) { dataPoint in
                                        LineMark(
                                            x: .value("Date", dataPoint.date),
                                            y: .value("Price", dataPoint.price * (selectedCurrency == .usd ? 1 : getExchangeRate(for: selectedCurrency)))
                                        )
                                        .foregroundStyle(Color.orange.gradient)
                                    }

                                    ForEach(mockHistoricalData) { dataPoint in
                                        PointMark(
                                            x: .value("Date", dataPoint.date),
                                            y: .value("Price", dataPoint.price * (selectedCurrency == .usd ? 1 : getExchangeRate(for: selectedCurrency)))
                                        )
                                        .foregroundStyle(Color.orange)
                                    }
                                }
                                .frame(height: 250)
                                .padding()
                            } else {
                                // Fallback for older iOS versions
                                Text("Chart available in iOS 16+")
                                    .frame(height: 250)
                                    .frame(maxWidth: .infinity)
                                    .background(Color.secondary.opacity(0.1))
                                    .cornerRadius(10)
                                    .padding()
                            }
                        }
                        .padding()
                        .neumorphicStyle()

                        // Market News
                        VStack(alignment: .leading, spacing: 15) {
                            Text("Market News")
                                .font(.headline)
                                .padding(.top)

                            // Sample news items
                            ForEach(1...3, id: \.self) { _ in
                                marketNewsItem()
                            }
                        }
                        .padding()
                        .neumorphicStyle()

                        // Disclaimer
                        Text("Disclaimer: All market data is for informational purposes only. This app does not provide financial advice or trading services.")
                            .font(.caption2)
                            .multilineTextAlignment(.center)
                            .foregroundColor(.secondary)
                            .padding()
                    }
                    .padding()
                }
            }
            .navigationTitle("Market")
            .onAppear {
                fetchCurrentPrice()
            }
        }
    }

    private func marketNewsItem() -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Gold prices rise on global uncertainty")
                .font(.headline)

            Text("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.")
                .font(.subheadline)
                .foregroundColor(.secondary)

            Text("Source: Gold News Daily • 2h ago")
                .font(.caption)
                .foregroundColor(.secondary)

            Divider()
        }
    }

    private func fetchCurrentPrice() {
        isLoading = true
        errorMessage = nil

        Task {
            do {
                let goldPrice = try await goldPriceService.fetchCurrentGoldPrice(currency: selectedCurrency)
                await MainActor.run {
                    self.currentGoldPrice = goldPrice.pricePerGram
                    self.isLoading = false
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = "Failed to fetch gold price"
                    self.isLoading = false
                }
            }
        }
    }

    // Mock exchange rates for chart display
    private func getExchangeRate(for currency: Currency) -> Double {
        switch currency {
        case .usd: return 1.0
        case .idr: return 15600.0
        case .vnd: return 24800.0
        case .thb: return 36.5
        }
    }
}

struct MarketView_Previews: PreviewProvider {
    static var previews: some View {
        MarketView()
    }
}