import SwiftUI

struct NeumorphicStyle: ViewModifier {
    var color: Color = Color(hex: "F0EAD6")
    var cornerRadius: CGFloat = 10
    var shadowRadius: CGFloat = 5

    func body(content: Content) -> some View {
        content
            .background(
                ZStack {
                    RoundedRectangle(cornerRadius: cornerRadius)
                        .fill(color)
                        .shadow(color: Color.black.opacity(0.2), radius: shadowRadius, x: shadowRadius, y: shadowRadius)

                    RoundedRectangle(cornerRadius: cornerRadius)
                        .fill(color)
                        .shadow(color: Color.white.opacity(0.7), radius: shadowRadius, x: -shadowRadius, y: -shadowRadius)

                    RoundedRectangle(cornerRadius: cornerRadius)
                        .fill(color)
                }
            )
    }
}

struct NeumorphicPressedStyle: ViewModifier {
    var color: Color = Color(hex: "F0EAD6")
    var cornerRadius: CGFloat = 10
    var shadowRadius: CGFloat = 5

    func body(content: Content) -> some View {
        content
            .background(
                ZStack {
                    RoundedRectangle(cornerRadius: cornerRadius)
                        .fill(color)
                        .shadow(color: Color.white.opacity(0.7), radius: shadowRadius, x: shadowRadius, y: shadowRadius)
                        .blur(radius: 1)

                    RoundedRectangle(cornerRadius: cornerRadius)
                        .fill(color)
                        .shadow(color: Color.black.opacity(0.2), radius: shadowRadius, x: -shadowRadius, y: -shadowRadius)
                        .blur(radius: 1)

                    RoundedRectangle(cornerRadius: cornerRadius)
                        .fill(color)
                }
            )
    }
}

extension View {
    func neumorphicStyle(color: Color = Color(hex: "F0EAD6"), cornerRadius: CGFloat = 10, shadowRadius: CGFloat = 5) -> some View {
        self.modifier(NeumorphicStyle(color: color, cornerRadius: cornerRadius, shadowRadius: shadowRadius))
    }

    func neumorphicPressedStyle(color: Color = Color(hex: "F0EAD6"), cornerRadius: CGFloat = 10, shadowRadius: CGFloat = 5) -> some View {
        self.modifier(NeumorphicPressedStyle(color: color, cornerRadius: cornerRadius, shadowRadius: shadowRadius))
    }
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}