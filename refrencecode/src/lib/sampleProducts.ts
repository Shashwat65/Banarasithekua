export type SampleProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  stock: number;
  weight?: string;
  image: string;
};

import traditionalThekua from "@/assets/traditional-thekua.jpg";
import jaggeryThekua from "@/assets/jaggery-thekua.jpg";
import coconutThekua from "@/assets/coconut-thekua.jpg";
import premiumMixedThekua from "@/assets/premium-mixed-thekua.jpg";

export const sampleProducts: SampleProduct[] = [
  {
    id: "sample-traditional",
    slug: "traditional-thekua",
    name: "Traditional Thekua",
    description:
      "A heritage recipe from Bihar, slow-roasted in desi ghee with cane sugar caramel notes.",
    price: 299,
    originalPrice: 599,
    stock: 24,
    weight: "400g pack",
    image: traditionalThekua,
  },
  {
    id: "sample-jaggery",
    slug: "jaggery-thekua",
    name: "Jaggery Thekua",
    description:
      "Hand-pressed thekua sweetened with organic jaggery sourced from Muzaffarpur co-operatives.",
    price: 299,
    originalPrice: 599,
    stock: 0,
    weight: "350g tin",
    image: jaggeryThekua,
  },
  {
    id: "sample-coconut",
    slug: "coconut-thekua",
    name: "Coconut Thekua",
    description:
      "Crisp coconut shard thekua with toasted khopra and cardamom, perfect with evening chai.",
    price: 349,
    originalPrice: 699,
    stock: 12,
    weight: "375g box",
    image: coconutThekua,
  },
  {
    id: "sample-premium",
    slug: "premium-mixed-thekua",
    name: "Premium Mixed Thekua",
    description:
      "Festive hamper featuring jaggery, coconut & saffron thekua in a keepsake wooden caddy.",
    price: 449,
    originalPrice: 899,
    stock: 8,
    weight: "3 flavour combo",
    image: premiumMixedThekua,
  },
  {
    id: "sample-classic",
    slug: "classic-thekua",
    name: "Classic Thekua",
    description: "Handcrafted with wheat flour, jaggery, and pure ghee. A timeless Banarasi treat.",
    price: 199,
    originalPrice: 249,
    stock: 20,
    weight: "400g",
    image: traditionalThekua,
  },
];

export const findSampleProduct = (slug: string) =>
  sampleProducts.find((product) => product.slug === slug);
