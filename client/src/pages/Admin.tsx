import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { productsAPI, uploadAPI, categoriesAPI, ordersAPI, sliderAPI } from "@/services/api";
import { toast } from "sonner";
import { Trash2, Upload, Plus, X } from "lucide-react";

const sections = [
  { key: "dashboard", label: "Dashboard", description: "Quick overview of store metrics and activity." },
  { key: "products", label: "Products", description: "Create, update, and manage your product catalog." },
  { key: "orders", label: "Orders", description: "Review and update order status across customers." },
  { key: "categories", label: "Categories", description: "Maintain category structure for product filtering." },
  { key: "sliders", label: "Slider", description: "Manage homepage slider images and ordering." },
  { key: "team", label: "Team", description: "Manage team members shown on the website." },
  { key: "users", label: "Users", description: "Manage customer accounts and admin access." },
];

const Admin = () => {
  const { section } = useParams();
  const active = section || "dashboard";
  const current = sections.find((s) => s.key === active) || sections[0];
  const queryClient = useQueryClient();

  // Product form state
  const [form, setForm] = useState({
    name: "",
    price: "",
    originalPrice: "",
    stock: "",
    category: "",
    weight: "",
    packSize: "",
    description: "",
  });
  const [images, setImages] = useState<Array<{ url: string; public_id?: string }>>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Category form state
  const [categoryName, setCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  // Slider form state
  const [sliderImage, setSliderImage] = useState("");
  const [sliderTitle, setSliderTitle] = useState("");
  const [sliderDescription, setSliderDescription] = useState("");
  const [sliderOrder, setSliderOrder] = useState("");
  const [sliderFile, setSliderFile] = useState<File | null>(null);
  const [uploadingSlider, setUploadingSlider] = useState(false);

  // Fetch products
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products"],
    enabled: active === "products",
    queryFn: async () => {
      const res = await productsAPI.getAll();
      return res.data?.data || [];
    },
  });

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["admin-categories"],
    enabled: active === "products" || active === "categories",
    queryFn: async () => {
      try {
        const res = await categoriesAPI.getAll();
        return res.data?.data || [];
      } catch {
        return [];
      }
    },
  });

  // Fetch orders
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-orders"],
    enabled: active === "orders",
    queryFn: async () => {
      try {
        const res = await ordersAPI.getAll();
        return res.data?.data || [];
      } catch {
        return [];
      }
    },
  });

  // Fetch sliders
  const { data: slidersData, isLoading: slidersLoading } = useQuery({
    queryKey: ["admin-sliders"],
    enabled: active === "sliders",
    queryFn: async () => {
      try {
        const res = await sliderAPI.getAllAdmin();
        return res.data?.data || [];
      } catch {
        return [];
      }
    },
  });

  const categories = useMemo(() => Array.isArray(categoriesData) ? categoriesData : [], [categoriesData]);
  const orders = useMemo(() => Array.isArray(ordersData) ? ordersData : [], [ordersData]);
  const sliders = useMemo(() => Array.isArray(slidersData) ? slidersData : [], [slidersData]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast("Select an image first");
      return;
    }
    setUploading(true);
    try {
      const uploads: Array<{ url: string; public_id?: string }> = [];
      for (const file of Array.from(selectedFiles)) {
        const data = new FormData();
        data.append("my_file", file);
        const res = await uploadAPI.uploadImage(data);
        if (res.data?.success && res.data?.data?.url) {
          uploads.push({ url: res.data.data.url, public_id: res.data.data.public_id });
        }
      }
      if (uploads.length > 0) {
        setImages((prev) => [...prev, ...uploads]);
        toast("Image uploaded", { description: `${uploads.length} image(s) added.` });
      }
    } catch (error: any) {
      toast("Image upload failed", { description: error?.response?.data?.message || "Please try again." });
    } finally {
      setUploading(false);
      setSelectedFiles(null);
    }
  };

  const handleSaveProduct = async () => {
    if (!form.name.trim()) {
      toast("Product name is required");
      return;
    }
    if (!form.price) {
      toast("Price is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stock: form.stock ? Number(form.stock) : undefined,
        category: form.category || undefined,
        weight: form.weight || undefined,
        packSize: form.packSize || undefined,
        description: form.description || undefined,
        images,
        image: images[0]?.url,
      };

      const res = await productsAPI.create(payload);
      if (res.data?.success) {
        toast("Product added");
        setForm({ name: "", price: "", originalPrice: "", stock: "", category: "", weight: "", packSize: "", description: "" });
        setImages([]);
        await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      } else {
        toast("Unable to add product", { description: res.data?.message || "Please try again." });
      }
    } catch (error: any) {
      toast("Unable to add product", { description: error?.response?.data?.message || "Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await productsAPI.delete(id);
      toast("Product deleted");
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    } catch (error: any) {
      toast("Delete failed", { description: error?.response?.data?.message || "Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-muted/10 py-12">
      <div className="container mx-auto px-6 space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-secondary/50">Admin Panel</p>
          <h1 className="text-3xl font-semibold text-secondary">{current.label}</h1>
          <p className="text-secondary/70 mt-2">{current.description}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {sections.map((s) => (
            <Button key={s.key} asChild variant={active === s.key ? "default" : "outline"}>
              <Link to={`/admin/${s.key}`}>{s.label}</Link>
            </Button>
          ))}
        </div>

        {active !== "products" && (
          <Card>
            <CardHeader>
              <CardTitle>{current.label}</CardTitle>
              <CardDescription>{current.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This section is ready to connect with admin workflows. Use the backend API endpoints to load, create, and manage records.
              </p>
            </CardContent>
          </Card>
        )}

        {active === "products" && (
          <div className="grid gap-8 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Add new product</CardTitle>
                <CardDescription>Upload images and add product details to your catalog.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product name</Label>
                    <Input id="name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" type="number" value={form.price} onChange={(e) => handleChange("price", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original price</Label>
                    <Input id="originalPrice" type="number" value={form.originalPrice} onChange={(e) => handleChange("originalPrice", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input id="stock" type="number" value={form.stock} onChange={(e) => handleChange("stock", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" list="category-list" value={form.category} onChange={(e) => handleChange("category", e.target.value)} />
                    <datalist id="category-list">
                      {categories.map((cat: any) => (
                        <option key={cat._id || cat.id} value={cat._id || cat.slug || cat.name}>{cat.name}</option>
                      ))}
                    </datalist>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Input id="weight" value={form.weight} onChange={(e) => handleChange("weight", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="packSize">Pack size</Label>
                    <Input id="packSize" value={form.packSize} onChange={(e) => handleChange("packSize", e.target.value)} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={form.description} onChange={(e) => handleChange("description", e.target.value)} rows={4} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Product images</Label>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Input type="file" multiple onChange={(e) => setSelectedFiles(e.target.files)} />
                    <Button type="button" variant="outline" onClick={handleUpload} disabled={uploading}>
                      {uploading ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {images.map((img, idx) => (
                        <div key={`${img.url}-${idx}`} className="rounded-lg overflow-hidden border">
                          <img src={img.url} alt={`Uploaded ${idx + 1}`} className="h-24 w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleSaveProduct} disabled={saving}>
                    {saving ? "Saving..." : "Add product"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>Latest items in your catalog.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {productsLoading && (
                  <p className="text-sm text-muted-foreground">Loading products...</p>
                )}
                {Array.isArray(productsData) && productsData.length === 0 && (
                  <p className="text-sm text-muted-foreground">No products yet.</p>
                )}
                {Array.isArray(productsData) && productsData.map((product: any) => (
                  <div key={product._id} className="rounded-xl border p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-secondary">{product.name}</p>
                        <p className="text-xs text-muted-foreground">₹{Number(product.price || 0).toFixed(0)}</p>
                      </div>
                      <Button variant="ghost" onClick={() => handleDelete(product._id)}>Delete</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
