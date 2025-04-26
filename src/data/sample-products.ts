// this is just for testing
export type Product = {
  barcode: string  
  name: string
  description: string
  price: number
  sustainabilityScore: number
  nutritionValue: number
  holisticRating: number
  brand: string
  image: string
  scannedDate: string  
}

export const featuredProduct: Product = {
  barcode: "978020137962",  
  name: "Mr. Tangent's Organic Radii",
  description: "Premium quality organic headphones with sustainable materials and excellent sound quality.",
  price: 69.99,
  sustainabilityScore: 4.8,
  nutritionValue: 5,
  holisticRating: 5,
  brand: "SonicWave",
  image: "/placeholder.jpeg",
  scannedDate: "2025-04-26T14:22:30Z"
}

export const products: Product[] = [
  {
    barcode: "629104150024", 
    name: "Mr. Tangent's Organic Radii",
    description: "Premium quality organic headphones with sustainable materials and excellent sound quality.",
    price: 69.99,
    sustainabilityScore: 4.8,
    nutritionValue: 5,
    holisticRating: 4.9,
    brand: "SonicWave",
    image: "/placeholder.jpeg",
    scannedDate: "2025-04-26T14:22:30Z"
  },
  {
    barcode: "036000291452", 
    name: "Mr. Tangent's Organic Radii",
    description: "Premium quality organic headphones with sustainable materials and excellent sound quality.",
    price: 69.99,
    sustainabilityScore: 4.8,
    nutritionValue: 5,
    holisticRating: 4.9,
    brand: "SonicWave",
    image: "/placeholder.jpeg",
    scannedDate: "2025-04-26T14:22:30Z"
  },
  {
    barcode: "740617128147",  
    name: "Mr. Tangent's Organic Radii",
    description: "Premium quality organic headphones with sustainable materials and excellent sound quality.",
    price: 69.99,
    sustainabilityScore: 4.8,
    nutritionValue: 5,
    holisticRating: 4.9,
    brand: "SonicWave",
    image: "/placeholder.jpeg",
    scannedDate: "2025-04-26T14:22:30Z"
  },
]