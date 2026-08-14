'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, X, Check, Sparkles } from 'lucide-react';
import { PRESET_GALLERY_IMAGES } from '@/lib/product-store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AdminImageGalleryPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectImage: (path: string) => void;
    currentImage?: string;
}

export function AdminImageGalleryPicker({
    isOpen,
    onClose,
    onSelectImage,
    currentImage,
}: AdminImageGalleryPickerProps) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = ['All', 'Tops', 'Hoodies', 'Caps', 'Bags', 'Sets'];

    const filteredImages = PRESET_GALLERY_IMAGES.filter((img) => {
        const matchesCat = selectedCategory === 'All' || img.category === selectedCategory;
        const matchesSearch =
            search.trim().length === 0 ||
            img.name.toLowerCase().includes(search.toLowerCase()) ||
            img.path.toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
    });

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl bg-slate-950/95 border-white/10 text-white p-6 max-h-[85vh] flex flex-col">
                <DialogHeader className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-amber-300">
                            <Sparkles className="h-3 w-3" /> Drippy Library
                        </span>
                    </div>
                    <DialogTitle className="text-xl font-bold tracking-tight text-white">
                        Select from Brand Image Gallery
                    </DialogTitle>
                    <DialogDescription className="text-sm text-slate-400">
                        Choose an authentic Drippy Banks asset from our curated photography collection.
                    </DialogDescription>
                </DialogHeader>

                {/* Filter and Search Bar */}
                <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative w-full sm:flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search images by name or file..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 bg-slate-900 border-white/10 text-white placeholder:text-slate-500 rounded-xl"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    selectedCategory === cat
                                        ? 'bg-amber-300 text-slate-950 font-semibold shadow-md shadow-amber-300/20'
                                        : 'bg-slate-900 text-slate-300 border border-white/10 hover:bg-slate-800'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Images Grid */}
                <div className="mt-4 flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 min-h-[300px]">
                    {filteredImages.map((img) => {
                        const isSelected = currentImage === img.path;
                        return (
                            <button
                                key={img.path}
                                type="button"
                                onClick={() => {
                                    onSelectImage(img.path);
                                    onClose();
                                }}
                                className={`group relative rounded-xl overflow-hidden border transition-all text-left flex flex-col bg-slate-900/60 hover:scale-[1.02] ${
                                    isSelected
                                        ? 'border-amber-400 ring-2 ring-amber-400/50'
                                        : 'border-white/10 hover:border-amber-300/50'
                                }`}
                            >
                                <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
                                    <Image
                                        src={img.path}
                                        alt={img.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 bg-amber-400 text-slate-950 p-1 rounded-full shadow-lg">
                                            <Check size={14} className="stroke-[3]" />
                                        </div>
                                    )}
                                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-medium text-amber-300 border border-white/10">
                                        {img.category}
                                    </span>
                                </div>
                                <div className="p-2.5">
                                    <p className="text-xs font-medium text-white truncate">{img.name}</p>
                                    <p className="text-[10px] text-slate-400 truncate">{img.path}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                    <p className="text-xs text-slate-400">
                        Showing {filteredImages.length} brand images
                    </p>
                    <Button variant="outline" size="sm" onClick={onClose} className="border-white/10 text-white">
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
