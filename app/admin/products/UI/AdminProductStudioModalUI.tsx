import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sparkles,
    Upload,
    Image as ImageIcon,
    Plus,
    X,
    Check,
    Tag,
    Layers,
    DollarSign,
    Eye,
    SlidersHorizontal,
} from "lucide-react";
import {
    PRODUCT_CATEGORIES,
    STANDARD_SIZES,
    PRODUCT_BADGES,
} from "@/lib/product-store";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PRESET_COLORS } from "@/lib/constants";
import { AdminImageGalleryPicker } from "../_components/AdminImageGalleryPicker";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AdminProductStudioModalUIProps } from "@/types/studio";

const AdminProductStudioModalUI = ({
    onClose,
    isEdit,
    handleSubmit,
    handleToggleColor,
    handleToggleSize,
    handleAddCustomSize,
    handleFileUpload,
    name,
    setName,
    effectiveCategory,
    category,
    setCategory,
    sizes,
    setSizes,
    customCategory,
    setCustomCategory,
    badge,
    setBadge,
    fit,
    setFit,
    customSizeInput,
    setCustomSizeInput,
    price,
    setPrice,
    originalPrice,
    setOriginalPrice,
    stock,
    setStock,
    inStock,
    setInStock,
    featured,
    setFeatured,
    imageInputMode,
    setImageInputMode,
    description,
    setDescription,
    image,
    setImage,
    isGalleryOpen,
    setIsGalleryOpen,
    previewSize,
    setPreviewSize,
    fileInputRef,
    discountPercent,
    effectivePrice,
    effectiveOrigPrice,
    colors
}: AdminProductStudioModalUIProps) => {
    return (
        <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/60 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                            {isEdit
                                ? "Edit Streetwear Product"
                                : "Add New Drop to Storefront"}
                          
                        </h2>
                        <p className="text-xs text-slate-400">
                            Configure sizes, visuals, pricing, and live streetwear styling
                            with real-time preview.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Body: Two Columns */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Form Panel */}
                <form
                    onSubmit={handleSubmit}
                    id="product-studio-form"
                    className="lg:col-span-7 p-6 space-y-6 border-b lg:border-b-0 lg:border-r border-white/10 overflow-y-auto max-h-[calc(92vh-130px)]"
                >
                    {/* 1. Basic Info */}
                    <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/50 p-5">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300">
                            <Tag className="h-3.5 w-3.5" /> 1. Product Identity
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="prod-name"
                                className="text-xs text-slate-300 font-medium"
                            >
                                Product Title <span className="text-red-400">*</span>
                            </Label>
                            <Input
                                id="prod-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Acid Wash Skeleton Claw Tee"
                                className="bg-slate-950 border-white/10 text-white rounded-xl placeholder:text-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                required
                            />
                        </div>

                        {/* Category Selection */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs text-slate-300 font-medium">
                                    Category
                                </Label>
                                <span className="text-[11px] text-slate-400">
                                    Selected:{" "}
                                    <strong className="text-amber-300">
                                        {effectiveCategory}
                                    </strong>
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {PRODUCT_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => {
                                            setCategory(cat);
                                            if (
                                                cat === "Caps" ||
                                                cat === "Bags" ||
                                                cat === "Accessories"
                                            ) {
                                                setSizes(["One Size"]);
                                            } else if (
                                                sizes.includes("One Size") &&
                                                sizes.length === 1
                                            ) {
                                                setSizes(["S", "M", "L", "XL"]);
                                            }
                                        }}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${category === cat
                                            ? "bg-amber-300 text-slate-950 font-bold shadow-md shadow-amber-300/20"
                                            : "bg-slate-950 border border-white/10 text-slate-300 hover:bg-slate-800"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setCategory("Custom")}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${category === "Custom"
                                        ? "bg-amber-300 text-slate-950 font-bold"
                                        : "bg-slate-950 border border-dashed border-white/20 text-slate-300 hover:bg-slate-800"
                                        }`}
                                >
                                    + Custom
                                </button>
                            </div>
                            {category === "Custom" && (
                                <Input
                                    value={customCategory}
                                    onChange={(e) => setCustomCategory(e.target.value)}
                                    placeholder="Enter custom category name (e.g. Footwear, Beanies)..."
                                    className="mt-2 bg-slate-950 border-white/10 text-white rounded-xl"
                                />
                            )}
                        </div>

                        {/* Promo Badge & Fit */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div className="space-y-1.5">
                                <Label className="text-xs text-slate-300">Promo Badge</Label>
                                <select
                                    value={badge}
                                    onChange={(e) => setBadge(e.target.value)}
                                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-amber-300"
                                >
                                    <option value="">No Badge</option>
                                    {PRODUCT_BADGES.map((b) => (
                                        <option key={b} value={b}>
                                            {b}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs text-slate-300">Fit Guide</Label>
                                <Input
                                    value={fit}
                                    onChange={(e) => setFit(e.target.value)}
                                    placeholder="e.g. Boxy oversized fit"
                                    className="bg-slate-950 border-white/10 text-white rounded-xl text-xs"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. Pricing & Stock */}
                    <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/50 p-5">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300">
                            <DollarSign className="h-3.5 w-3.5" /> 2. Pricing & Stock
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs text-slate-300">
                                    Price (ZAR R) <span className="text-red-400">*</span>
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                                        R
                                    </span>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={price}
                                        onChange={(e) =>
                                            setPrice(
                                                e.target.value === "" ? "" : Number(e.target.value),
                                            )
                                        }
                                        className="pl-7 bg-slate-950 border-white/10 text-white rounded-xl font-semibold"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs text-slate-300">
                                    Compare-at Price (Sale)
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                                        R
                                    </span>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={originalPrice}
                                        onChange={(e) =>
                                            setOriginalPrice(
                                                e.target.value === "" ? "" : Number(e.target.value),
                                            )
                                        }
                                        placeholder="e.g. 550"
                                        className="pl-7 bg-slate-950 border-white/10 text-white rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs text-slate-300">Stock Quantity</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={stock}
                                    onChange={(e) =>
                                        setStock(
                                            e.target.value === "" ? "" : Number(e.target.value),
                                        )
                                    }
                                    placeholder="50"
                                    className="bg-slate-950 border-white/10 text-white rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300 select-none">
                                <input
                                    type="checkbox"
                                    checked={inStock}
                                    onChange={(e) => setInStock(e.target.checked)}
                                    className="h-4 w-4 rounded border-white/20 bg-slate-950 text-amber-400 focus:ring-0 focus:ring-offset-0"
                                />
                                In Stock (Available for Purchase)
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300 select-none">
                                <input
                                    type="checkbox"
                                    checked={featured}
                                    onChange={(e) => setFeatured(e.target.checked)}
                                    className="h-4 w-4 rounded border-white/20 bg-slate-950 text-amber-400 focus:ring-0 focus:ring-offset-0"
                                />
                                ⭐ Feature on Homepage
                            </label>
                        </div>
                    </div>

                    {/* 3. Sizes & Variations */}
                    <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/50 p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300">
                                <Layers className="h-3.5 w-3.5" /> 3. Available Sizes
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSizes(["S", "M", "L", "XL"])}
                                    className="text-[11px] text-slate-400 hover:text-amber-300 underline"
                                >
                                    Standard (S-XL)
                                </button>
                                <span className="text-slate-600">|</span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSizes(["XS", "S", "M", "L", "XL", "XXL", "3XL"])
                                    }
                                    className="text-[11px] text-slate-400 hover:text-amber-300 underline"
                                >
                                    All (XS-3XL)
                                </button>
                                <span className="text-slate-600">|</span>
                                <button
                                    type="button"
                                    onClick={() => setSizes(["One Size"])}
                                    className="text-[11px] text-slate-400 hover:text-amber-300 underline"
                                >
                                    One Size
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {STANDARD_SIZES.map((s) => {
                                const isSelected = sizes.includes(s);
                                return (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => handleToggleSize(s)}
                                        className={`min-w-[44px] h-10 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${isSelected
                                            ? "bg-amber-300 text-slate-950 shadow-md shadow-amber-300/20 ring-2 ring-amber-300"
                                            : "bg-slate-950 border border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                                            }`}
                                    >
                                        {s}
                                        {isSelected && <Check size={12} className="stroke-[3]" />}
                                    </button>
                                );
                            })}
                            <button
                                type="button"
                                onClick={() => handleToggleSize("One Size")}
                                className={`h-10 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${sizes.includes("One Size")
                                    ? "bg-amber-300 text-slate-950 shadow-md shadow-amber-300/20 ring-2 ring-amber-300"
                                    : "bg-slate-950 border border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                                    }`}
                            >
                                One Size
                                {sizes.includes("One Size") && (
                                    <Check size={12} className="stroke-[3]" />
                                )}
                            </button>
                        </div>

                        {/* Custom size tags */}
                        <div className="flex items-center gap-2 pt-1">
                            <Input
                                placeholder="Add custom size (e.g. 28, 30, US 9)..."
                                value={customSizeInput}
                                onChange={(e) => setCustomSizeInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddCustomSize();
                                    }
                                }}
                                className="bg-slate-950 border-white/10 text-white rounded-xl text-xs h-9"
                            />
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={handleAddCustomSize}
                                className="h-9 border-white/10 text-slate-200 hover:bg-slate-800"
                            >
                                <Plus size={14} /> Add
                            </Button>
                        </div>

                        {sizes.some(
                            (s) =>
                                !STANDARD_SIZES.includes(
                                    s as (typeof STANDARD_SIZES)[number],
                                ) && s !== "One Size",
                        ) && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    <span className="text-[11px] text-slate-400 self-center">
                                        Custom sizes:
                                    </span>
                                    {sizes
                                        .filter(
                                            (s) =>
                                                !STANDARD_SIZES.includes(
                                                    s as (typeof STANDARD_SIZES)[number],
                                                ) && s !== "One Size",
                                        )
                                        .map((customS) => (
                                            <span
                                                key={customS}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold"
                                            >
                                                {customS}
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleSize(customS)}
                                                    className="hover:text-red-400"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                </div>
                            )}
                    </div>

                    {/* 4. Visual Asset / Image */}
                    <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/50 p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300">
                                <ImageIcon className="h-3.5 w-3.5" /> 4. Product Image & Visuals
                            </div>
                            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setImageInputMode("upload")}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${imageInputMode === "upload"
                                        ? "bg-amber-300 text-slate-950"
                                        : "text-slate-400 hover:text-white"
                                        }`}
                                >
                                    Upload
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImageInputMode("gallery")}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${imageInputMode === "gallery"
                                        ? "bg-amber-300 text-slate-950"
                                        : "text-slate-400 hover:text-white"
                                        }`}
                                >
                                    Gallery
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImageInputMode("url")}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${imageInputMode === "url"
                                        ? "bg-amber-300 text-slate-950"
                                        : "text-slate-400 hover:text-white"
                                        }`}
                                >
                                    URL / Path
                                </button>
                            </div>
                        </div>

                        {imageInputMode === "upload" && (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="cursor-pointer border-2 border-dashed border-white/20 hover:border-amber-300/60 rounded-2xl p-6 text-center bg-slate-950/60 hover:bg-slate-900 transition-all group"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <div className="h-12 w-12 rounded-full bg-amber-400/10 text-amber-300 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Upload className="h-6 w-6" />
                                </div>
                                <p className="mt-3 text-sm font-medium text-white">
                                    Click or Drag & Drop Product Image
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Supports PNG, JPG, WEBP up to 5MB. Stored instantly with high
                                    visual fidelity.
                                </p>
                            </div>
                        )}

                        {imageInputMode === "gallery" && (
                            <div className="space-y-3">
                                <Button
                                    type="button"
                                    onClick={() => setIsGalleryOpen(true)}
                                    className="w-full bg-amber-300 hover:bg-amber-400 text-slate-950 font-bold py-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-300/10"
                                >
                                    <Sparkles className="h-4 w-4" /> Open Brand Photography
                                    Gallery
                                </Button>
                                <p className="text-xs text-slate-400 text-center">
                                    Browse official Drippy Banks catalog images from tees, caps,
                                    hoodies, and bags.
                                </p>
                            </div>
                        )}

                        {imageInputMode === "url" && (
                            <div className="space-y-2">
                                <Label className="text-xs text-slate-300">
                                    Public Path or Web URL
                                </Label>
                                <Input
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    placeholder="e.g. /hoodieBlueFront.png or https://..."
                                    className="bg-slate-950 border-white/10 text-white rounded-xl text-xs"
                                />
                            </div>
                        )}

                        {/* Image Preview strip */}
                        {image && (
                            <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-950 border border-white/10">
                                <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-slate-900 border border-white/10 flex-shrink-0">
                                    <Image
                                        src={image}
                                        alt="Selected Preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-white truncate">
                                        Active Product Visual
                                    </p>
                                    <p className="text-[11px] text-slate-400 truncate">
                                        {image.startsWith("data:") ? "Custom Uploaded Data" : image}
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setIsGalleryOpen(true)}
                                    className="text-xs text-amber-300 hover:text-amber-200"
                                >
                                    Change
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* 5. Colors & Story */}
                    <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/50 p-5">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300">
                            <SlidersHorizontal className="h-3.5 w-3.5" /> 5. Colorways &
                            Garment Details
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-slate-300 font-medium">
                                Available Colorways
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {PRESET_COLORS.map((col) => {
                                    const isSelected = colors.includes(col.name);
                                    return (
                                        <button
                                            key={col.name}
                                            type="button"
                                            onClick={() => handleToggleColor(col.name)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${isSelected
                                                ? "bg-slate-800 border-2 border-amber-300 text-white shadow-sm"
                                                : "bg-slate-950 border border-white/10 text-slate-400 hover:text-white"
                                                }`}
                                        >
                                            <span
                                                className="h-3 w-3 rounded-full border border-white/30"
                                                style={{ backgroundColor: col.hex }}
                                            />
                                            {col.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-2 pt-1">
                            <Label className="text-xs text-slate-300 font-medium">
                                Product Narrative & Fabric Notes
                            </Label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the fabric weight, streetwear cut, wash technique, and design highlights..."
                                rows={3}
                                className="bg-slate-950 border-white/10 text-white rounded-xl text-xs resize-none placeholder:text-slate-500"
                            />
                        </div>
                    </div>
                </form>

                {/* Right Preview Panel */}
                <div className="lg:col-span-5 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 flex flex-col justify-between overflow-y-auto max-h-[calc(92vh-130px)]">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-white/10">
                            <span className="text-xs uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                <Eye className="h-3.5 w-3.5 text-cyan-300" /> Live Storefront
                                Preview
                            </span>
                            <span className="text-[10px] text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20">
                                Synchronized
                            </span>
                        </div>

                        {/* Mock Product Card */}
                        <div className="mx-auto max-w-sm rounded-[1.75rem] border border-white/15 bg-slate-900/95 overflow-hidden shadow-2xl shadow-slate-950/60 group relative">
                            <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-950">
                                {image ? (
                                    <Image
                                        src={image}
                                        alt={name || "Preview Product"}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-slate-600">
                                        <ImageIcon className="h-12 w-12 stroke-1" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />

                                {/* Category Badge */}
                                <span className="absolute left-4 top-4 rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300 border border-white/10">
                                    {effectiveCategory}
                                </span>

                                {/* Promo / Drop Badge */}
                                {badge && (
                                    <span className="absolute right-4 top-4 rounded-full bg-amber-400 text-slate-950 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-lg">
                                        {badge}
                                    </span>
                                )}

                                {/* Quick Add Button simulation */}
                                <div className="absolute bottom-4 right-4 h-11 w-11 rounded-full bg-amber-300 text-slate-950 flex items-center justify-center shadow-lg font-bold">
                                    <Plus size={20} />
                                </div>

                                {/* In-Stock Indicator */}
                                <div className="absolute bottom-4 left-4">
                                    {inStock ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-[10px] font-semibold text-emerald-300 backdrop-blur-md">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            In Stock ({typeof stock === "number" ? stock : 50})
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/30 text-[10px] font-semibold text-red-300 backdrop-blur-md">
                                            Sold Out
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Card Details */}
                            <div className="p-5 space-y-3">
                                <div>
                                    <h3 className="text-base font-bold text-white leading-tight">
                                        {name || "Untiled Streetwear Piece"}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1">{fit}</p>
                                </div>

                                {/* Sizes interactive demo */}
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Select Size:
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {sizes.map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setPreviewSize(s)}
                                                className={`px-2 py-0.5 rounded-md text-[11px] font-bold border transition-all ${previewSize === s
                                                    ? "bg-amber-300 text-slate-950 border-amber-300"
                                                    : "bg-slate-950 text-slate-300 border-white/10 hover:border-white/30"
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Pricing Box */}
                                <div className="pt-2 flex items-center justify-between border-t border-white/10">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-extrabold text-amber-300">
                                            R{effectivePrice.toFixed(2)}
                                        </span>
                                        {effectiveOrigPrice && (
                                            <span className="text-xs text-slate-400 line-through">
                                                R{effectiveOrigPrice.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    {discountPercent > 0 && (
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 border border-red-500/30">
                                            Save {discountPercent}%
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick tips */}
                    <div className="mt-6 p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-400 space-y-1">
                        <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Admin Studio
                            Tips
                        </p>
                        <p>
                            Changes take effect across the entire shop immediately upon
                            publishing. You can also duplicate products in the catalog to
                            quickly make color or silhouette variants.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md">
                <div className="text-xs text-slate-400">
                    {isEdit
                        ? "Editing active catalog entry"
                        : "New product will be added directly to the catalog"}
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="border-white/10 text-slate-300 hover:bg-slate-800 rounded-xl"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="product-studio-form"
                        className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 rounded-xl shadow-lg shadow-amber-400/20"
                    >
                        {isEdit ? "Save Changes" : "Publish Product to Shop"}
                    </Button>
                </div>
            </div>

            {/* Brand Gallery Picker Modal */}
            <AdminImageGalleryPicker
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                onSelectImage={(selectedPath) => {
                    setImage(selectedPath);
                    toast.success("Gallery asset selected.");
                }}
                currentImage={image}
            />
        </>
    );
};

export default AdminProductStudioModalUI;
