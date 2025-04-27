"use client"
import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Loader2 } from "lucide-react"
import ProductCard from "@/components/product-card"
import FeaturedProductCard from "@/components/featured-product-card"
import Navbar from "@/components/navbar"
import type { Product } from "@/data/product"
import Link from "next/link"

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const URL = "https://sigmasociety.dedyn.io"
  const [fetchAttempts, setFetchAttempts] = useState(0)

  const createProductCard = useCallback((jsonRaw: any): Product => {
    return {
      barcode: jsonRaw.barcode || "",
      name: jsonRaw.name || "Unknown Product",
      description: jsonRaw.description || "No description available",
      price: jsonRaw.rawPrice || jsonRaw.price || 0,
      priceValue: jsonRaw.priceValue || 0,
      rawPrice: jsonRaw.rawPrice || 0,
      sustainabilityScore: jsonRaw.sustainabilityScore || 0,
      nutritionValue: jsonRaw.nutritionValue || 0,
      nutritionalValue: jsonRaw.nutritionalValue || 0,
      holisticRating: jsonRaw.holisticRating || 0,
      brand: jsonRaw.brand || "Unknown Brand",
      image: jsonRaw.image || "/placeholder.svg",
      scannedDate: jsonRaw.scannedDate || "",
    }
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      console.log("Fetching products, attempt:", fetchAttempts + 1)
      setIsLoadingProducts(true)

      const response = await fetch(`${URL}/api/topProducts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("API response:", data)

      if (data && data.list && Array.isArray(data.list)) {
        const productList: Product[] = data.list.map((jsonRaw: any) => createProductCard(jsonRaw))
        console.log("Processed products:", productList.length)

        if (productList.length === 0 && fetchAttempts < 3) {
          console.log("No products received, retrying...")
          setFetchAttempts((prev) => prev + 1)
        } else {
          setProducts(productList)
        }
      } else {
        console.error("Invalid data format received:", data)
        setError("Invalid data format received from server")

        if (fetchAttempts < 3) {
          console.log("Invalid data format, retrying...")
          setFetchAttempts((prev) => prev + 1)
        }
      }
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Could not load products. Please try again later.")

      if (fetchAttempts < 3) {
        console.log("Error occurred, retrying...")
        setFetchAttempts((prev) => prev + 1)
      }
    } finally {
      setIsLoadingProducts(false)
    }
  }, [URL, fetchAttempts, createProductCard])

  useEffect(() => {
    setIsLoaded(true)
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    console.log("Products state updated:", products.length, "items")
  }, [products])

  const featuredProduct = products && products.length > 0 ? products[0] : null
  const otherProducts = products && products.length > 1 ? products.slice(1) : []

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const renderLoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="mb-4"
      >
        <Loader2 className="h-12 w-12 text-green-600 dark:text-green-400" />
      </motion.div>
      <p className="text-slate-700 dark:text-slate-300 font-medium">Loading products...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 relative">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,#4ade8033,transparent_40%)] dark:bg-[radial-gradient(circle_at_30%_20%,#4ade8015,transparent_40%)] z-0"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_60%,#38bdf833,transparent_40%)] dark:bg-[radial-gradient(circle_at_70%_60%,#38bdf815,transparent_40%)] z-0"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,#22c55e33,transparent_40%)] dark:bg-[radial-gradient(circle_at_20%_80%,#22c55e15,transparent_40%)] z-0"></div>

      <Navbar />

      <main className="relative z-10">
        <section className="relative min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-emerald-500 to-cyan-500 mb-6">
                Consumer Compass
              </h1>
              <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-8">
                Sustainable, healthy, and affordable - from consumer to company.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button
                  type="button"
                  onClick={() => window.scrollBy({ top: window.innerHeight, left: 0, behavior: "smooth" })}
                  className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="about" className="py-20 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="container mx-auto px-4"
          >
            <motion.div variants={itemVariants} className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">How It Works</h2>
              <p className="text-lg text-slate-700 dark:text-slate-300">
                With our efficient and impactful rating system and analysis of products, we can determine sustainable,
                healthy, and affordable options for consumers and provide analytics to businesses to make an impact on
                our world.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="h-7 w-7 text-green-600 dark:text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Ease of Use</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  All you have to do is scan the barcode of your product, and our app does the rest. Use it in a grocery
                  store, at home, or anywhere you want to know more about a product.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="h-7 w-7 text-emerald-600 dark:text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Product Scoring</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Our unique scoring algorithm factors in our goals of sustainability, health, and affordability to
                  grade each product on their viability and show potential benefits and downfalls to purchasing certain
                  products.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="h-7 w-7 text-teal-600 dark:text-teal-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Effective Analytics</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  By providing analytics and products from crowd-sourced data, not only can consumers view and purchase
                  more sustainable and healthy options, but companies can take steps towards improving their
                  non-sustainable practices and improve revenue.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section id="featured" className="py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="container mx-auto px-4"
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium mb-4">
                Product of the Week
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
                This Week&apos;s Top Pick
              </h2>
            </motion.div>

            <motion.div variants={itemVariants}>
              {isLoadingProducts ? (
                renderLoadingSpinner()
              ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-xl text-center">
                  {error}
                  <button
                    onClick={() => setFetchAttempts((prev) => prev + 1)}
                    className="ml-4 mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              ) : featuredProduct ? (
                <FeaturedProductCard product={featuredProduct} />
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 p-6 rounded-xl text-center">
                  No featured product available
                  <button
                    onClick={() => setFetchAttempts((prev) => prev + 1)}
                    className="ml-4 mt-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-200 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-700"
                  >
                    Retry
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </section>

        <section className="py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="container mx-auto px-4"
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
                Other Highly Rated Products
              </h2>
            </motion.div>

            {isLoadingProducts ? (
              renderLoadingSpinner()
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-xl text-center">
                {error}
                <button
                  onClick={() => setFetchAttempts((prev) => prev + 1)}
                  className="ml-4 mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            ) : otherProducts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherProducts.map((product, index) => (
                  <motion.div key={`product-${index}-${product.barcode || product.name}`} variants={itemVariants}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 p-6 rounded-xl text-center">
                No products available
                <button
                  onClick={() => setFetchAttempts((prev) => prev + 1)}
                  className="ml-4 mt-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-200 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-700"
                >
                  Retry
                </button>
              </div>
            )}

            <motion.div variants={itemVariants} className="mt-12 text-center">
              <Link href="/analytics">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  View Product Analytics
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </main>
    </div>
  )
}
