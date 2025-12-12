"use client"

export default function Categories() {
  const categories = [
    { name: "Painting", icon: "🎨" },
    { name: "Photography", icon: "📸" },
    { name: "Digital Art", icon: "💻" },
    { name: "Sculpture", icon: "🗿" },
    { name: "Illustration", icon: "✏️" },
    { name: "Crafts", icon: "🪡" },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Explore Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="flex flex-col items-center p-4 rounded-lg bg-card border border-border hover:border-primary transition-colors cursor-pointer group"
            >
              <span className="text-3xl mb-2">{cat.icon}</span>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors text-center">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
