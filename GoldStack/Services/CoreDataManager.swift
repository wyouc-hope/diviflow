import Foundation
import CoreData
import SwiftUI

class CoreDataManager {
    static let shared = CoreDataManager()

    private init() {}

    lazy var persistentContainer: NSPersistentContainer = {
        let container = NSPersistentContainer(name: "GoldEntry")
        container.loadPersistentStores { (storeDescription, error) in
            if let error = error as NSError? {
                fatalError("Unresolved error \(error), \(error.userInfo)")
            }
        }
        return container
    }()

    var viewContext: NSManagedObjectContext {
        return persistentContainer.viewContext
    }

    func saveContext() {
        let context = persistentContainer.viewContext
        if context.hasChanges {
            do {
                try context.save()
            } catch {
                let nserror = error as NSError
                fatalError("Unresolved error \(nserror), \(nserror.userInfo)")
            }
        }
    }

    // MARK: - GoldEntry CRUD Operations

    func createGoldEntry(id: UUID = UUID(), timestamp: Date = Date(), weight: Double, purity: Double, type: String, cost: Double) -> GoldEntry {
        let entry = GoldEntry(context: viewContext)
        entry.id = id
        entry.timestamp = timestamp
        entry.weight = weight
        entry.purity = purity
        entry.type = type
        entry.cost = cost

        saveContext()
        return entry
    }

    func fetchGoldEntries() -> [GoldEntry] {
        let request: NSFetchRequest<GoldEntry> = GoldEntry.fetchRequest()
        request.sortDescriptors = [NSSortDescriptor(keyPath: \GoldEntry.timestamp, ascending: false)]

        do {
            return try viewContext.fetch(request)
        } catch {
            print("Error fetching gold entries: \(error)")
            return []
        }
    }

    func updateGoldEntry(_ entry: GoldEntry) {
        saveContext()
    }

    func deleteGoldEntry(_ entry: GoldEntry) {
        viewContext.delete(entry)
        saveContext()
    }

    // Fetch total weight of all gold entries
    func fetchTotalWeight() -> Double {
        let entries = fetchGoldEntries()
        return entries.reduce(0) { $0 + $1.weight }
    }

    // Fetch total value based on current gold price
    func fetchTotalValue(goldPricePerGram: Double) -> Double {
        let entries = fetchGoldEntries()
        return entries.reduce(0) { $0 + ($1.weight * $1.purity * goldPricePerGram) }
    }
}