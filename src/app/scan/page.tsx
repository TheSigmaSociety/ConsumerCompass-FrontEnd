"use client";

import React from 'react';
import BarcodeScanner from '../../components/barcode-scanner';
import ProductCard from '../../components/product-card';
import { Product } from '@/data/sample-products';

export default function Page() {
    const [resulty, setResulty] = React.useState<string>();
    const [productData, setProductData] = React.useState<Product>();
    const backendurl = "http://sigmasociety.dedyn.io/api/";
    function handleScanner(result: string) {
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
            //TODO: replace with real stuff
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
            console.error('Error fetching product data:', error);
            throw error;
        }
    }
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <BarcodeScanner onScan={handleScanner}/>
            {productData && <ProductCard product={productData} />}
        </div>
    );
}