import BarcodeScanner from "@/components/BarcodeScanner";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <BarcodeScanner/>
    </div>
  );
}
