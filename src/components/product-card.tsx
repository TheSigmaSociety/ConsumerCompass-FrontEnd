"use client"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { Product } from "@/data/sample-products"

export default function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center p-4">
        <img src={product.image || "/placeholder.svg"} alt={product.name} className="max-h-full w-auto" />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div>
          <div className="flex items-center mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.holisticRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : i < product.holisticRating
                        ? "text-yellow-400 fill-yellow-400 opacity-50"
                        : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">{product.holisticRating.toFixed(1)}</span>
          </div>

          <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{product.name}</h3>

          <div className="flex gap-2 mb-3">
            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs text-slate-700 dark:text-slate-300">
              {product.brand}
            </span>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{product.description}</p>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-lg font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Scanned: {new Date(product.scannedDate).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  )
}
