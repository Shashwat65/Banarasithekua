import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { categoriesAPI, ordersAPI, productsAPI, sliderAPI, teamAPI, uploadAPI, videosAPI, bannersAPI } from "@/services/api";
import { toast } from "sonner";

const sections = [
  { key: "dashboard", label: "Dashboard", description: "Quick overview of store metrics and activity." },
  { key: "products", label: "Products", description: "Create, update, and manage your product catalog." },
  { key: "orders", label: "Orders", description: "Review and update order status across customers." },
  { key: "categories", label: "Categories", description: "Maintain category structure for product filtering." },
  { key: "team", label: "Team", description: "Manage team members shown on the website." },
  { key: "slider", label: "Slider", description: "Manage homepage slider images." },
  { key: "banners", label: "Banners", description: "Manage banners for header and other sections." },
  { key: "videos", label: "Video Reviews", description: "Manage short video reviews feed." },
];

type ImageItem = { url: string; public_id?: string; _id?: string };

type ProductForm = {
  name: string;
  slug: string;
  price: string;
  originalPrice: string;
  stock: string;
  category: string;
  weight: string;
  packSize: string;
  description: string;
  highlights: string;
};

type TeamForm = {
  name: string;
  role: string;
  photo: string;
  order: string;
  active: boolean;
};

type VideoForm = {
  title: string;
  description: string;
  videoType: 'upload' | 'youtube';
  videoUrl: string;
  thumbnailUrl: string;
  sortOrder: string;
  active: boolean;
};

type BannerForm = {
  title: string;
  imageUrl: string;
  link: string;
  position: 'header' | 'main' | 'sidebar' | 'footer';
  sortOrder: string;
  active: boolean;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const Admin = () => {
  const { section } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const active = section || "dashboard";
  const current = sections.find((s) => s.key === active) || sections[0];

  const [productForm, setProductForm] = useState<ProductForm>({
    name: "",
    slug: "",
    price: "",
    originalPrice: "",
    stock: "",
    category: "",
    weight: "",
    packSize: "",
    description: "",
    highlights: "",
  });
  const [productImages, setProductImages] = useState<ImageItem[]>([]);
  const [productFiles, setProductFiles] = useState<FileList | null>(null);
  const [productSaving, setProductSaving] = useState(false);
  const [productUploading, setProductUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "" });
  const [teamForm, setTeamForm] = useState<TeamForm>({ name: "", role: "", photo: "", order: "0", active: true });
  const [teamFile, setTeamFile] = useState<FileList | null>(null);
  const [teamUploading, setTeamUploading] = useState(false);

  const [sliderFile, setSliderFile] = useState<FileList | null>(null);
  const [sliderUploading, setSliderUploading] = useState(false);

  const [videoForm, setVideoForm] = useState<VideoForm>({ 
    title: "", 
    description: "", 
    videoType: "youtube", 
    videoUrl: "", 
    thumbnailUrl: "", 
    sortOrder: "0", 
    active: true 
  });
  const [videoFile, setVideoFile] = useState<FileList | null>(null);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoEditingId, setVideoEditingId] = useState<string | null>(null);

  const [bannerForm, setBannerForm] = useState<BannerForm>({ 
    title: "", 
    imageUrl: "", 
    link: "", 
    position: "main", 
    sortOrder: "0", 
    active: true 
  });
  const [bannerFile, setBannerFile] = useState<FileList | null>(null);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerEditingId, setBannerEditingId] = useState<string | null>(null);

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products"],
    enabled: active === "products" || active === "dashboard",
    queryFn: async () => {
      const res = await productsAPI.getAll();
      return res.data?.data || [];
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["admin-categories"],
    enabled: active === "products" || active === "categories",
    queryFn: async () => {
      const res = await categoriesAPI.getAll();
      return res.data?.data || [];
    },
  });

  const { data: ordersData } = useQuery({
    queryKey: ["admin-orders"],
    enabled: active === "orders" || active === "dashboard",
    queryFn: async () => {
      const res = await ordersAPI.getAll();
      return res.data?.data || [];
    },
  });

  const { data: teamData } = useQuery({
    queryKey: ["admin-team"],
    enabled: active === "team",
    queryFn: async () => {
      const res = await teamAPI.getAllAdmin();
      return res.data?.data || [];
    },
  });

  const { data: sliderData } = useQuery({
    queryKey: ["admin-slider"],
    enabled: active === "slider",
    queryFn: async () => {
      const res = await sliderAPI.getAllAdmin();
      return res.data?.data || [];
    },
  });

  const { data: videosData } = useQuery({
    queryKey: ["admin-videos"],
    enabled: active === "videos",
    queryFn: async () => {
      const res = await videosAPI.getAllAdmin();
      return res.data?.data || [];
    },
  });

  const { data: bannersData } = useQuery({
    queryKey: ["admin-banners"],
  const videos = Array.isArray(videosData) ? videosData : [];
  const banners = Array.isArray(bannersData) ? bannersData : [];
    enabled: active === "banners",
    queryFn: async () => {
      const res = await bannersAPI.getAllAdmin();
      return res.data?.data || [];
    },
  });

  useEffect(() => {
    if (productForm.name && !editingId) {
      setProductForm((prev) => ({ ...prev, slug: slugify(prev.name) }));
    }
  }, [productForm.name, editingId]);

  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  const products = Array.isArray(productsData) ? productsData : [];
  const orders = Array.isArray(ordersData) ? ordersData : [];
  const team = Array.isArray(teamData) ? teamData : [];
  const sliders = Array.isArray(sliderData) ? sliderData : [];

  const totalSales = useMemo(() => {
    return orders
      .filter((o: any) => o.paymentStatus === "paid")
      .reduce((sum: number, o: any) => sum + Number(o.totalAmount || o.totalPrice || 0), 0);
  }, [orders]);

  const monthlySales = useMemo(() => {
    const months = new Array(6).fill(0);
    orders.forEach((order: any) => {
      const date = new Date(order.orderDate || order.createdAt || Date.now());
      const monthIndex = new Date().getMonth() - date.getMonth();
      if (monthIndex >= 0 && monthIndex < months.length) {
        months[monthIndex] += Number(order.totalAmount || 0);
      }
    });
    return months.reverse();
  }, [orders]);

  const goTo = (key: string) => {
    const path = key === "dashboard" ? "/admin" : `/admin/${key}`;
    if (location.pathname !== path) navigate(path);
  };

  const uploadFiles = async (files: FileList) => {
    const uploads: ImageItem[] = [];
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("my_file", file);
      const res = await uploadAPI.uploadImage(form);
      if (res.data?.success && res.data?.data?.url) {
        uploads.push({ url: res.data.data.url, public_id: res.data.data.public_id });
      }
    }
    return uploads;
  };

  const handleUploadProductImages = async () => {
    if (!productFiles || productFiles.length === 0) {
      toast("Select images to upload");
      return;
    }
    setProductUploading(true);
    try {
      const uploaded = await uploadFiles(productFiles);
      setProductImages((prev) => [...prev, ...uploaded]);
      setProductFiles(null);
      toast("Images uploaded", { description: `${uploaded.length} image(s) added.` });
    } catch (error: any) {
      toast("Upload failed", { description: error?.response?.data?.message || "Please try again." });
    } finally {
      setProductUploading(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!productForm.name.trim()) {
      toast("Product name is required");
      return;
    }
    if (!productForm.price) {
      toast("Price is required");
      return;
    }
    setProductSaving(true);
    try {
      // Parse highlights from textarea (one per line)
      const highlights = productForm.highlights
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const payload = {
        name: productForm.name.trim(),
        slug: productForm.slug || slugify(productForm.name),
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        stock: productForm.stock ? Number(productForm.stock) : undefined,
        category: productForm.category || undefined,
        weight: productForm.weight || undefined,
        packSize: productForm.packSize || undefined,
        description: productForm.description || undefined,
        highlights: highlights.length > 0 ? highlights : undefined,
        images: productImages,
        image: productImages[0]?.url,
      };

      if (editingId) {
        await productsAPI.update(editingId, payload);
        toast("Product updated");
      } else {
        await productsAPI.create(payload);
        toast("Product created");
      }
      setEditingId(null);
      setProductForm({ name: "", slug: "", price: "", originalPrice: "", stock: "", category: "", weight: "", packSize: "", description: "", highlights: "" });
      setProductImages([]);
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    } catch (error: any) {
      toast("Save failed", { description: error?.response?.data?.message || "Please try again." });
    } finally {
      setProductSaving(false);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingId(product._id);
    setProductForm({
      name: product.name || "",
      slug: product.slug || "",
      price: String(product.price || ""),
      originalPrice: String(product.originalPrice || ""),
      stock: String(product.stock || ""),
      category: product.category?._id || product.category || "",
      weight: product.weight || "",
      packSize: product.packSize || "",
      description: product.description || "",
      highlights: Array.isArray(product.highlights) ? product.highlights.join("\n") : "",
    });
    setProductImages(Array.isArray(product.images) ? product.images : []);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await productsAPI.delete(id);
      toast("Product deleted");
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    } catch (error: any) {
      toast("Delete failed", { description: error?.response?.data?.message || "Please try again." });
    }
  };

  const handleAddCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast("Category name required");
      return;
    }
    try {
      await categoriesAPI.create({ name: categoryForm.name.trim(), slug: categoryForm.slug || slugify(categoryForm.name) });
      setCategoryForm({ name: "", slug: "" });
      await queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast("Category added");
    } catch (error: any) {
      toast("Category add failed", { description: error?.response?.data?.message || "Please try again." });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await categoriesAPI.delete(id);
      await queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast("Category deleted");
    } catch (error: any) {
      toast("Delete failed", { description: error?.response?.data?.message || "Please try again." });
    }
  };

  const handleCreateTeam = async () => {
    if (!teamForm.name.trim() || !teamForm.role.trim()) {
      toast("Name and role are required");
      return;
    }
    try {
      await teamAPI.create({
        name: teamForm.name.trim(),
        role: teamForm.role.trim(),
        photo: teamForm.photo || undefined,
        order: Number(teamForm.order) || 0,
        active: teamForm.active,
      });
      setTeamForm({ name: "", role: "", photo: "", order: "0", active: true });
      await queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      toast("Team member added");
    } catch (error: any) {
      toast("Failed to add member", { description: error?.response?.data?.message || "Please try again." });
    }
  };

  const handleUploadTeamPhoto = async () => {
    if (!teamFile || teamFile.length === 0) {
      toast("Select a photo to upload");
      return;
    }
    setTeamUploading(true);
    try {
      const uploaded = await uploadFiles(teamFile);
      if (uploaded[0]?.url) {
        setTeamForm((prev) => ({ ...prev, photo: uploaded[0].url }));
        toast("Photo uploaded");
      }
    } catch (error: any) {
      toast("Upload failed", { description: error?.response?.data?.message || "Please try again." });
    } finally {
      setTeamUploading(false);
      setTeamFile(null);
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm("Delete this team member?")) return;
    try {
      await teamAPI.delete(id);
      await queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      toast("Member deleted");
    } catch (error: any) {
      toast("Delete failed", { description: error?.response?.data?.message || "Please try again." });
    }
  };

  const handleUploadSlider = async () => {
    if (!sliderFile || sliderFile.length === 0) {
      toast("Select an image");
      return;
    }
    setSliderUploading(true);
    try {
      const uploaded = await uploadFiles(sliderFile);
      if (uploaded.length > 0) {
        await sliderAPI.create({ url: uploaded[0].url, public_id: uploaded[0].public_id });
        await queryClient.invalidateQueries({ queryKey: ["admin-slider"] });
        toast("Slider image added");
      }
    } catch (error: any) {
      toast("Upload failed", { description: error?.response?.data?.message || "Please try again." });
    } finally {
      setSliderUploading(false);
      setSliderFile(null);
    }
  };

  const handleDeleteSlider = async (id: string) => {
    if (!confirm("Remove slider image?")) return;
    try {
      await sliderAPI.delete(id);
      await queryClient.invalidateQueries({ queryKey: ["admin-slider"] });
      toast("Slider image removed");
    } catch (error: any) {
      toast("Delete failed", { description: error?.response?.data?.message || "Please try again." });
    }
  };

  const handleUploadVideo = async () => {
    if (videoForm.videoType === 'upload' && (!videoFile || videoFile.length === 0)) {
      toast("Select a video file");
      return;
    }
    if (videoForm.videoType === 'youtube' && !videoForm.videoUrl.trim()) {
      toast("Enter YouTube URL");
      return;
    }
    if (!videoForm.title.trim()) {
      toast("Enter video title");
      return;
    }

    setVideoUploading(true);
    try {
      let videoUrl = videoForm.videoUrl;
      
      if (videoForm.videoType === 'upload' && videoFile) {
        const form = new FormData();
        form.append("file", videoFile[0]);
        const res = await uploadAPI.uploadVideo(form);
        if (res.data?.success && res.data?.data?.url) {
          videoUrl = res.data.data.url;
        }
      }

      const payload = {
        title: videoForm.title,
        description: videoForm.description,
        videoType: videoForm.videoType,
        videoUrl,
        thumbnailUrl: videoForm.thumbnailUrl,
        sortOrder: Number(videoForm.sortOrder) || 0,
        active: videoForm.active,
      };

      if (videoEditingId) {
        await videosAPI.update(videoEditingId, payload);
        toast("Video updated");
      } else {
        await videosAPI.create(payload);
        toast("Video added");
      }

      await queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      setVideoForm({ title: "", description: "", videoType: "youtube", videoUrl: "", thumbnailUrl: "", sortOrder: "0", active: true });
      setVideoFile(null);
      setVideoEditingId(null);
    } catch (error: any) {
      toast("Operation failed", { description: error?.response?.data?.message || "Please try again." });
    } finally {
      setVideoUploading(false);
    }
  };

  const handleEditVideo = (video: any) => {
    setVideoForm({
      title: video.title,
      description: video.description || "",
      videoType: video.videoType,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl || "",
      sortOrder: String(video.sortOrder || 0),
      active: video.active !== false,
    });
    setVideoEditingId(video._id);
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    try {
      await videosAPI.delete(id);
      await queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      toast("Video deleted");
    } catch (error: any) {
      toast("Delete failed", { description: error?.response?.data?.message || "Please try again." });
    }
  };

  const handleUploadBanner = async () => {
    if (!bannerFile || bannerFile.length === 0) {
      toast("Select a banner image");
      return;
    }

    setBannerUploading(true);
    try {
      const form = new FormData();
      form.append("file", bannerFile[0]);
      const res = await uploadAPI.uploadBanner(form);
      
      if (res.data?.success && res.data?.data?.url) {
        const payload = {
          title: bannerForm.title,
          imageUrl: res.data.data.url,
          public_id: res.data.data.public_id,
          link: bannerForm.link,
          position: bannerForm.position,
          sortOrder: Number(bannerForm.sortOrder) || 0,
          active: bannerForm.active,
        };

        if (bannerEditingId) {
          await bannersAPI.update(bannerEditingId, payload);
          toast("Banner updated");
        } else {
          await bannersAPI.create(payload);
          toast("Banner added");
        }

        await queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
        setBannerForm({ title: "", imageUrl: "", link: "", position: "main", sortOrder: "0", active: true });
        setBannerFile(null);
        setBannerEditingId(null);
      }
    } catch (error: any) {
      toast("Upload failed", { description: error?.response?.data?.message || "Please try again." });
    } finally {
      setBannerUploading(false);
    }
  };

  const handleEditBanner = (banner: any) => {
    setBannerForm({
      title: banner.title || "",
      imageUrl: banner.imageUrl,
      link: banner.link || "",
      position: banner.position || "main",
      sortOrder: String(banner.sortOrder || 0),
      active: banner.active !== false,
    });
    setBannerEditingId(banner._id);
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try {
      await bannersAPI.delete(id);
      await queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      toast("Banner deleted");
    } catch (error: any) {
      toast("Delete failed", { description: error?.response?.data?.message || "Please try again." });
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await ordersAPI.updateStatus(orderId, { orderStatus: status });
      toast("Order status updated");
      await queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    } catch (error: any) {
      toast("Update failed", { description: error?.response?.data?.message || "Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-muted/10 py-10">
      <div className="container mx-auto px-6">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-secondary/50">Admin Panel</p>
              <h1 className="text-2xl font-semibold text-secondary">{current.label}</h1>
            </div>
            <div className="flex flex-col gap-2">
              {sections.map((s) => (
                <Button key={s.key} variant={active === s.key ? "default" : "outline"} onClick={() => goTo(s.key)}>
                  {s.label}
                </Button>
              ))}
            </div>
          </aside>

          <main className="space-y-6">
            {active === "dashboard" && (
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Sales</CardTitle>
                    <CardDescription>Paid orders only</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-semibold text-secondary">₹{totalSales.toFixed(0)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>Total orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-semibold text-secondary">{orders.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>Active catalog items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-semibold text-secondary">{products.length}</p>
                  </CardContent>
                </Card>

                <Card className="md:col-span-3">
                  <CardHeader>
                    <CardTitle>Sales trend</CardTitle>
                    <CardDescription>Last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-6 gap-3 items-end h-32">
                      {monthlySales.map((value, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2">
                          <div className="w-full rounded-full bg-primary/15 h-24 flex items-end">
                            <div
                              className="w-full rounded-full bg-primary"
                              style={{ height: `${Math.min(100, (value / (totalSales || 1)) * 120)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground">M{idx + 1}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {active === "products" && (
              <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>{editingId ? "Edit product" : "Add new product"}</CardTitle>
                    <CardDescription>All fields are editable and saved to the live catalog.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Product name</Label>
                        <Input id="name" value={productForm.name} onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" value={productForm.slug} onChange={(e) => setProductForm((p) => ({ ...p, slug: slugify(e.target.value) }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <Input id="price" type="number" value={productForm.price} onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="originalPrice">Original price</Label>
                        <Input id="originalPrice" type="number" value={productForm.originalPrice} onChange={(e) => setProductForm((p) => ({ ...p, originalPrice: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock">Stock</Label>
                        <Input id="stock" type="number" value={productForm.stock} onChange={(e) => setProductForm((p) => ({ ...p, stock: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={productForm.category} onValueChange={(value) => setProductForm((p) => ({ ...p, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat: any) => (
                              <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight</Label>
                        <Input id="weight" value={productForm.weight} onChange={(e) => setProductForm((p) => ({ ...p, weight: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="packSize">Pack size</Label>
                        <Input id="packSize" value={productForm.packSize} onChange={(e) => setProductForm((p) => ({ ...p, packSize: e.target.value }))} />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" rows={4} value={productForm.description} onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))} />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="highlights">Highlights (one per line)</Label>
                        <Textarea id="highlights" rows={3} value={productForm.highlights} onChange={(e) => setProductForm((p) => ({ ...p, highlights: e.target.value }))} />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label>Product images</Label>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Input type="file" multiple onChange={(e) => setProductFiles(e.target.files)} />
                        <Button type="button" variant="outline" onClick={handleUploadProductImages} disabled={productUploading}>
                          {productUploading ? "Uploading..." : "Upload"}
                        </Button>
                      </div>
                      {productImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {productImages.map((img, idx) => (
                            <div key={`${img.url}-${idx}`} className="rounded-lg overflow-hidden border">
                              <img src={img.url} alt={`Uploaded ${idx + 1}`} className="h-24 w-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={handleSaveProduct} disabled={productSaving}>
                        {productSaving ? "Saving..." : editingId ? "Save changes" : "Add product"}
                      </Button>
                      {editingId && (
                        <Button variant="outline" onClick={() => {
                          setEditingId(null);
                          setProductForm({ name: "", slug: "", price: "", originalPrice: "", stock: "", category: "", weight: "", packSize: "", description: "", highlights: "" });
                          setProductImages([]);
                        }}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Product list</CardTitle>
                    <CardDescription>Click a product to edit or delete it.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {productsLoading && <p className="text-sm text-muted-foreground">Loading products...</p>}
                    {products.map((product: any) => (
                      <div key={product._id} className="rounded-xl border p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-secondary">{product.name}</p>
                            <p className="text-xs text-muted-foreground">₹{Number(product.price || 0).toFixed(0)}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>Edit</Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteProduct(product._id)}>Delete</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {active === "categories" && (
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                  <CardDescription>Create or remove categories for products.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                    <Input placeholder="Category name" value={categoryForm.name} onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))} />
                    <Input placeholder="Slug" value={categoryForm.slug} onChange={(e) => setCategoryForm((p) => ({ ...p, slug: e.target.value }))} />
                    <Button onClick={handleAddCategory}>Add</Button>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    {categories.map((cat: any) => (
                      <div key={cat._id} className="flex items-center justify-between border-b pb-2 text-sm">
                        <div>
                          <p className="font-medium text-secondary">{cat.name}</p>
                          <p className="text-xs text-muted-foreground">{cat.slug}</p>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteCategory(cat._id)}>Delete</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {active === "orders" && (
              <Card>
                <CardHeader>
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>Full order details with customer address and payment status.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orders.map((order: any) => (
                    <div key={order._id} className="rounded-xl border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-secondary">Order #{order._id}</p>
                          <p className="text-xs text-muted-foreground">Payment: {order.paymentStatus}</p>
                        </div>
                        <p className="font-semibold">₹{Number(order.totalAmount || 0).toFixed(0)}</p>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-muted-foreground">Current status: <span className="text-secondary font-medium">{order.orderStatus || "pending"}</span></div>
                        <Select
                          value={order.orderStatus || "pending"}
                          onValueChange={(value) => handleUpdateOrderStatus(order._id, value)}
                        >
                          <SelectTrigger className="w-full sm:w-[220px]">
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="out-for-delivery">Out for delivery</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2 text-sm text-muted-foreground">
                        <p><span className="text-secondary">Name:</span> {order.userName || "Guest"}</p>
                        <p><span className="text-secondary">Phone:</span> {order.userPhone || order.addressInfo?.phone || "-"}</p>
                        <p><span className="text-secondary">Email:</span> {order.userEmail || "-"}</p>
                        <p><span className="text-secondary">Address:</span> {order.addressInfo?.address || "-"}, {order.addressInfo?.city || ""}, {order.addressInfo?.pincode || ""}</p>
                        {order.addressInfo?.notes && <p><span className="text-secondary">Notes:</span> {order.addressInfo?.notes}</p>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {active === "team" && (
              <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Add team member</CardTitle>
                    <CardDescription>Member data is shown in the public team section.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input value={teamForm.name} onChange={(e) => setTeamForm((p) => ({ ...p, name: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Input value={teamForm.role} onChange={(e) => setTeamForm((p) => ({ ...p, role: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Order</Label>
                        <Input type="number" value={teamForm.order} onChange={(e) => setTeamForm((p) => ({ ...p, order: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Photo URL</Label>
                        <Input value={teamForm.photo} onChange={(e) => setTeamForm((p) => ({ ...p, photo: e.target.value }))} />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input type="file" onChange={(e) => setTeamFile(e.target.files)} />
                      <Button variant="outline" onClick={handleUploadTeamPhoto} disabled={teamUploading}>
                        {teamUploading ? "Uploading..." : "Upload photo"}
                      </Button>
                    </div>

                    <Button onClick={handleCreateTeam}>Add member</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Team list</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {team.map((member: any) => (
                      <div key={member._id} className="flex items-center justify-between border-b pb-2 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-muted">
                            {member.photo ? (
                              <img src={member.photo} alt={member.name} className="h-full w-full object-cover" />
                            ) : null}
                          </div>
                          <div>
                            <p className="font-medium text-secondary">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteTeam(member._id)}>Delete</Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {active === "slider" && (
              <Card>
                <CardHeader>
                  <CardTitle>Slider images</CardTitle>
                  <CardDescription>Images are displayed in the homepage hero under the header.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input type="file" onChange={(e) => setSliderFile(e.target.files)} />
                    <Button variant="outline" onClick={handleUploadSlider} disabled={sliderUploading}>
                      {sliderUploading ? "Uploading..." : "Upload slider image"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {sliders.map((img: any) => (
                      <div key={img._id} className="rounded-lg overflow-hidden border relative">
                        <img src={img.url} alt="Slider" className="h-28 w-full object-cover" />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-1 right-1"
                          onClick={() => handleDeleteSlider(img._id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {active === "banners" && (
              <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>{bannerEditingId ? "Edit Banner" : "Add Banner"}</CardTitle>
                    <CardDescription>Manage banners for different sections of the website.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={bannerForm.title} onChange={(e) => setBannerForm((p) => ({ ...p, title: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Link (optional)</Label>
                        <Input value={bannerForm.link} onChange={(e) => setBannerForm((p) => ({ ...p, link: e.target.value }))} placeholder="https://..." />
                      </div>
                      <div className="space-y-2">
                        <Label>Position</Label>
                        <Select value={bannerForm.position} onValueChange={(value: any) => setBannerForm((p) => ({ ...p, position: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="header">Header</SelectItem>
                            <SelectItem value="main">Main</SelectItem>
                            <SelectItem value="sidebar">Sidebar</SelectItem>
                            <SelectItem value="footer">Footer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Sort Order</Label>
                        <Input type="number" value={bannerForm.sortOrder} onChange={(e) => setBannerForm((p) => ({ ...p, sortOrder: e.target.value }))} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Banner Image</Label>
                      <Input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files)} />
                    </div>

                    <Button onClick={handleUploadBanner} disabled={bannerUploading}>
                      {bannerUploading ? "Uploading..." : bannerEditingId ? "Update Banner" : "Add Banner"}
                    </Button>
                    {bannerEditingId && (
                      <Button variant="outline" onClick={() => { setBannerEditingId(null); setBannerForm({ title: "", imageUrl: "", link: "", position: "main", sortOrder: "0", active: true }); }}>
                        Cancel Edit
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Banner List</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {banners.map((banner: any) => (
                      <div key={banner._id} className="rounded-lg overflow-hidden border">
                        <img src={banner.imageUrl} alt={banner.title} className="h-24 w-full object-cover" />
                        <div className="p-3 space-y-2">
                          <p className="font-medium text-sm">{banner.title || "Untitled"}</p>
                          <p className="text-xs text-muted-foreground">Position: {banner.position}</p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditBanner(banner)}>Edit</Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteBanner(banner._id)}>Delete</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {active === "videos" && (
              <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>{videoEditingId ? "Edit Video" : "Add Video Review"}</CardTitle>
                    <CardDescription>Manage short-form video reviews (YouTube or uploaded videos).</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Video Type</Label>
                      <Select value={videoForm.videoType} onValueChange={(value: any) => setVideoForm((p) => ({ ...p, videoType: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="youtube">YouTube Link</SelectItem>
                          <SelectItem value="upload">Upload Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={videoForm.title} onChange={(e) => setVideoForm((p) => ({ ...p, title: e.target.value }))} placeholder="Video title" />
                      </div>
                      <div className="space-y-2">
                        <Label>Sort Order</Label>
                        <Input type="number" value={videoForm.sortOrder} onChange={(e) => setVideoForm((p) => ({ ...p, sortOrder: e.target.value }))} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea value={videoForm.description} onChange={(e) => setVideoForm((p) => ({ ...p, description: e.target.value }))} placeholder="Video description" rows={3} />
                    </div>

                    {videoForm.videoType === 'youtube' ? (
                      <div className="space-y-2">
                        <Label>YouTube URL</Label>
                        <Input value={videoForm.videoUrl} onChange={(e) => setVideoForm((p) => ({ ...p, videoUrl: e.target.value }))} placeholder="https://youtube.com/watch?v=... or https://youtu.be/..." />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label>Upload Video</Label>
                        <Input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files)} />
                      </div>
                    )}

                    <Button onClick={handleUploadVideo} disabled={videoUploading}>
                      {videoUploading ? "Processing..." : videoEditingId ? "Update Video" : "Add Video"}
                    </Button>
                    {videoEditingId && (
                      <Button variant="outline" onClick={() => { setVideoEditingId(null); setVideoForm({ title: "", description: "", videoType: "youtube", videoUrl: "", thumbnailUrl: "", sortOrder: "0", active: true }); }}>
                        Cancel Edit
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Video List</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {videos.map((video: any) => (
                      <div key={video._id} className="rounded-lg border p-3 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm">{video.title}</p>
                            <p className="text-xs text-muted-foreground">{video.videoType === 'youtube' ? 'YouTube' : 'Uploaded'}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${video.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {video.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        {video.description && <p className="text-xs text-muted-foreground">{video.description.slice(0, 60)}...</p>}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditVideo(video)}>Edit</Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteVideo(video._id)}>Delete</Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Admin;
