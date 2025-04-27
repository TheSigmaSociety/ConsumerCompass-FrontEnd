"use client"
import { motion } from "framer-motion"
import { Star, TrendingUp, Leaf, Apple } from "lucide-react"
import Image from "next/image"
import { Product } from "@/data/sample-products"

export default function FeaturedProductCard({ product }: { product: Product }) {
  return (
    <motion.div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="flex items-center mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.holisticRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : i < product.holisticRating
                        ? "text-yellow-400 fill-yellow-400 opacity-50"
                        : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-slate-700 dark:text-slate-300 font-medium">{product.holisticRating.toFixed(1)}</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold mb-3 text-slate-900 dark:text-white">{product.name}</h3>

          <div className="flex flex-wrap gap-3 mb-4">
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm text-slate-700 dark:text-slate-300">
              {product.brand}
            </span>
          </div>

          <p className="text-slate-600 dark:text-slate-400 mb-6">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <Leaf className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <div className="text-sm text-slate-600 dark:text-slate-400te">Sustainability</div>
                <div className="font-semibold text-white">{product.sustainabilityScore.toFixed(1)}/5.0</div>
              </div>
            </div>
            
            {product.nutritionValue > 0 && (
              <div className="flex items-center">
                <Apple className="h-5 w-5 text-red-500 mr-2" />
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Nutrition</div>
                  <div className="font-semibold text-white">{product.nutritionValue.toFixed(1)}/5.0</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
            <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="h-5 w-5 mr-1" />
              <span>Trending</span>
            </div>
          </div>
          
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Scanned: {new Date(product.scannedDate).toLocaleDateString()}
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/20 dark:to-indigo-900/20 p-8 flex items-center justify-center">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={400}
              height={300}
              className="rounded-lg shadow-lg"
              style={{ objectFit: "contain" }}
            />
        </div>
      </div>
    </motion.div>
  )
}
