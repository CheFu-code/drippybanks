import type { Product } from "@/context/CartContext";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface AdminProductStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: Product | null;
  onSaveProduct: (productData: Omit<Product, "id"> & { id?: string }) => void | Promise<void>;
}

export interface InnerStudioFormProps {
  initialProduct?: Product | null;
  onClose: () => void;
  onSaveProduct: (productData: Omit<Product, "id"> & { id?: string }) => void | Promise<void>;
}

export interface AdminProductStudioModalUIProps {
  onClose: () => void;
  isEdit: boolean;
  handleSubmit: (e: React.FormEvent<Element>) => void;
  handleToggleColor: (colorName: string) => void;
  handleToggleSize: (sizeOption: string) => void;
  handleAddCustomSize: () => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement, Element>) => void;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  effectiveCategory: string;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  sizes: string[];
  setSizes: React.Dispatch<React.SetStateAction<string[]>>;
  customCategory: string;
  setCustomCategory: React.Dispatch<React.SetStateAction<string>>;
  badge: string;
  setBadge: React.Dispatch<React.SetStateAction<string>>;
  fit: string;
  setFit: React.Dispatch<React.SetStateAction<string>>;
  customSizeInput: string;
  setCustomSizeInput: React.Dispatch<React.SetStateAction<string>>;
  price: number | "";
  setPrice: React.Dispatch<React.SetStateAction<number | "">>;
  originalPrice: number | "";
  setOriginalPrice: React.Dispatch<React.SetStateAction<number | "">>;
  stock: number | "";
  setStock: React.Dispatch<React.SetStateAction<number | "">>;
  inStock: boolean;
  setInStock: React.Dispatch<React.SetStateAction<boolean>>;
  featured: boolean;
  setFeatured: React.Dispatch<React.SetStateAction<boolean>>;
  imageInputMode: "upload" | "gallery" | "url";
  setImageInputMode: React.Dispatch<
    React.SetStateAction<"upload" | "gallery" | "url">
  >;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  isGalleryOpen: boolean;
  setIsGalleryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  previewSize: string;
  setPreviewSize: React.Dispatch<React.SetStateAction<string>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  discountPercent: number;
  effectivePrice: number;
  effectiveOrigPrice: number | null;
  colors: string[];
  isUploadingImage?: boolean;
  isSubmitting?: boolean;
}

export interface AdminProductsPageUIProps {
  router: AppRouterInstance;
  handleOpenCreate: () => void;
  handleExport: () => void;
  metrics: {
    total: number;
    inStockCount: number;
    lowStockCount: number;
    featuredCount: number;
    avgPrice: number;
  };
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  stockFilter: "inStock" | "all" | "lowStock" | "outOfStock";
  setStockFilter: React.Dispatch<
    React.SetStateAction<"inStock" | "all" | "lowStock" | "outOfStock">
  >;
  handleOpenEdit: (product: Product) => void;
  sortBy: "name" | "stock" | "newest" | "priceAsc" | "priceDesc";
  setSortBy: React.Dispatch<
    React.SetStateAction<"name" | "stock" | "newest" | "priceAsc" | "priceDesc">
  >;
  viewMode: "grid" | "table";
  setViewMode: React.Dispatch<React.SetStateAction<"grid" | "table">>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  filteredProducts: Product[];
  toggleStock: (id: string) => Product[] | Promise<Product[]>;
  handleDelete: (id: string, name: string) => void | Promise<void>;
  handleSaveProduct: (
    productData: Omit<Product, "id"> & {
      id?: string;
    },
  ) => void | Promise<void>;
  categoryCounts: Record<string, number>;
  isStudioOpen: boolean;
  setIsStudioOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingProduct: Product | null;
}
