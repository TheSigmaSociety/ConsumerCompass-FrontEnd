"use client";

import React, {useState} from 'react';
import {motion} from "framer-motion";
import BarcodeScanner from '../../components/barcode-scanner';
import {Camera, ArrowDown, Loader2} from "lucide-react";
import ProductCard from '../../components/product-card';
import { Product } from '@/data/sample-products';
import Navbar from "@/components/navbar"


export default function Page() {
    const [resulty, setResulty] = React.useState<string>();
    const [productData, setProductData] = React.useState<Product>();
    const [error, setError] = useState<string | null>(null);
    const backendurl = "https://sigmasociety.dedyn.io/api/";

    function handleScanner(result: string) {
        setError(null);
        setResulty((result));
        console.log('Scanned result:', result);
        fetchProductData(result).then((data) => {
            console.log('Fetched product data:', data);
        }).catch((error) => {
            console.error('Error fetching product data:', error);
        });

    }

    async function fetchProductData(barcode: string) {
        try {           
            const response = await fetch(`${backendurl}addProduct`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },body: JSON.stringify({"barcode": barcode}),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            //TODO: parse the json into acc stuff the product class can use
            console.log(data);
        } catch (error) {
            throw error;
        }
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 relative"> 
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,#4ade8033,transparent_40%)] dark:bg-[radial-gradient(circle_at_30%_20%,#4ade8015,transparent_40%)] z-0"></div>
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_60%,#38bdf833,transparent_40%)] dark:bg-[radial-gradient(circle_at_70%_60%,#38bdf815,transparent_40%)] z-0"></div>
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,#22c55e33,transparent_40%)] dark:bg-[radial-gradient(circle_at_20%_80%,#22c55e15,transparent_40%)] z-0"></div>

            <Navbar />

            <main className="relative z-10 pt-24 pb-16 px-4">
                <motion.div initial="hidden" animate="visible" variants={containerVariants} ></motion.div>
            </main>

        </div>
    );
}