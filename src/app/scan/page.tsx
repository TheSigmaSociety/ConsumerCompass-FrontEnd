"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, ArrowDown, Loader2 } from "lucide-react"
import BarcodeScanner from "@/components/barcode-scanner"
import ProductCard from "@/components/product-card"
import Navbar from "@/components/navbar"
import type { Product } from "@/data/sample-products"

export default function ScanPage() {
    const [result, setResult] = useState<string>()
    const [productData, setProductData] = useState<Product>()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const backendurl = "https://sigmasociety.dedyn.io/api/"
    const resultRef = useRef<HTMLDivElement>(null)

    function handleScanner(result: string) {
        setResult(result)
        setIsLoading(true)
        setError(null)
        console.log("Scanned result:", result)

        fetchProductData(result)
            .then((data) => {
                console.log("Fetched product data:", data)
                setIsLoading(false)
            })
            .catch((error) => {
                console.error("Error fetching product data:", error)
                setError("Failed to fetch product data. Please try again.")
                setIsLoading(false)
            })
    }

    function createProductCard(jsonRaw: any, barcode: string): Product {
        console.log(jsonRaw.name);
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
        };
        return product;
    }
    async function fetchProductData(barcode: string) {
        try {
            const response = await fetch(`${backendurl}addProduct`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify({ "barcode": barcode }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setProductData(createProductCard(data.data, barcode));
            console.log(productData);
            
            // Add setTimeout to ensure state is updated before scrolling
            setTimeout(() => {
                if (resultRef.current) {
                    resultRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }, 100);
        } catch (error) {
            throw error;
        }
    }

    // Animation variants
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 relative">
            {/* Blur overlay while loading */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 flex items-center justify-center"
                    >
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-8 rounded-xl shadow-lg"
                        >
                            <div className="flex flex-col items-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="mb-4"
                                >
                                    <Loader2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                                </motion.div>
                                <p className="text-slate-700 dark:text-slate-300 font-medium">
                                    Fetching product information...
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,#4ade8033,transparent_40%)] dark:bg-[radial-gradient(circle_at_30%_20%,#4ade8015,transparent_40%)] z-0"></div>
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_60%,#38bdf833,transparent_40%)] dark:bg-[radial-gradient(circle_at_70%_60%,#38bdf815,transparent_40%)] z-0"></div>
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,#22c55e33,transparent_40%)] dark:bg-[radial-gradient(circle_at_20%_80%,#22c55e15,transparent_40%)] z-0"></div>

            <Navbar />

            <main className="relative z-10 pt-24 pb-16 px-4">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="container mx-auto max-w-4xl"
                >
                    <motion.div variants={itemVariants} className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-emerald-500 to-cyan-500 mb-4">
                            Scan a Product
                        </h1>
                        <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
                            Scan a product barcode to get detailed information about its sustainability, health impact, and
                            affordability.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="mb-12">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex items-center justify-center">
                                    <Camera className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
                                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Barcode Scanner</h2>
                                </div>
                            </div>
                            <div className="p-6">
                                <BarcodeScanner onScan={handleScanner} />
                            </div>
                        </div>
                    </motion.div>

                    {result && (
                        <motion.div
                            ref={resultRef}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-8 text-center"
                        >
                            <div className="inline-flex items-center justify-center mb-6">
                                <ArrowDown className="h-8 w-8 text-green-600 dark:text-green-400 animate-bounce" />
                            </div>

                            {error ? (
                                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-md">
                                    <p className="text-red-500 dark:text-red-400">{error}</p>
                                </div>
                            ) : productData ? (
                                <div className="max-w-md mx-auto">
                                    <ProductCard product={productData} />
                                </div>
                            ) : null}
                        </motion.div>
                    )}
                </motion.div>
            </main>
        </div>
    )
}
