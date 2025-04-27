"use client"
import Navbar from "@/components/navbar"
import React, { useEffect } from "react"
import Graph from "@/components/graph"
import type { Product } from "@/data/sample-products"
import type { List } from "@zxing/library/esm/customTypings"
import ProductCard from "@/components/product-card"
import { motion } from "framer-motion"
import { BarChart3, ChevronDown } from "lucide-react"
import type { Point } from "recharts/types/shape/Curve"
const backendurl = "https://sigmasociety.dedyn.io/api/"

const AnalyticsPage = () => {
  const wasteGraph = [
    { x: 1, y: 0 },
    { x: 2, y: 0.5 },
    { x: 3, y: 1 },
    { x: 4, y: 1.5 },
    { x: 5, y: 2 },
    { x: 6, y: 2.5 },
    { x: 7, y: 3 },
    { x: 8, y: 3.5 },
    { x: 9, y: 4 },
    { x: 10, y: 4.5 },
  ]

  const [graph, setGraph] = React.useState<Point[]>()
  const [exsists, setExists] = React.useState<boolean>(false)
  const [product, setProduct] = React.useState<Product>()
  const [productData, setProductData] = React.useState<Product>()
  const [name2Barcode, setName2Barcode] = React.useState<Map<string, string>>()
  const [options, setOptions] = React.useState()
  const [productOptions, setProductOptions] = React.useState<List<number>>()
  const [brand, setBrand] = React.useState<string>("")
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isLoadingProduct, setIsLoadingProduct] = React.useState<boolean>(false)

  async function fetchOptions() {
    try {
      const response = await fetch(`${backendurl}brands`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const data = await response.json()
      //TODO: parse the json into acc stuff the product class can use
      setOptions(data.brands)
    } catch (error) {
      throw error
    }
  }

  async function fetchProductsFromBrand(brand: string) {
    try {
      setIsLoading(true)
      const response = await fetch(`${backendurl}getProducts/${brand}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const data = await response.json() //JSON is in teh format of {barcode:"1234567890123", name:"product name", "_id":"12q30"}
      //update productOptions to a list of strings with the names of the products
      const kkk = data.list.map((product: { name: string }) => product.name)

      const nameToBarcodeMap = new Map<string, string>()
      data.list.forEach((product: { name: string; barcode: string }) => {
        nameToBarcodeMap.set(product.name, product.barcode)
      })
      setName2Barcode(nameToBarcodeMap)
      setProductOptions(Array.from(kkk))
      setIsLoading(false)

      // console.log("Fetched product data:", productOptions)
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }
  function createProductCard(jsonRaw: any, barcode: string): Product {
    console.log(jsonRaw.name)
    const product: Product = {
      barcode: barcode,
      name: jsonRaw.name,
      description: jsonRaw.description,
      price: jsonRaw.price,
      sustainabilityScore: jsonRaw.sustainabilityScore,
      nutritionValue: jsonRaw.nutritionValue,
      holisticRating: jsonRaw.holisticRating,
      brand: jsonRaw.brand,
      image: jsonRaw.image || "/placeholder.svg",
      scannedDate: "",
    }
    return product
  }
  async function fetchProductData(barcode: string) {
    try {
      setIsLoadingProduct(true)
      const response = await fetch(`${backendurl}addProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ barcode: barcode }),
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const data = await response.json()
      //TODO: parse the json into acc stuff the product class can use
      setProductData(createProductCard(data.data, barcode))
      setIsLoadingProduct(false)
    } catch (error) {
      setIsLoadingProduct(false)
      throw error
    }
  }
  async function fetchProductGraph(barcode: string) {
    try {
      setIsLoading(true)
      const response = await fetch(`${backendurl}getData/${barcode}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const data = await response.json()
      const output: Point[] = []
      const accData = data.data.ratings
      for (let i = 0; i < accData.length; i++) {
        output.push({ x: accData[i].timestamp, y: accData[i].rating.holisticRating })
      }
      console.log(output)
      setGraph(output)
      setIsLoading(false)
      //TODO: parse the json into acc stuff the product class can use
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }
  useEffect(() => {
    fetchOptions()
      .then((data) => {})
      .catch((error) => {
        console.error("Error fetching product data:", error)
      })
  }, [])
  useEffect(() => {
    if (product && brand && name2Barcode) {
      console.log("im gonna product")
      fetchProductGraph(name2Barcode.get(product) || "")
      fetchProductData(name2Barcode.get(product) || "")
    }
  }, [product, brand])

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

  const ProductCardSkeleton = () => (
    <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
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
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 relative">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,#4ade8033,transparent_40%)] dark:bg-[radial-gradient(circle_at_30%_20%,#4ade8015,transparent_40%)] z-0"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_60%,#38bdf833,transparent_40%)] dark:bg-[radial-gradient(circle_at_70%_60%,#38bdf815,transparent_40%)] z-0"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,#22c55e33,transparent_40%)] dark:bg-[radial-gradient(circle_at_20%_80%,#22c55e15,transparent_40%)] z-0"></div>

      <Navbar />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 pt-24 pb-16 relative z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-emerald-500 to-cyan-500 mb-4">
            Product Analytics
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
            Track sustainability metrics and performance data for products over time.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-10">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Select Product</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="relative">
                <select
                  className="w-full p-3 pr-10 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors appearance-none"
                  onChange={(e) => {
                    const selectedOption = e.target.value
                    console.log(`Selected option: ${selectedOption}`)
                    setBrand(selectedOption)
                    fetchProductsFromBrand(selectedOption)
                    setGraph(undefined)
                    setProduct(undefined)
                    setProductData(undefined)
                  }}
                  value={brand}
                >
                  <option value="" disabled>
                    Select a brand
                  </option>
                  {options?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
              </div>

              {productOptions && (
                <div className="relative">
                  <select
                    className="w-full p-3 pr-10 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors appearance-none"
                    onChange={(e) => {
                      const selectedOption = e.target.value
                      console.log(`Selected option: ${selectedOption}`)
                      setProduct(selectedOption)
                    }}
                    value={product || ""}
                  >
                    <option value="" disabled>
                      Select a product
                    </option>

                    {productOptions?.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <motion.div variants={itemVariants} className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </motion.div>
        ) : (
          <>
            {graph && (
              <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Holistic Rating Over Time</h3>
                  </div>
                  <div className="p-6 h-80">
                    <Graph data={graph} />
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="h-full flex flex-col">
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-t-2xl shadow-lg border-b border-slate-200 dark:border-slate-700">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Product Details</h3>
                    </div>
                    <div className="flex-grow bg-white dark:bg-slate-800 rounded-b-2xl shadow-lg overflow-hidden">
                      {isLoadingProduct ? (
                        <ProductCardSkeleton />
                      ) : (
                        productData && <ProductCard product={productData} />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {!graph && (
              <motion.div variants={itemVariants} className="max-w-md mx-auto">
                {isLoadingProduct ? <ProductCardSkeleton /> : productData && <ProductCard product={productData} />}
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}

export default AnalyticsPage
