"use client"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import Image from "next/image"
import { Product } from "@/data/product"

export default function ProductCard({ product, isLoading = false }: { product: Product, isLoading?: boolean }) {
  if (isLoading) {
    return (
      <motion.div
        className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
      >
        <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center p-4">
          <div className="w-full h-32 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse"></div>
        </div>

        <div className="p-6 flex flex-col flex-1">
          <div>
            <div className="flex items-center mb-3">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                ))}
              </div>
              <div className="ml-2 h-4 w-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>

            <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2 animate-pulse"></div>

            <div className="flex gap-2 mb-3">
              <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center p-4">
        <img 
          src={product.image || "/placeholder.svg"} 
          alt={product.name} 
          width={200} 
          height={150}
          className="max-h-full w-auto" 
          style={{ objectFit: "contain" }}
        />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div>
          <div className="flex items-center mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.holisticRating || 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : i < (product.holisticRating || 0)
                        ? "text-yellow-400 fill-yellow-400 opacity-50"
                        : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
              {product.holisticRating !== null && product.holisticRating !== undefined 
                ? product.holisticRating.toFixed(1) 
                : 'N/A'}
            </span>
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
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {(() => {
              const price = product.rawPrice || product.priceValue || product.price;
              return price !== null && price !== undefined 
                ? `$${price.toFixed(2)}` 
                : 'Price unavailable';
            })()}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {product.scannedDate ? `Scanned: ${new Date(product.scannedDate).toLocaleDateString()}` : "Recently added"}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
