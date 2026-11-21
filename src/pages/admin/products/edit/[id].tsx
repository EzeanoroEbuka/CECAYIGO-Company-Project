import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { productService } from "@/services/productService";
import { Product } from "@/services/productService";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Plus, X } from "lucide-react";
import { uploadImage } from "@/lib/cloudinaryUpload";
import { PRODUCT_CATEGORIES } from "@/lib/categories";


export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    discountedPrice: 0,
    category: "",
    inStock: true,
    featured: false,
    images: [] as string[],
    features: [""],
    specifications: [{ key: "", value: "" }],
  });

  const [newImages, setNewImages] = useState<{ file: File; preview: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        const productData = await productService.getProductById(id as string);
        if (!mounted) return;
        
        if (productData) {
          setProduct(productData);
          setFormData({
            name: productData.name,
            description: productData.description,
            price: productData.price,
            discountedPrice: productData.discountedPrice || 0,
            category: productData.category,
            inStock: productData.inStock,
            featured: productData.featured || false,
            images: productData.images || [],
            features: productData.features?.length ? productData.features : [""],
            specifications: Object.keys(productData.specifications || {}).length
              ? Object.entries(productData.specifications).map(([key, value]) => ({ key, value: String(value) }))
              : [{ key: "", value: "" }],
          });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        if (mounted) {
          toast.error('Failed to fetch product');
          router.push('/admin/dashboard');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProduct();
    
    return () => {
      mounted = false;
    };
  }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length + newImages.length === 0) {
      toast.error("A product needs at least one image");
      return;
    }
    setSaving(true);
    try {
      const uploaded = await Promise.all(newImages.map((n) => uploadImage(n.file, "products")));
      const specifications = formData.specifications.reduce((obj, item) => {
        if (item.key.trim() && item.value.trim()) obj[item.key.trim()] = item.value.trim();
        return obj;
      }, {} as Record<string, string>);

      await productService.updateProduct(id as string, {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price) || 0,
        discountedPrice: Number(formData.discountedPrice) || 0,
        category: formData.category,
        inStock: formData.inStock,
        featured: formData.featured,
        features: formData.features.map((f) => f.trim()).filter(Boolean),
        specifications,
        images: [...formData.images, ...uploaded],
      });
      toast.success("Product updated successfully");
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    if (formData.images.length + newImages.length + picked.length > 4) {
      toast.error("Maximum 4 images per product");
      return;
    }
    setNewImages((prev) => [...prev, ...picked.map((file) => ({ file, preview: URL.createObjectURL(file) }))]);
  };

  const removeExistingImage = (index: number) =>
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));

  const removeNewImage = (index: number) =>
    setNewImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : parseFloat(value)) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
      <title>Edit Product | Emax-Electrical - Shop Easy</title>
      </Head>

      <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
        <Card>
          <CardHeader>
            <CardTitle>Edit Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>  

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <Input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Discounted Price</label>
                    <Input
                      type="number"
                      name="discountedPrice"
                      value={formData.discountedPrice}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
                    <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleCheckboxChange}
                      className="rounded border-gray-300"
                    />
                  <span>In Stock</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleCheckboxChange}
                      className="rounded border-gray-300"
                    />
                    <span>Featured</span>
                  </label>
                </div>
                <div>
                <label className="block text-sm font-medium mb-2">Images (max 4)</label>
                <div className="flex flex-wrap gap-3">
                  {formData.images.map((url, i) => (
                    <div key={`${url}-${i}`} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 rounded-full bg-black/70 p-0.5 text-white" aria-label="Remove image">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {newImages.map((n, i) => (
                    <div key={n.preview} className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-primary">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={n.preview} alt="" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 left-0 right-0 bg-primary text-center text-[10px] text-white">New</span>
                      <button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 rounded-full bg-black/70 p-0.5 text-white" aria-label="Remove image">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {formData.images.length + newImages.length < 4 && (
                    <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-xs text-gray-500">
                      <Upload className="h-5 w-5" /> Add
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleNewImages} />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium">Features</label>
                  <Button type="button" variant="outline" size="sm" onClick={() => setFormData((p) => ({ ...p, features: [...p.features, ""] }))}>
                    <Plus className="mr-1 h-4 w-4" /> Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.features.map((feature, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={feature}
                        placeholder="e.g. 6KV anti-surge protection"
                        onChange={(e) => setFormData((p) => ({ ...p, features: p.features.map((f, idx) => (idx === i ? e.target.value : f)) }))}
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => setFormData((p) => ({ ...p, features: p.features.filter((_, idx) => idx !== i) }))}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium">Specifications</label>
                  <Button type="button" variant="outline" size="sm" onClick={() => setFormData((p) => ({ ...p, specifications: [...p.specifications, { key: "", value: "" }] }))}>
                    <Plus className="mr-1 h-4 w-4" /> Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.specifications.map((spec, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={spec.key}
                        placeholder="Name (e.g. Power)"
                        onChange={(e) => setFormData((p) => ({ ...p, specifications: p.specifications.map((x, idx) => (idx === i ? { ...x, key: e.target.value } : x)) }))}
                      />
                      <Input
                        value={spec.value}
                        placeholder="Value (e.g. 100W)"
                        onChange={(e) => setFormData((p) => ({ ...p, specifications: p.specifications.map((x, idx) => (idx === i ? { ...x, value: e.target.value } : x)) }))}
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => setFormData((p) => ({ ...p, specifications: p.specifications.filter((_, idx) => idx !== i) }))}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/dashboard")}
                >
                  Cancel
                </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving…" : "Update Product"}
                  </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}