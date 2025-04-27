"use client";
import Navbar from '@/components/navbar';
import React, { useEffect } from 'react';
import Graph from '@/components/graph';
import { Product } from '@/data/sample-products';
import { List } from '@zxing/library/esm/customTypings';
import ProductCard from '@/components/product-card';
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
    ];
 
    const [graph, setGraph] = React.useState<Point[]>();
    const [exsists, setExists] = React.useState<boolean>(false);
    const [product, setProduct] = React.useState<Product>();
    const [productData, setProductData] = React.useState<Product>();
    const [name2Barcode,setName2Barcode] = React.useState<Map<string, string>>();
    const [options, setOptions] =  React.useState();
    const [productOptions, setProductOptions] = React.useState<List<number>>();
    const [brand, setBrand] = React.useState<string>("");
    async function fetchOptions() {
        try {
            const response = await fetch(`${backendurl}brands`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            //TODO: parse the json into acc stuff the product class can use
            setOptions(data.brands);
            
        } catch (error) {
            throw error;
        }
    }

    
    async function fetchProductsFromBrand(brand: string) {
        try {
            const response = await fetch(`${backendurl}getProducts/${brand}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json(); //JSON is in teh format of {barcode:"1234567890123", name:"product name", "_id":"12q30"}
            //update productOptions to a list of strings with the names of the products
            const kkk = data.list.map((product: { name: string }) => product.name);

            const nameToBarcodeMap = new Map<string, string>();
            data.list.forEach((product: { name: string; barcode: string }) => {
                nameToBarcodeMap.set(product.name, product.barcode);
            });
            setName2Barcode(nameToBarcodeMap)
            setProductOptions(Array.from(kkk));
            
            
            
          
            // console.log("Fetched product data:", productOptions)
        } catch (error) {
            throw error;
        }
    
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
            //TODO: parse the json into acc stuff the product class can use
            setProductData(createProductCard(data.data, barcode));
            console.log(productData);
        } catch (error) {
            throw error;
        }
    }
    async function fetchProductGraph(barcode: string) {
        try {
            const response = await fetch(`${backendurl}getData/${barcode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify({ "barcode": barcode }),
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
    useEffect(() => {
        fetchOptions()
            .then((data) => {
            })
            .catch((error) => {
                console.error("Error fetching product data:", error)
            })
    }, []);
    useEffect(() => {
        if(product && brand && name2Barcode) {
            console.log("im gonna product");
            fetchProductData(name2Barcode.get(product) || "");
            
        }
    }, [product,brand]);
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '20px' }}>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 relative">
                    <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,#4ade8033,transparent_40%)] dark:bg-[radial-gradient(circle_at_30%_20%,#4ade8015,transparent_40%)] z-0"></div>
                    <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_60%,#38bdf833,transparent_40%)] dark:bg-[radial-gradient(circle_at_70%_60%,#38bdf815,transparent_40%)] z-0"></div>
                    <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,#22c55e33,transparent_40%)] dark:bg-[radial-gradient(circle_at_20%_80%,#22c55e15,transparent_40%)] z-0"></div>
                    <Navbar />
                    <div className="w-full flex flex-col items-center gap-4">
            </div>
            <div className="w-9/10 h-64 p-4 bg-white/10 backdrop-blur-sm rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.3)] border border-black/20 center mt-10 mx-auto z-10">
                <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    onChange={(e) => {
                        const selectedOption = e.target.value;
                        console.log(`Selected option: ${selectedOption}`);
                        setBrand(selectedOption);
                        fetchProductsFromBrand(selectedOption);
                    }}
                >
                    <option value="" disabled selected>
                        Select a brand
                    </option>
                    {options?.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

                {productOptions && (
                    <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    onChange={(e) => {
                        const selectedOption = e.target.value;
                        console.log(`Selected option: ${selectedOption}`);
                        setProduct(selectedOption);
                        
                    }}
                >
                    <option value="" disabled selected>
                        Select a product
                    </option>
                    
                    {productOptions?.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                )}

            </div>

            <div className="w-9/10 h-64 p-4 bg-black/10 backdrop-blur-sm rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.3)] border border-white/20 center mt-60 right-30 left-0 mx-auto z-10">
            {graph && <Graph data={graph} />}
            {productData && (<ProductCard product={productData} />)}
            </div>

        </div>
        </div>
    );  
};

export default AnalyticsPage;