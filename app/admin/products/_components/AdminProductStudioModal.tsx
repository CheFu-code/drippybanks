'use client';

import React, { useRef, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
    PRODUCT_CATEGORIES
} from '@/lib/product-store';
import { AdminProductStudioModalProps, InnerStudioFormProps } from '@/types/studio';
import { uploadProductImageApi } from '@/lib/api/products';
import { toast } from 'sonner';
import AdminProductStudioModalUI from '../UI/AdminProductStudioModalUI';

function InnerStudioForm({ initialProduct, onClose, onSaveProduct }: InnerStudioFormProps) {
    const isEdit = Boolean(initialProduct?.id);

    // Initial state derived cleanly on component mount
    const isStandardCategory = initialProduct?.category && PRODUCT_CATEGORIES.includes(initialProduct.category as (typeof PRODUCT_CATEGORIES)[number]);
    const [name, setName] = useState(initialProduct?.name || '');
    const [category, setCategory] = useState<string>(
        initialProduct?.category ? (isStandardCategory ? initialProduct.category : 'Custom') : 'Tops'
    );
    const [customCategory, setCustomCategory] = useState<string>(
        initialProduct?.category && !isStandardCategory ? initialProduct.category : ''
    );
    const [price, setPrice] = useState<number | ''>(initialProduct?.price ?? 400);
    const [originalPrice, setOriginalPrice] = useState<number | ''>(initialProduct?.originalPrice ?? '');
    const [sizes, setSizes] = useState<string[]>(
        initialProduct?.sizes && initialProduct.sizes.length > 0 ? initialProduct.sizes : ['S', 'M', 'L', 'XL']
    );
    const [customSizeInput, setCustomSizeInput] = useState('');
    const [colors, setColors] = useState<string[]>(
        initialProduct?.colors && initialProduct.colors.length > 0 ? initialProduct.colors : ['Midnight Black']
    );
    const [badge, setBadge] = useState<string>(initialProduct?.badge ?? (isEdit ? '' : 'New Drop'));
    const [image, setImage] = useState<string>(initialProduct?.image || '');
    const [description, setDescription] = useState<string>(
        initialProduct?.description || ''
    );
    const [fit, setFit] = useState<string>(initialProduct?.fit || '');
    const [stock, setStock] = useState<number | ''>(initialProduct?.stock ?? 50);
    const [inStock, setInStock] = useState<boolean>(initialProduct?.inStock !== false);
    const [featured, setFeatured] = useState<boolean>(Boolean(initialProduct?.featured));

    // Gallery picker & upload modal state
    const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
    const [previewSize, setPreviewSize] = useState<string>('M');
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle cloud file upload to CHEFU Backend -> Firebase Storage
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file (PNG, JPG, WEBP).');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size exceeds 5MB. Please upload a smaller image.');
            return;
        }

        try {
            setIsUploadingImage(true);
            toast.loading('Uploading image to cloud storage…', { id: 'image-upload-toast' });
            const result = await uploadProductImageApi(file);
            setImage(result.url);
            toast.success('Image uploaded to cloud storage!', { id: 'image-upload-toast' });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to upload image to cloud storage.';
            console.error('[AdminProductStudioModal] Cloud image upload error:', err);
            toast.error(message, { id: 'image-upload-toast' });
        } finally {
            setIsUploadingImage(false);
            if (e.target) {
                e.target.value = '';
            }
        }
    };

    // Toggle size chip
    const handleToggleSize = (sizeOption: string) => {
        if (sizes.includes(sizeOption)) {
            if (sizes.length === 1) {
                toast.error('Product must have at least one size.');
                return;
            }
            setSizes(sizes.filter((s) => s !== sizeOption));
        } else {
            setSizes([...sizes, sizeOption]);
        }
    };

    // Add custom size
    const handleAddCustomSize = () => {
        const val = customSizeInput.trim().toUpperCase();
        if (!val) return;
        if (!sizes.includes(val)) {
            setSizes([...sizes, val]);
        }
        setCustomSizeInput('');
    };

    // Toggle color
    const handleToggleColor = (colorName: string) => {
        if (colors.includes(colorName)) {
            if (colors.length === 1) return;
            setColors(colors.filter((c) => c !== colorName));
        } else {
            setColors([...colors, colorName]);
        }
    };

    // Save product handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isUploadingImage) {
            toast.warning('Please wait for the image upload to complete.');
            return;
        }

        const trimmedName = name.trim();
        if (!trimmedName) {
            toast.error('Please enter a product name.');
            return;
        }

        const finalCategory = category === 'Custom' ? customCategory.trim() : category;
        if (!finalCategory) {
            toast.error('Please select or specify a category.');
            return;
        }

        const numPrice = typeof price === 'number' ? price : Number(price);
        if (isNaN(numPrice) || numPrice < 0) {
            toast.error('Please enter a valid price.');
            return;
        }

        if (!image.trim()) {
            toast.error('Please provide an image for the product.');
            return;
        }

        const finalProductData = {
            id: initialProduct?.id,
            name: trimmedName,
            category: finalCategory,
            price: numPrice,
            originalPrice: typeof originalPrice === 'number' && originalPrice > 0 ? originalPrice : undefined,
            sizes: sizes.length > 0 ? sizes : ['One Size'],
            colors: colors.length > 0 ? colors : ['Standard'],
            badge: badge.trim() || undefined,
            image: image.trim(),
            description: description.trim(),
            fit: fit.trim(),
            stock: typeof stock === 'number' ? stock : 50,
            inStock,
            featured,
        };

        try {
            setIsSubmitting(true);
            await onSaveProduct(finalProductData);
            toast.success(isEdit ? `Product "${trimmedName}" updated!` : `New piece "${trimmedName}" published to shop!`);
            onClose();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to save product.';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const effectiveCategory = category === 'Custom' ? customCategory || 'Custom Category' : category;
    const effectivePrice = typeof price === 'number' ? price : 0;
    const effectiveOrigPrice = typeof originalPrice === 'number' && originalPrice > effectivePrice ? originalPrice : null;
    const discountPercent = effectiveOrigPrice ? Math.round(((effectiveOrigPrice - effectivePrice) / effectiveOrigPrice) * 100) : 0;

    return (
        <AdminProductStudioModalUI
            key={initialProduct?.id ?? 'create-new-product'}
            onClose={onClose}
            isEdit={isEdit}
            handleSubmit={handleSubmit}
            handleToggleColor={handleToggleColor}
            handleAddCustomSize={handleAddCustomSize}
            handleToggleSize={handleToggleSize}
            handleFileUpload={handleFileUpload}
            name={name}
            setName={setName}
            effectiveCategory={effectiveCategory}
            category={category}
            setCategory={setCategory}
            sizes={sizes}
            setSizes={setSizes}
            customCategory={customCategory}
            setCustomCategory={setCustomCategory}
            badge={badge}
            setBadge={setBadge}
            fit={fit}
            setFit={setFit}
            customSizeInput={customSizeInput}
            setCustomSizeInput={setCustomSizeInput}
            price={price}
            setPrice={setPrice}
            originalPrice={originalPrice}
            setOriginalPrice={setOriginalPrice}
            stock={stock}
            setStock={setStock}
            inStock={inStock}
            setInStock={setInStock}
            featured={featured}
            setFeatured={setFeatured}
            imageInputMode={imageInputMode}
            setImageInputMode={setImageInputMode}
            description={description}
            setDescription={setDescription}
            image={image}
            setImage={setImage}
            previewSize={previewSize}
            setPreviewSize={setPreviewSize}
            fileInputRef={fileInputRef}
            discountPercent={discountPercent}
            effectivePrice={effectivePrice}
            effectiveOrigPrice={effectiveOrigPrice}
            colors={colors}
            isUploadingImage={isUploadingImage}
            isSubmitting={isSubmitting}
        />
    );
}

export function AdminProductStudioModal({
    isOpen,
    onClose,
    initialProduct,
    onSaveProduct,
}: AdminProductStudioModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent showCloseButton={false} className="!max-w-7xl !w-[98vw] bg-slate-950/98 border border-white/15 text-white p-0 overflow-hidden !max-h-[96vh] h-[96vh] flex flex-col shadow-2xl shadow-black/60 rounded-3xl gap-0">
                {isOpen && (
                    <InnerStudioForm
                        key={initialProduct?.id ?? 'create-new-product'}
                        initialProduct={initialProduct}
                        onClose={onClose}
                        onSaveProduct={onSaveProduct}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
