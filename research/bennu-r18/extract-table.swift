// Extract the numerical text cells, never digitize plot or image pixels.
// Run from this directory: swift -module-cache-path /tmp/ipe-swift-cache extract-table.swift
import Foundation
import PDFKit

let original = URL(fileURLWithPath: "originals/41550_2020_1195_MOESM1_ESM.pdf")
guard let document = PDFDocument(url: original), let page = document.page(at: 11) else {
    fatalError("Original supplement missing: download the URL in provenance.json first")
}
let columns: [(String, Double, Double)] = [
    ("site", 63, 36), ("latitudeDeg", 100, 53), ("longitudeDeg", 155, 64),
    ("longAxisM", 220, 53), ("shortAxisM", 276, 57), ("heightM", 335, 59),
    ("rectangularVolumeM3", 395, 67), ("sphericalVolumeM3", 463, 63),
]
let baselines: [Double] = [664.9, 648.82, 632.98, 616.9, 600.82, 584.98, 568.9]
var rows: [[String: String]] = []
for baseline in baselines {
    var row: [String: String] = [:]
    for (name, x, width) in columns {
        let rect = CGRect(x: x, y: baseline - 0.1, width: width, height: 12.8)
        row[name] = (page.selection(for: rect)?.string ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
    }
    rows.append(row)
}
let output = try JSONSerialization.data(withJSONObject: rows, options: [.prettyPrinted, .sortedKeys])
try output.write(to: URL(fileURLWithPath: "table1-extracted.json"))
print("Extracted \(rows.count) numerical rows from supplement PDF page 12 (printed page 11).")
