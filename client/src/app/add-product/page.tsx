"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface FormData {
  name: string;
  description: string;
  price: string;
  quantity: string;
  image: File | null;
  category: string;
  attributes: { trait_type: string; value: string }[];
}

export default function AddProduct() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    quantity: "1",
    image: null,
    category: "physical",
    attributes: [{ trait_type: "", value: "" }]
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleAttributeChange = (index: number, field: "trait_type" | "value", value: string) => {
    const newAttributes = [...formData.attributes];
    newAttributes[index][field] = value;
    setFormData(prev => ({ ...prev, attributes: newAttributes }));
  };

  const addAttribute = () => {
    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, { trait_type: "", value: "" }]
    }));
  };

  const removeAttribute = (index: number) => {
    const newAttributes = [...formData.attributes];
    newAttributes.splice(index, 1);
    setFormData(prev => ({ ...prev, attributes: newAttributes }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create FormData object for file upload
      // const mintData = new FormData();
      // mintData.append("name", formData.name);
      // mintData.append("description", formData.description);
      // mintData.append("price", formData.price);
      // mintData.append("quantity", formData.quantity);
      // mintData.append("category", formData.category);
      // mintData.append("attributes", JSON.stringify(formData.attributes));
      // if (formData.image) {
      //   mintData.append("image", formData.image);
      // }

      // Submit to API
      const response = await fetch("/api/mintNFT", {
        method: "POST",
        body: JSON.stringify({
          recipient: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 
          name: formData.name,
          description: formData.description,
          price: formData.price,
          quantity: formData.quantity,
          category: formData.category,
          // attributes: formData.attributes,
          // image: formData.image,
        }),
        // Note: Don't set Content-Type header when using FormData
        headers: {
          "Content-Type": "application/json", 
          
      }});

      if (!response.ok) {
        throw new Error("Failed to mint NFT");
      }

      const result = await response.json();
      toast.success("Product successfully minted as NFT!");
      router.push("/dashboard"); // Redirect to dashboard
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast.error("Failed to mint NFT. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white mb-4 flex items-center"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Add New Product</h1>
          <p className="mt-1 text-gray-300">Create a new NFT-backed product for your collection</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form 
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Product Info */}
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Limited Edition Sneakers"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe your product in detail..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
                    Price (ETH)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.001"
                    min="0"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0.25"
                  />
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="1"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                  Category
                </label>
                <select
  id="category"
  name="category"
  value={formData.category}
  onChange={handleInputChange}
  required
  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
  style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
>
  <option value="physical" className="bg-gray-800 text-white">Physical Product</option>
  <option value="digital" className="bg-gray-800 text-white">Digital Asset</option>
  <option value="art" className="bg-gray-800 text-white">Art & Collectibles</option>
  <option value="fashion" className="bg-gray-800 text-white">Fashion & Apparel</option>
  <option value="luxury" className="bg-gray-800 text-white">Luxury Items</option>
</select>
              </div>
            </div>

            {/* Right Column - Image and Attributes */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Product Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-white/20 rounded-lg">
                  {previewUrl ? (
                    <div className="space-y-2 text-center">
                      <div className="relative h-40 w-40 mx-auto">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          layout="fill"
                          objectFit="contain"
                          className="rounded-md"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(null);
                          setFormData(prev => ({ ...prev, image: null }));
                        }}
                        className="text-sm text-purple-400 hover:text-purple-300"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-400">
                        <label
                          htmlFor="image-upload"
                          className="relative cursor-pointer rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="image-upload"
                            name="image-upload"
                            type="file"
                            accept="image/*"
                            // required
                            onChange={handleImageChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Attributes
                </label>
                {formData.attributes.map((attr, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={attr.trait_type}
                      onChange={(e) => handleAttributeChange(index, "trait_type", e.target.value)}
                      placeholder="Trait name"
                      className="w-1/2 bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm"
                    />
                    <input
                      type="text"
                      value={attr.value}
                      onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                      placeholder="Value"
                      className="w-1/2 bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm"
                    />
                    {formData.attributes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAttribute(index)}
                        className="text-red-400 text-sm hover:text-red-300"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAttribute}
                  className="text-sm text-purple-400 hover:text-purple-300 mt-1"
                >
                  + Add Attribute
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl shadow-lg flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" /> Processing...
                </>
              ) : (
                "Mint NFT Product"
              )}
            </Button>
          </div>
        </form>
      </main>

      {/* Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-purple-500/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-80px] w-[500px] h-[500px] bg-blue-500/10 rounded-full filter blur-3xl" />
      </div>
    </div>
  );
}