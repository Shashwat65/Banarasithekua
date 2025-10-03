// @ts-nocheck
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { categoriesAPI, productsAPI, ordersAPI, adminAPI, uploadAPI } from "@/services/api";
import {
  LayoutDashboard,
  ShoppingBasket,
  Package,
  Layers,
  Users,
  Images,
  LogOut,
  CloudUpload,
  Trash2,
  Pencil,
  X,
} from "lucide-react";

type Category = { _id: string; name: string; slug: string };
type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  stock?: number;
  weight?: string;
  packSize?: string;
  category?: { _id: string; name: string; slug: string } | null;
  image?: string;
};
type Order = {
  _id: string;
  orderStatus: string;
  totalPrice: number;
  user?: { name?: string; email?: string } | string;
  orderItems: { product: string | { name: string }; name?: string; quantity: number }[];
  isPaid?: boolean;
};

type ImageItem = { url: string; public_id: string; width?: number; height?: number; uploadedAt: string };
type AdminUser = { _id: string; name: string; email: string; role: "user" | "admin" };

export default function Admin() {
  const { user, token, logout } = useAuth();
  const [cats, setCats] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [catForm, setCatForm] = useState({ name: "", slug: "" });
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    price: "",
    originalPrice: "",
    categoryId: "",
    stock: "",
    weight: "",
    packSize: "",
    description: "",
    image: "",
    highlights: "",
  });
  const [selectedImages, setSelectedImages] = useState<{ url: string; public_id: string; alt?: string }[]>([]);
  const [categoryEditId, setCategoryEditId] = useState<string | null>(null);
  const [categoryEditName, setCategoryEditName] = useState<string>("");
  const [productFilterCat, setProductFilterCat] = useState<string>("");
  const [productSearch, setProductSearch] = useState<string>("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [bootstrap, setBootstrap] = useState({ email: "", password: "", adminSecret: "" });
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [active, setActive] = useState<
    "dashboard" | "products" | "orders" | "categories" | "images" | "slider" | "users"
  >("dashboard");
  const [showAddProduct, setShowAddProduct] = useState<boolean>(true);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const galleryKey = "admin_image_gallery";
  const sliderKey = "hero_slider_images";
  const gallery: ImageItem[] = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(galleryKey) || "[]");
    } catch {
      return [];
    }
  }, []);
  const [images, setImages] = useState<ImageItem[]>(gallery);
  const [sliderImages, setSliderImages] = useState<ImageItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(sliderKey) || "[]");
    } catch {
      return [];
    }
  });
  const [sliderUrl, setSliderUrl] = useState("");
  // Users management
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const saveGallery = (items: ImageItem[]) => {
    setImages(items);
    localStorage.setItem(galleryKey, JSON.stringify(items));
  };

  const saveSlider = (items: ImageItem[]) => {
    setSliderImages(items);
    localStorage.setItem(sliderKey, JSON.stringify(items));
  };

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const loadCategories = async () => {
    try {
      const res = await categoriesAPI.getAll();
      setCats(res.data.data || []);
    } catch (e) {
      toast("Unable to load categories");
    }
  };

  const loadProducts = async () => {
    try {
      const res = await productsAPI.getAll();
      setProducts(res.data.data || []);
    } catch {
      toast("Unable to load products");
    }
  };

  const loadOrders = async () => {
    try {
      const res = await ordersAPI.getAll();
      setOrders(res.data.data || []);
    } catch {
      toast("Unable to load orders");
    }
  };

  const loadUsers = async (q?: string) => {
    try {
      setIsLoadingUsers(true);
      const res = await adminAPI.getUsers(q ? { search: q } : undefined);
      setUsers(res.data.data || []);
    } catch (err: any) {
      toast(err.response?.data?.message || "Unable to load users");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    // Preload minimal data
    loadCategories();
    loadProducts();
    loadOrders();
  }, [token]);

  const submitCategory = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await categoriesAPI.create(catForm);
      toast("Category created");
      setCatForm({ name: "", slug: "" });
      loadCategories();
    } catch (err: any) {
      toast(err.response?.data?.message || "Failed to create category");
    }
  };

  const startEditCategory = (cat: Category) => {
    setCategoryEditId(cat._id);
    setCategoryEditName(cat.name);
  };

  const cancelEditCategory = () => {
    setCategoryEditId(null);
    setCategoryEditName("");
  };

  const saveEditCategory = async () => {
    if (!categoryEditId) return;
    try {
      await categoriesAPI.update(categoryEditId, { name: categoryEditName });
      toast("Category updated");
      cancelEditCategory();
      loadCategories();
    } catch (err: any) {
      toast(err.response?.data?.message || "Failed to update category");
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category? Products using this category may be affected.")) return;
    try {
      await categoriesAPI.delete(id);
      toast("Category deleted");
      // Reset filters if currently filtering by deleted category
      setProductFilterCat((prev) => (prev === id ? "" : prev));
      await loadCategories();
      await loadProducts();
    } catch (err: any) {
      toast(err.response?.data?.message || "Failed to delete category");
    }
  };

  const submitProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!productForm.categoryId) {
      toast("Category is required");
      return;
    }
    if (!productForm.description.trim()) {
      toast("Description is required");
      return;
    }
    const attributes: Record<string, string> = {};
    productForm.highlights
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => {
        const [key, ...rest] = line.split(":");
        if (!key || rest.length === 0) return;
        attributes[key.trim()] = rest.join(":").trim();
      });

    if (!productForm.slug) {
      toast("Slug is required");
      return;
    }

    const payload: any = {
      name: productForm.name,
      slug: productForm.slug,
      description: productForm.description,
      price: Number(productForm.price || 0),
      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
      stock: Number(productForm.stock || 0),
      weight: productForm.weight || undefined,
      packSize: productForm.packSize || undefined,
      category: productForm.categoryId || undefined,
      // Optional attributes mapping to tags or nutritional info could be added here if backend supports
    };
    try {
      await productsAPI.create(payload);
      toast("Product created");
      setProductForm({
        name: "",
        slug: "",
        price: "",
        originalPrice: "",
        categoryId: "",
        stock: "",
        weight: "",
        packSize: "",
        description: "",
        image: "",
        highlights: "",
      });
      setSlugEdited(false);
      loadProducts();
    } catch (err: any) {
      toast(err.response?.data?.message || "Unable to create product");
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await ordersAPI.updateStatus(orderId, { orderStatus: status });
      toast("Order updated");
      loadOrders();
    } catch (err: any) {
      toast(err.response?.data?.message || "Failed to update order");
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await productsAPI.delete(id);
      toast("Product deleted");
      loadProducts();
    } catch (err: any) {
      toast(err.response?.data?.message || "Failed to delete product");
    }
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  const uploadImage = async () => {
    if (!file) {
      toast("Please choose an image");
      return;
    }
    try {
      setIsUploading(true);
      const form = new FormData();
      form.append("image", file);
      const res = await uploadAPI.uploadImage(form);
      const data = res.data.data;
      const next: ImageItem = {
        url: data.url,
        public_id: data.public_id,
        width: data.width,
        height: data.height,
        uploadedAt: new Date().toISOString(),
      };
      saveGallery([next, ...images]);
      // Auto-select uploaded image for product creation
      setSelectedImages((prev) => [{ url: data.url, public_id: data.public_id }, ...prev]);
      setFile(null);
      toast("Image uploaded");
    } catch (err: any) {
      toast(err.response?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (publicId: string) => {
    try {
      await uploadAPI.deleteImage(publicId);
      saveGallery(images.filter((img) => img.public_id !== publicId));
      setSelectedImages((prev) => prev.filter((p) => p.public_id !== publicId));
      toast("Deleted");
    } catch (err: any) {
      toast(err.response?.data?.message || "Delete failed");
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Admin access required</h1>
          <p className="text-muted-foreground text-sm">
            You are logged in as <span className="font-medium">{user?.email || "guest"}</span> with role
            {" "}
            <span className="font-mono">{user?.role || "none"}</span>.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bootstrap Admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Create the first admin using the server Admin Secret. This will create a verified admin user.
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  setIsCreatingAdmin(true);
                  await adminAPI.createAdmin(bootstrap);
                  toast("Admin created. Please login with the new credentials.");
                } catch (err: any) {
                  toast(err.response?.data?.message || "Failed to create admin");
                } finally {
                  setIsCreatingAdmin(false);
                }
              }}
              className="space-y-3"
            >
              <Input
                type="email"
                placeholder="Admin email"
                value={bootstrap.email}
                onChange={(e) => setBootstrap((p) => ({ ...p, email: e.target.value }))}
                required
              />
              <Input
                type="password"
                placeholder="Admin password"
                value={bootstrap.password}
                onChange={(e) => setBootstrap((p) => ({ ...p, password: e.target.value }))}
                required
              />
              <Input
                placeholder="Admin Secret"
                value={bootstrap.adminSecret}
                onChange={(e) => setBootstrap((p) => ({ ...p, adminSecret: e.target.value }))}
                required
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={isCreatingAdmin}>
                  {isCreatingAdmin ? "Creating..." : "Create Admin"}
                </Button>
                <Button type="button" variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] grid grid-cols-12 gap-0">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-3 border-r border-border/50 min-h-screen p-6 space-y-6">
          <div className="flex items-center gap-2 text-2xl font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">∑</span>
            Admin Panel
          </div>
          <nav className="space-y-1">
            <button className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 hover:bg-muted ${active==='dashboard'?'bg-muted':''}`} onClick={() => setActive('dashboard')}>
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </button>
            <button className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 hover:bg-muted ${active==='products'?'bg-muted':''}`} onClick={() => setActive('products')}>
              <ShoppingBasket className="h-4 w-4" /> Products
            </button>
            <button className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 hover:bg-muted ${active==='orders'?'bg-muted':''}`} onClick={() => setActive('orders')}>
              <Package className="h-4 w-4" /> Orders
            </button>
            <button className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 hover:bg-muted ${active==='categories'?'bg-muted':''}`} onClick={() => setActive('categories')}>
              <Layers className="h-4 w-4" /> Categories
            </button>
            <button className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 hover:bg-muted ${active==='users'?'bg-muted':''}`} onClick={() => { setActive('users'); if (users.length === 0) loadUsers(); }}>
              <Users className="h-4 w-4" /> Users
            </button>
            <button className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 hover:bg-muted ${active==='images'?'bg-muted':''}`} onClick={() => setActive('images')}>
              <Images className="h-4 w-4" /> Image Gallery
            </button>
            <button className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 hover:bg-muted ${active==='slider'?'bg-muted':''}`} onClick={() => setActive('slider')}>
              <Images className="h-4 w-4" /> Slider Images
            </button>
          </nav>
          <div className="pt-4">
            <Button variant="outline" className="w-full flex items-center gap-2" onClick={logout}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </aside>

        {/* Content */}
        <main className="col-span-12 md:col-span-9 lg:col-span-9 p-6 space-y-6">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {active === 'dashboard'
                  ? 'Dashboard'
                  : active === 'products'
                  ? 'Products'
                  : active === 'orders'
                  ? 'Orders'
                  : active === 'categories'
                  ? 'Categories'
                  : active === 'users'
                  ? 'Users'
                  : active === 'images'
                  ? 'Image Gallery'
                  : 'Slider Images'}
              </h1>
              <p className="text-sm text-muted-foreground">Signed in as {user?.email} ({user?.role})</p>
            </div>
            {active === 'products' && (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setShowAddProduct((s) => !s)}>
                  {showAddProduct ? 'Hide Add Product' : 'Add New Product'}
                </Button>
                <Button variant="outline" onClick={loadProducts}>Refresh</Button>
              </div>
            )}
            {active === 'users' && (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => loadUsers(userSearch || undefined)}>Refresh</Button>
              </div>
            )}
          </header>

          {/* Dashboard */}
          {active === 'dashboard' && (
            <div className="grid gap-6 md:grid-cols-3">
              <Card><CardHeader><CardTitle>Total Products</CardTitle></CardHeader><CardContent>{products.length}</CardContent></Card>
              <Card><CardHeader><CardTitle>Total Categories</CardTitle></CardHeader><CardContent>{cats.length}</CardContent></Card>
              <Card><CardHeader><CardTitle>Total Orders</CardTitle></CardHeader><CardContent>{orders.length}</CardContent></Card>
            </div>
          )}

          {/* Categories */}
          {active === 'categories' && (
            <Card>
              <CardHeader><CardTitle>Categories</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={submitCategory} className="flex flex-col sm:flex-row gap-3">
                  <Input placeholder="Name" value={catForm.name} onChange={(e) => setCatForm((prev) => ({ ...prev, name: e.target.value }))} required />
                  <Input placeholder="Slug" value={catForm.slug} onChange={(e) => setCatForm((prev) => ({ ...prev, slug: e.target.value }))} required />
                  <Button type="submit">Add</Button>
                </form>
                <ul className="text-sm space-y-2">
                  {cats.map((c) => (
                    <li key={c._id} className="flex items-center justify-between gap-2">
                      {categoryEditId === c._id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <Input value={categoryEditName} onChange={(e) => setCategoryEditName(e.target.value)} />
                          <Button size="sm" onClick={saveEditCategory}>Save</Button>
                          <Button size="sm" variant="ghost" onClick={cancelEditCategory}><X className="h-4 w-4" /></Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1">
                            {c.name} — <span className="text-muted-foreground">{c.slug}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost" onClick={() => startEditCategory(c)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => deleteCategory(c._id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Products */}
          {active === 'products' && showAddProduct && (
            <Card>
              <CardHeader><CardTitle>Add Product</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={submitProduct} className="space-y-3">
                  {/* Name & Slug */}
                  <Input placeholder="Name" value={productForm.name} onChange={(e) => setProductForm((prev) => { const nextName = e.target.value; const nextSlug = !slugEdited ? slugify(nextName) : prev.slug; return { ...prev, name: nextName, slug: nextSlug }; })} required />
                  <Input placeholder="Slug" value={productForm.slug} onChange={(e) => { setSlugEdited(true); setProductForm((prev) => ({ ...prev, slug: slugify(e.target.value) })); }} required />
                  {/* Pricing */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input placeholder="Price" type="number" step="0.01" value={productForm.price} onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))} required />
                    <Input placeholder="Original price (optional)" type="number" step="0.01" value={productForm.originalPrice} onChange={(e) => setProductForm((prev) => ({ ...prev, originalPrice: e.target.value }))} />
                  </div>
                  {/* Stock & Category */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input placeholder="Stock" type="number" value={productForm.stock} onChange={(e) => setProductForm((prev) => ({ ...prev, stock: e.target.value }))} />
                    <Select value={productForm.categoryId} onValueChange={(value) => { setProductForm((prev) => ({ ...prev, categoryId: value })); }}>
                      <SelectTrigger><SelectValue placeholder="Assign category" /></SelectTrigger>
                      <SelectContent>
                        {cats.map((cat) => (<SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Weight/Image */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input placeholder="Weight / Pack size" value={productForm.weight} onChange={(e) => setProductForm((prev) => ({ ...prev, weight: e.target.value, packSize: e.target.value }))} />
                    <Input placeholder="(Optional) Legacy Image URL (not saved)" value={productForm.image} onChange={(e) => setProductForm((prev) => ({ ...prev, image: e.target.value }))} />
                  </div>
                  <Textarea placeholder="Description" value={productForm.description} onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))} />
                  <Textarea placeholder="Highlights (one per line e.g. Ingredients: Desi ghee)" value={productForm.highlights} onChange={(e) => setProductForm((prev) => ({ ...prev, highlights: e.target.value }))} />
                  {/* Attach Images (required by backend) */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Attach Images</div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">Upload new</div>
                        <div
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={onDrop}
                          className="border-2 border-dashed border-border/60 rounded-xl h-32 flex items-center justify-center text-xs text-muted-foreground"
                        >
                          <div className="text-center space-y-1">
                            <CloudUpload className="mx-auto h-5 w-5" />
                            <p>Drag & drop or click to upload</p>
                            <input type="file" accept="image/*" onChange={onPickFile} className="hidden" id="product-file-input" />
                            <label htmlFor="product-file-input" className="cursor-pointer underline">Choose file</label>
                            {file ? <p className="text-[11px] text-muted-foreground">Selected: {file.name}</p> : null}
                          </div>
                        </div>
                        <Button onClick={uploadImage} disabled={isUploading} variant="outline" size="sm">
                          {isUploading ? "Uploading..." : "Upload & Attach"}
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">Pick from Gallery</div>
                        <div className="grid grid-cols-3 gap-2 max-h-44 overflow-auto pr-1">
                          {images.length === 0 && (
                            <div className="col-span-3 text-xs text-muted-foreground">No images in gallery yet.</div>
                          )}
                          {images.map((img) => {
                            const checked = selectedImages.some((s) => s.public_id === img.public_id);
                            return (
                              <label key={img.public_id} className={`relative block rounded-md overflow-hidden border ${checked ? 'border-primary' : 'border-border/60'} cursor-pointer`}>
                                <input
                                  type="checkbox"
                                  className="absolute inset-0 opacity-0"
                                  checked={checked}
                                  onChange={(e) => {
                                    setSelectedImages((prev) => {
                                      if (e.target.checked) return [{ url: img.url, public_id: img.public_id }, ...prev];
                                      return prev.filter((p) => p.public_id !== img.public_id);
                                    });
                                  }}
                                />
                                <img src={img.url} alt={img.public_id} className="h-20 w-full object-cover" />
                              </label>
                            );
                          })}
                        </div>
                        {selectedImages.length > 0 && (
                          <div className="text-xs text-muted-foreground">Selected: {selectedImages.length}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button type="submit">Create product</Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Product List with filters and delete */}
          {active === 'products' && (
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input placeholder="Search products" value={productSearch} onChange={(e) => setProductSearch(e.target.value)} />
                  <Select value={productFilterCat} onValueChange={setProductFilterCat}>
                    <SelectTrigger className="w-full sm:w-[220px]"><SelectValue placeholder="Filter by category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All categories</SelectItem>
                      {cats.map((c) => (<SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                {products.length === 0 ? (
                  <p className="text-muted-foreground">No products yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {products
                      .filter((p) => {
                        const matchesSearch = productSearch
                          ? (p.name || "").toLowerCase().includes(productSearch.toLowerCase())
                          : true;
                        const catId = (p.category as any)?._id || (p.category as any) || "";
                        const matchesCat = productFilterCat ? catId === productFilterCat : true;
                        return matchesSearch && matchesCat;
                      })
                      .map((product) => (
                        <li key={product._id} className="flex flex-col gap-1 border-b border-border/30 pb-3 last:border-0 last:pb-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground">Slug: {product.slug}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-muted-foreground">₹{product.price} • Stock {product.stock ?? "∞"}</span>
                              <Button size="sm" variant="outline" onClick={() => deleteProduct(product._id)}>Delete</Button>
                            </div>
                          </div>
                          {product.category?.name ? (
                            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{product.category.name}</span>
                          ) : null}
                        </li>
                      ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}

          {/* Orders */}
          {active === 'orders' && (
            <Card>
              <CardHeader><CardTitle>Orders</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-muted-foreground">No orders yet.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-border/60 rounded-xl p-4 space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <p className="font-semibold">Order #{order._id}</p>
                            <p className="text-xs text-muted-foreground">{(order.user as any)?.name} • {(order.user as any)?.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select value={order.orderStatus} onValueChange={(value) => updateOrderStatus(order._id, value)}>
                              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            <span className="text-xs text-muted-foreground">Payment: {order.isPaid ? "paid" : "unpaid"}</span>
                          </div>
                        </div>
                        <ul className="text-sm text-muted-foreground">
                          {order.orderItems.map((item, idx) => {
                            const name = (item as any).name || (item.product as any)?.name || "Item";
                            return (<li key={idx}>{name} × {item.quantity}</li>);
                          })}
                        </ul>
                        <p className="text-sm font-semibold">Total: ₹{Number(order.totalPrice || 0).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Users */}
          {active === 'users' && (
            <Card>
              <CardHeader><CardTitle>Users</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="Search name or email"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                  <Button variant="outline" onClick={() => loadUsers(userSearch || undefined)}>Search</Button>
                </div>
                {isLoadingUsers ? (
                  <p className="text-muted-foreground text-sm">Loading users...</p>
                ) : users.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No users found.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {users.map((u) => (
                      <li key={u._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/40 pb-2">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{u.name} <span className="text-muted-foreground font-normal">• {u.email}</span></p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={u.role}
                            onValueChange={async (value) => {
                              try {
                                await adminAPI.updateUserRole(u._id, { role: value });
                                toast("Role updated");
                                setUsers((prev) => prev.map((x) => (x._id === u._id ? { ...x, role: value as any } : x)));
                              } catch (err: any) {
                                toast(err.response?.data?.message || "Failed to update role");
                              }
                            }}
                          >
                            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Role" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              if (!confirm(`Delete user ${u.email}?`)) return;
                              try {
                                await adminAPI.deleteUser(u._id);
                                toast("User deleted");
                                setUsers((prev) => prev.filter((x) => x._id !== u._id));
                              } catch (err: any) {
                                toast(err.response?.data?.message || "Failed to delete user");
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}

          {/* Image Gallery */}
          {active === 'images' && (
            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Upload Image</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onDrop}
                    className="border-2 border-dashed border-border/60 rounded-xl h-40 flex items-center justify-center text-sm text-muted-foreground"
                  >
                    <div className="text-center space-y-2">
                      <CloudUpload className="mx-auto h-6 w-6" />
                      <p>Drag & drop or click to upload image</p>
                      <input type="file" accept="image/*" onChange={onPickFile} className="hidden" id="file-input" />
                      <label htmlFor="file-input" className="cursor-pointer underline">Choose file</label>
                      {file ? <p className="text-xs text-muted-foreground">Selected: {file.name}</p> : null}
                    </div>
                  </div>
                  <Button onClick={uploadImage} disabled={isUploading} className="w-full">{isUploading ? "Uploading..." : "Upload"}</Button>
                </CardContent>
              </Card>

              {images.length > 0 && (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {images.map((img) => (
                    <div key={img.public_id} className="rounded-xl overflow-hidden border border-border/60">
                      <img src={img.url} alt={img.public_id} className="w-full h-48 object-cover" />
                      <div className="p-3 flex items-center justify-between text-sm">
                        <span className="truncate max-w-[70%]" title={img.public_id}>{img.public_id.split('/').pop()}</span>
                        <Button size="sm" variant="outline" onClick={() => deleteImage(img.public_id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Slider Images */}
          {active === 'slider' && (
            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Add Slider Image</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">These images are used in the homepage hero carousel (shown in groups of three).</div>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={async (e) => {
                      e.preventDefault();
                      const f = e.dataTransfer.files?.[0];
                      if (!f) return;
                      setFile(f);
                    }}
                    className="border-2 border-dashed border-border/60 rounded-xl h-40 flex items-center justify-center text-sm text-muted-foreground"
                  >
                    <div className="text-center space-y-2">
                      <CloudUpload className="mx-auto h-6 w-6" />
                      <p>Drag & drop or click to upload image</p>
                      <input type="file" accept="image/*" onChange={onPickFile} className="hidden" id="slider-file-input" />
                      <label htmlFor="slider-file-input" className="cursor-pointer underline">Choose file</label>
                      {file ? <p className="text-xs text-muted-foreground">Selected: {file.name}</p> : null}
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <Input placeholder="Or paste image URL" value={sliderUrl} onChange={(e) => setSliderUrl(e.target.value)} />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (!sliderUrl.trim()) return;
                        const next: ImageItem = { url: sliderUrl.trim(), public_id: "", uploadedAt: new Date().toISOString() };
                        saveSlider([next, ...sliderImages]);
                        setSliderUrl("");
                      }}
                    >Add URL</Button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Button
                      onClick={async () => {
                        if (!file) { toast("Please choose an image"); return; }
                        try {
                          setIsUploading(true);
                          const form = new FormData();
                          form.append("image", file);
                          const res = await uploadAPI.uploadImage(form);
                          const data = res.data.data;
                          const next: ImageItem = { url: data.url, public_id: data.public_id, width: data.width, height: data.height, uploadedAt: new Date().toISOString() };
                          saveSlider([next, ...sliderImages]);
                          setFile(null);
                          toast("Added to slider");
                        } catch (err: any) {
                          toast(err.response?.data?.message || "Upload failed");
                        } finally {
                          setIsUploading(false);
                        }
                      }}
                      disabled={isUploading}
                    >{isUploading ? "Uploading..." : "Upload & Add"}</Button>
                    <Button variant="secondary" onClick={() => saveSlider([])}>Clear all</Button>
                  </div>
                </CardContent>
              </Card>

              {sliderImages.length > 0 && (
                <Card>
                  <CardHeader><CardTitle>Slider Images ({sliderImages.length})</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {sliderImages.map((img) => (
                        <div key={(img.public_id || img.url)} className="rounded-xl overflow-hidden border border-border/60">
                          <img src={img.url} alt={img.public_id || img.url} className="w-full h-48 object-cover" />
                          <div className="p-3 flex items-center justify-between text-sm">
                            <span className="truncate max-w-[70%]" title={img.public_id || img.url}>
                              {(img.public_id && img.public_id.split('/').pop()) || img.url}
                            </span>
                            <div className="flex items-center gap-2">
                              {img.public_id ? (
                                <Button size="sm" variant="outline" onClick={async () => {
                                  try {
                                    await uploadAPI.deleteImage(img.public_id);
                                  } catch {
                                    // ignore cloud delete error, still remove locally
                                  }
                                  saveSlider(sliderImages.filter((s) => s !== img));
                                  toast("Removed");
                                }}>Delete</Button>
                              ) : (
                                <Button size="sm" variant="outline" onClick={() => { saveSlider(sliderImages.filter((s) => s !== img)); toast("Removed"); }}>Remove</Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
