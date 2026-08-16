import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PRESET_COLORS } from "@/lib/constants";
import {
    PRODUCT_BADGES,
    PRODUCT_CATEGORIES,
    STANDARD_SIZES,
} from "@/lib/product-store";
import { AdminProductStudioModalUIProps } from "@/types/studio";
import {
    Check,
    DollarSign,
    Image as ImageIcon,
    Layers,
    Loader2,
    Palette,
    Plus,
    Tag,
    Upload,
    X
} from "lucide-react";
import Image from "next/image";

type FormPanelProps = AdminProductStudioModalUIProps;

export function AdminProductStudioFormPanel({
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
    fileInputRef,
    colors,
    isUploadingImage,
}: FormPanelProps) {
    return (
        <form
            onSubmit={handleSubmit}
            id="product-studio-form"
            className="lg:col-span-7 flex flex-col h-full"
        >
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">

                {/* 1. Product Identity */}
                <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-5 space-y-4">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/15 text-amber-300">
                            <Tag className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-xs font-bold uppercase tracking-[0.15em] text-amber-300">
                            1 · Product Identity
                        </span>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="prod-name" className="text-xs text-slate-300 font-semibold">
                            Product Title <span className="text-red-400">*</span>
                        </Label>
                        <Input
                            id="prod-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Acid Wash Skeleton Claw Tee"
                            className="h-11 bg-slate-950/80 border-white/10 text-white rounded-xl placeholder:text-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs text-slate-300 font-semibold">Category</Label>
                            <span className="text-[11px] text-slate-400">
                                Selected:{" "}
                                <strong className="text-amber-300">{effectiveCategory}</strong>
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {PRODUCT_CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => {
                                        setCategory(cat);
                                        if (cat === "Caps" || cat === "Bags" || cat === "Accessories") {
                                            setSizes(["One Size"]);
                                        } else if (sizes.includes("One Size") && sizes.length === 1) {
                                            setSizes(["S", "M", "L", "XL"]);
                                        }
                                    }}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                        category === cat
                                            ? "bg-amber-300 text-slate-950 shadow-md shadow-amber-300/20"
                                            : "bg-slate-950/70 border border-white/10 text-slate-300 hover:bg-slate-800 hover:text-white"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setCategory("Custom")}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                    category === "Custom"
                                        ? "bg-amber-300 text-slate-950"
                                        : "bg-slate-950/70 border border-dashed border-white/20 text-slate-300 hover:bg-slate-800"
                                }`}
                            >
                                + Custom
                            </button>
                        </div>
                        {category === "Custom" && (
                            <Input
                                value={customCategory}
                                onChange={(e) => setCustomCategory(e.target.value)}
                                placeholder="Enter custom category (e.g. Footwear, Beanies)…"
                                className="mt-2 bg-slate-950/80 border-white/10 text-white rounded-xl text-sm"
                            />
                        )}
                    </div>

                    {/* Badge & Fit */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs text-slate-300 font-semibold">Promo Badge</Label>
                            <select
                                value={badge}
                                onChange={(e) => setBadge(e.target.value)}
                                className="w-full h-10 rounded-xl border border-white/10 bg-slate-950/80 px-3 text-xs text-slate-100 outline-none focus:border-amber-300"
                            >
                                <option value="">No Badge</option>
                                {PRODUCT_BADGES.map((b) => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-slate-300 font-semibold">Fit Guide</Label>
                            <Input
                                value={fit}
                                onChange={(e) => setFit(e.target.value)}
                                placeholder="e.g. Boxy oversized fit"
                                className="h-10 bg-slate-950/80 border-white/10 text-white rounded-xl text-xs"
                            />
                        </div>
                    </div>
                </section>

                {/* 2. Pricing & Stock */}
                <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-5 space-y-4">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300">
                            <DollarSign className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-300">
                            2 · Pricing & Stock
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs text-slate-300 font-semibold">
                                Price (ZAR) <span className="text-red-400">*</span>
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R</span>
                                <Input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={price}
                                    onChange={(e) =>
                                        setPrice(e.target.value === "" ? "" : Number(e.target.value))
                                    }
                                    className="pl-7 h-10 bg-slate-950/80 border-white/10 text-white rounded-xl font-semibold"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-slate-300 font-semibold">Compare-at Price</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R</span>
                                <Input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={originalPrice}
                                    onChange={(e) =>
                                        setOriginalPrice(e.target.value === "" ? "" : Number(e.target.value))
                                    }
                                    placeholder="e.g. 550"
                                    className="pl-7 h-10 bg-slate-950/80 border-white/10 text-white rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-slate-300 font-semibold">Stock Qty</Label>
                            <Input
                                type="number"
                                min="0"
                                value={stock}
                                onChange={(e) =>
                                    setStock(e.target.value === "" ? "" : Number(e.target.value))
                                }
                                placeholder="50"
                                className="h-10 bg-slate-950/80 border-white/10 text-white rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6 pt-1">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={inStock}
                                    onChange={(e) => setInStock(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="h-5 w-9 rounded-full bg-slate-700 peer-checked:bg-amber-400 transition-colors" />
                                <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                            </div>
                            <span className="text-xs font-semibold text-slate-300">In Stock</span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={featured}
                                    onChange={(e) => setFeatured(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="h-5 w-9 rounded-full bg-slate-700 peer-checked:bg-amber-400 transition-colors" />
                                <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                            </div>
                            <span className="text-xs font-semibold text-slate-300">Feature on Homepage</span>
                        </label>
                    </div>
                </section>

                {/* 3. Sizes */}
                <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-400/15 text-sky-300">
                                <Layers className="h-3.5 w-3.5" />
                            </span>
                            <span className="text-xs font-bold uppercase tracking-[0.15em] text-sky-300">
                                3 · Available Sizes
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px]">
                            <button type="button" onClick={() => setSizes(["S", "M", "L", "XL"])} className="text-slate-400 hover:text-amber-300 underline transition-colors">S-XL</button>
                            <span className="text-slate-700">|</span>
                            <button type="button" onClick={() => setSizes(["XS", "S", "M", "L", "XL", "XXL", "3XL"])} className="text-slate-400 hover:text-amber-300 underline transition-colors">XS-3XL</button>
                            <span className="text-slate-700">|</span>
                            <button type="button" onClick={() => setSizes(["One Size"])} className="text-slate-400 hover:text-amber-300 underline transition-colors">One Size</button>
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
                                    className={`min-w-[44px] h-10 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                                        isSelected
                                            ? "bg-amber-300 text-slate-950 shadow-md shadow-amber-300/20 ring-2 ring-amber-300"
                                            : "bg-slate-950/70 border border-white/10 text-slate-400 hover:text-white hover:border-white/30"
                                    }`}
                                >
                                    {s}
                                    {isSelected && <Check size={11} className="stroke-[3]" />}
                                </button>
                            );
                        })}
                        <button
                            type="button"
                            onClick={() => handleToggleSize("One Size")}
                            className={`h-10 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                                sizes.includes("One Size")
                                    ? "bg-amber-300 text-slate-950 shadow-md shadow-amber-300/20 ring-2 ring-amber-300"
                                    : "bg-slate-950/70 border border-white/10 text-slate-400 hover:text-white hover:border-white/30"
                            }`}
                        >
                            One Size
                            {sizes.includes("One Size") && <Check size={11} className="stroke-[3]" />}
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Add custom size (e.g. 28, US 9)…"
                            value={customSizeInput}
                            onChange={(e) => setCustomSizeInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") { e.preventDefault(); handleAddCustomSize(); }
                            }}
                            className="h-9 bg-slate-950/80 border-white/10 text-white rounded-xl text-xs"
                        />
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleAddCustomSize}
                            className="h-9 shrink-0 border-white/10 text-slate-200 hover:bg-slate-800 rounded-xl"
                        >
                            <Plus size={13} /> Add
                        </Button>
                    </div>

                    {sizes.some(
                        (s) => !STANDARD_SIZES.includes(s as (typeof STANDARD_SIZES)[number]) && s !== "One Size"
                    ) && (
                        <div className="flex flex-wrap gap-1.5">
                            <span className="text-[11px] text-slate-400 self-center">Custom:</span>
                            {sizes
                                .filter((s) => !STANDARD_SIZES.includes(s as (typeof STANDARD_SIZES)[number]) && s !== "One Size")
                                .map((customS) => (
                                    <span
                                        key={customS}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold"
                                    >
                                        {customS}
                                        <button
                                            type="button"
                                            onClick={() => handleToggleSize(customS)}
                                            className="hover:text-red-400 transition-colors"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                        </div>
                    )}
                </section>

                {/* 4. Image */}
                <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-400/15 text-violet-300">
                                <ImageIcon className="h-3.5 w-3.5" />
                            </span>
                            <span className="text-xs font-bold uppercase tracking-[0.15em] text-violet-300">
                                4 · Product Image
                            </span>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-white/10">
                            {(["upload", "url"] as const).map((mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setImageInputMode(mode)}
                                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                                        imageInputMode === mode
                                            ? "bg-violet-500 text-white shadow"
                                            : "text-slate-400 hover:text-white"
                                    }`}
                                >
                                    {mode === "url" ? "URL" : "Upload"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {imageInputMode === "upload" && (
                        <div
                            onClick={() => {
                                if (!isUploadingImage) {
                                    fileInputRef.current?.click();
                                }
                            }}
                            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all group ${
                                isUploadingImage
                                    ? "border-violet-400 bg-violet-950/20 cursor-wait"
                                    : "cursor-pointer border-white/15 hover:border-violet-400/60 bg-slate-950/40 hover:bg-slate-900/60"
                            }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                disabled={isUploadingImage}
                            />
                            {isUploadingImage ? (
                                <>
                                    <div className="h-14 w-14 rounded-2xl bg-violet-400/20 text-violet-300 mx-auto flex items-center justify-center animate-pulse">
                                        <Loader2 className="h-7 w-7 animate-spin text-violet-400" />
                                    </div>
                                    <p className="mt-3 text-sm font-semibold text-violet-300">Uploading to Cloud Storage…</p>
                                    <p className="text-xs text-slate-400 mt-1">Generating permanent CDN asset URL</p>
                                </>
                            ) : (
                                <>
                                    <div className="h-14 w-14 rounded-2xl bg-violet-400/10 text-violet-300 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Upload className="h-7 w-7" />
                                    </div>
                                    <p className="mt-3 text-sm font-semibold text-white">Click or Drag & Drop</p>
                                    <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 5MB (Saved to Cloud)</p>
                                </>
                            )}
                        </div>
                    )}

                    {imageInputMode === "url" && (
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-300 font-semibold">Public Path or Web URL</Label>
                            <Input
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                placeholder="e.g. https://…"
                                className="bg-slate-950/80 border-white/10 text-white rounded-xl text-xs"
                            />
                        </div>
                    )}

                    {image && (
                        <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-950/70 border border-white/10">
                            <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-slate-900 border border-white/10 flex-shrink-0">
                                <Image src={image} alt="Selected Preview" fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-white truncate">Active Visual</p>
                                <p className="text-[11px] text-slate-400 truncate">
                                    {image.startsWith("data:") ? "Uploaded Image Data" : image}
                                </p>
                            </div>
                        </div>
                    )}
                </section>

                {/* 5. Colors & Story */}
                <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-5 space-y-4">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-400/15 text-pink-300">
                            <Palette className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-xs font-bold uppercase tracking-[0.15em] text-pink-300">
                            5 · Colorways & Garment Details
                        </span>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-slate-300 font-semibold">Available Colorways</Label>
                        <div className="flex flex-wrap gap-2">
                            {PRESET_COLORS.map((col) => {
                                const isSelected = colors.includes(col.name);
                                return (
                                    <button
                                        key={col.name}
                                        type="button"
                                        onClick={() => handleToggleColor(col.name)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                                            isSelected
                                                ? "bg-slate-800 border-2 border-pink-400 text-white shadow"
                                                : "bg-slate-950/70 border border-white/10 text-slate-400 hover:text-white"
                                        }`}
                                    >
                                        <span
                                            className="h-3 w-3 rounded-full border border-white/20"
                                            style={{ backgroundColor: col.hex }}
                                        />
                                        {col.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-slate-300 font-semibold">Product Story & Fabric Notes</Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the fabric weight, streetwear cut, wash technique, and design highlights…"
                            rows={3}
                            className="bg-slate-950/80 border-white/10 text-white rounded-xl text-xs resize-none placeholder:text-slate-500"
                        />
                    </div>
                </section>
            </div>

        </form>
    );
}
