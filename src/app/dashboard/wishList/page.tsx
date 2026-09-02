import { ShoppingCart, Trash2, Heart, Zap } from "lucide-react";

const wishlistItems = [
  {
    id: "1",
    name: "Ergonomic Desk Chair",
    price: "$199.00",
    inStock: true,
    category: "Workspace",
    accent: "from-violet-500/20 to-fuchsia-500/10",
  },
  {
    id: "2",
    name: "UltraWide Gaming Monitor",
    price: "$450.00",
    inStock: false,
    category: "Gaming",
    accent: "from-cyan-500/20 to-blue-500/10",
  },
];

export default function WishlistPage() {
  return (
    <div className="min-h-screen space-y-8 bg-background">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Heart className="h-3.5 w-3.5 fill-current" />
            YOUR FAVORITES
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            My Wishlist
            <span className="ml-2 text-primary">.</span>
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            The stuff you’re going to love.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          {wishlistItems.length} saved items
        </div>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
          >
            {/* Glow */}
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            />

            <div className="relative p-4">
              {/* Image */}
              <div className="relative mb-4 flex h-44 items-center justify-center overflow-hidden rounded-xl bg-muted">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

                <span className="text-xs font-medium text-muted-foreground transition-transform duration-500 group-hover:scale-110">
                  Product Image
                </span>

                {/* Wishlist */}
                <button
                  aria-label="Remove from wishlist"
                  className="absolute right-3 top-3 rounded-full border bg-background/80 p-2 backdrop-blur transition-all hover:scale-110 hover:bg-rose-500 hover:text-white"
                >
                  <Heart className="h-4 w-4 fill-rose-500 text-rose-500 hover:fill-white hover:text-white" />
                </button>

                {/* Stock Badge */}
                <div className="absolute left-3 top-3">
                  {item.inStock ? (
                    <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg shadow-emerald-500/20">
                      In Stock
                    </span>
                  ) : (
                    <span className="rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
                      Sold Out
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  {item.category}
                </p>

                <h3 className="text-lg font-bold tracking-tight transition-colors group-hover:text-primary">
                  {item.name}
                </h3>

                <div className="flex items-center justify-between">
                  <p className="text-xl font-black text-primary">
                    {item.price}
                  </p>

                  <span className="text-xs font-medium text-muted-foreground">
                    Free shipping
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex gap-2">
                <button
                  disabled={!item.inStock}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {item.inStock ? "Add to Cart" : "Out of Stock"}
                </button>

                <button
                  aria-label="Delete item"
                  className="rounded-xl border px-3 transition-all hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty/add-more style CTA */}
      <div className="rounded-2xl border border-dashed bg-muted/30 p-6 text-center">
        <p className="font-bold">Got your eye on something else?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep exploring and save your next favorite product.
        </p>

        <button className="mt-4 rounded-xl bg-foreground px-5 py-2.5 text-xs font-bold text-background transition-all hover:scale-105">
          Continue Shopping →
        </button>
      </div>
    </div>
  );
}
