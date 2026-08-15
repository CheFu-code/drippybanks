import { Button } from "@/components/ui/button";
import { AdminProductStudioModalUIProps } from "@/types/studio";
import {
    Eye,
    Image as ImageIcon,
    Plus,
    Zap
} from "lucide-react";
import Image from "next/image";
import { AdminProductStudioFormPanel } from "./AdminProductStudioFormPanel";

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
    colors,
}: AdminProductStudioModalUIProps) => {
    const allProps = {
        onClose, isEdit, handleSubmit, handleToggleColor, handleToggleSize,
        handleAddCustomSize, handleFileUpload, name, setName, effectiveCategory,
        category, setCategory, sizes, setSizes, customCategory, setCustomCategory,
        badge, setBadge, fit, setFit, customSizeInput, setCustomSizeInput,
        price, setPrice, originalPrice, setOriginalPrice, stock, setStock,
        inStock, setInStock, featured, setFeatured, imageInputMode,
        setImageInputMode, description, setDescription, image, setImage,
        isGalleryOpen, setIsGalleryOpen, previewSize, setPreviewSize,
        fileInputRef, discountPercent, effectivePrice, effectiveOrigPrice, colors,
    };

    return (
        <>
            {/* ── Header ───────────────────────────────────────────── */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/70 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-3">
                    
                    <div>
                        <h2 className="text-base font-bold tracking-tight text-white">
                            {isEdit ? "Edit Streetwear Product" : "Add New Drop to Storefront"}
                        </h2>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            Configure sizes, visuals, pricing — with a live storefront preview.
                        </p>
                    </div>
                </div>
               
            </div>

            {/* ── Two-column body ───────────────────────────────────── */}
            <div className="flex-1 min-h-0 overflow-hidden grid grid-cols-1 lg:grid-cols-12">

                {/* LEFT — Form */}
                <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-white/10 overflow-y-auto custom-scrollbar">
                    <AdminProductStudioFormPanel {...allProps} />
                </div>

                {/* RIGHT — Live Preview */}
                <div className="lg:col-span-5 flex flex-col bg-gradient-to-b from-slate-900/60 to-slate-950 overflow-y-auto custom-scrollbar">
                    
                    <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
                        {/* Product card mock */}
                        <div className="mx-auto w-full max-w-[300px] rounded-[1.75rem] border border-white/15 bg-slate-900/95 overflow-hidden shadow-2xl shadow-slate-950/60 group">
                            {/* Image area */}
                            <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-950">
                                {image ? (
                                    <Image
                                        src={image}
                                        alt={name || "Preview"}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="h-full w-full flex flex-col items-center justify-center gap-3 text-slate-700">
                                        <ImageIcon className="h-14 w-14 stroke-1" />
                                        <p className="text-xs text-slate-600">No image selected</p>
                                    </div>
                                )}
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />

                                {/* Category pill */}
                                <span className="absolute left-3 top-3 rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-amber-300 border border-white/10">
                                    {effectiveCategory}
                                </span>

                                {/* Promo badge */}
                                {badge && (
                                    <span className="absolute right-3 top-3 rounded-full bg-amber-400 text-slate-950 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-lg">
                                        {badge}
                                    </span>
                                )}

                                {/* Add button */}
                                <div className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-amber-300 text-slate-950 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                                    <Plus size={18} />
                                </div>

                                {/* Stock pill */}
                                <div className="absolute bottom-3 left-3">
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

                            {/* Card body */}
                            <div className="p-5 space-y-3">
                                <div>
                                    <h3 className="text-base font-bold text-white leading-tight">
                                        {name || "Untitled..."}
                                    </h3>
                                    {fit && <p className="text-xs text-slate-400 mt-0.5">{fit}</p>}
                                </div>

                                {/* Size picker */}
                                {sizes.length > 0 && (
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Select Size</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {sizes.map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => setPreviewSize(s)}
                                                    className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border transition-all ${
                                                        previewSize === s
                                                            ? "bg-amber-300 text-slate-950 border-amber-300"
                                                            : "bg-slate-950 text-slate-300 border-white/10 hover:border-white/30"
                                                    }`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Price */}
                                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-extrabold text-amber-300">
                                            R{effectivePrice.toFixed(2)}
                                        </span>
                                        {effectiveOrigPrice && (
                                            <span className="text-xs text-slate-500 line-through">
                                                R{effectiveOrigPrice.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    {discountPercent > 0 && (
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30">
                                            Save {discountPercent}%
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Footer ───────────────────────────────────────────── */}
            <div className="px-6 py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md shrink-0">
                <div className="text-xs text-slate-400">
                    {isEdit
                        ? "Editing active catalog entry — changes go live immediately."
                        : "New product will be published directly to the catalog."}
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="border-white/10 text-slate-300 hover:bg-slate-800 rounded-xl flex-1 sm:flex-none"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="product-studio-form"
                        className="bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-bold px-8 rounded-xl shadow-lg shadow-amber-400/25 flex-1 sm:flex-none"
                    >
                        {isEdit ? "Save Changes" : "Publish to Shop"}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default AdminProductStudioModalUI;

