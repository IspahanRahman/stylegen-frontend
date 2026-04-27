import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminProductStore } from '@/lib/store/adminProductStore';
import type { ProductFormData } from '@/lib/mock/adminApi';
import toast from 'react-hot-toast';

export function useAdminProduct(productId?: string) {
  const router = useRouter();
  const store = useAdminProductStore();

  useEffect(() => {
    store.loadCategories();
  }, []);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      await store.addImages(files);
    } catch (error: any) {
      toast.error(error.message);
    }

    // Reset input
    e.target.value = '';
  }, [store]);

  const handleSubmit = useCallback(async (data: ProductFormData) => {
    const isValid = await store.validateBeforeSubmit(data);
    if (!isValid) {
      toast.error(store.error || 'Validation failed');
      return;
    }

    try {
      if (productId) {
        await store.updateProduct(productId, data);
        toast.success('Product updated successfully!');
        router.push(`/dashboard/admin/products/${productId}`);
      } else {
        const newProductId = await store.createProduct(data);
        toast.success('Product created successfully!');
        router.push(`/dashboard/admin/products/${newProductId}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    }
  }, [store, productId, router]);

  const handleRemoveImage = useCallback((index: number) => {
    store.removeImage(index);
  }, [store]);

  const handleTogglePreview = useCallback(() => {
    store.setPreviewMode(!store.previewMode);
  }, [store]);

  return {
    // State
    images: store.images,
    isSubmitting: store.isSubmitting,
    isUploading: store.isUploading,
    previewMode: store.previewMode,
    error: store.error,
    categories: store.categories,

    // Actions
    handleImageUpload,
    handleSubmit,
    handleRemoveImage,
    handleTogglePreview,
    clearError: store.clearError,
    resetForm: store.resetForm,
  };
}
