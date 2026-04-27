import { create } from 'zustand';
import { adminProductAPI, type ProductFormData } from '@/lib/mock/adminApi';

interface ProductState {
  images: string[];
  isSubmitting: boolean;
  isUploading: boolean;
  previewMode: boolean;
  error: string | null;
  categories: string[];
  lastSavedProduct: string | null;

  // Actions
  addImages: (files: FileList) => Promise<void>;
  removeImage: (index: number) => void;
  createProduct: (data: ProductFormData) => Promise<string>;
  updateProduct: (id: string, data: ProductFormData) => Promise<void>;
  setPreviewMode: (mode: boolean) => void;
  clearError: () => void;
  loadCategories: () => Promise<void>;
  resetForm: () => void;
  validateBeforeSubmit: (data: ProductFormData) => Promise<boolean>;
}

export const useAdminProductStore = create<ProductState>((set, get) => ({
  images: [],
  isSubmitting: false,
  isUploading: false,
  previewMode: false,
  error: null,
  categories: [],
  lastSavedProduct: null,

  addImages: async (files: FileList) => {
    set({ isUploading: true, error: null });

    try {
      const fileArray = Array.from(files);

      // Validate file types and sizes
      const invalidFiles = fileArray.filter(
        file => !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024
      );

      if (invalidFiles.length > 0) {
        throw new Error('Please upload only images under 5MB');
      }

      // Create preview URLs
      const newImages = fileArray.map(file => URL.createObjectURL(file));

      set(state => ({
        images: [...state.images, ...newImages],
        isUploading: false,
      }));

      // In production, upload to server here
      // await adminProductAPI.uploadImages(fileArray);

    } catch (error: any) {
      set({
        error: error.message,
        isUploading: false,
      });
    }
  },

  removeImage: (index: number) => {
    set(state => ({
      images: state.images.filter((_, i) => i !== index),
    }));
  },

  createProduct: async (data: ProductFormData) => {
    set({ isSubmitting: true, error: null });

    try {
      // Validate
      const validation = await adminProductAPI.validateProductData(data);
      if (!validation.success) {
        throw new Error(Object.values(validation.errors || {}).join(', '));
      }

      // If no images, add validation error
      if (get().images.length === 0) {
        throw new Error('Please upload at least one product image');
      }

      const response = await adminProductAPI.createProduct(data, get().images);

      if (response.success && response.product) {
        set({
          isSubmitting: false,
          lastSavedProduct: response.product.id,
        });
        return response.product.id;
      }

      throw new Error('Failed to create product');

    } catch (error: any) {
      set({
        error: error.message || 'Failed to create product',
        isSubmitting: false,
      });
      throw error;
    }
  },

  updateProduct: async (id: string, data: ProductFormData) => {
    set({ isSubmitting: true, error: null });

    try {
      const response = await adminProductAPI.updateProduct(id, data, get().images);

      if (response.success) {
        set({
          isSubmitting: false,
          lastSavedProduct: id,
        });
        return;
      }

      throw new Error('Failed to update product');

    } catch (error: any) {
      set({
        error: error.message || 'Failed to update product',
        isSubmitting: false,
      });
      throw error;
    }
  },

  setPreviewMode: (mode: boolean) => set({ previewMode: mode }),

  clearError: () => set({ error: null }),

  loadCategories: async () => {
    try {
      const response = await adminProductAPI.getCategories();
      set({ categories: response.categories });
    } catch (error: any) {
      console.error('Failed to load categories:', error);
    }
  },

  resetForm: () => {
    // Clean up object URLs
    get().images.forEach(url => URL.revokeObjectURL(url));
    set({
      images: [],
      previewMode: false,
      error: null,
      lastSavedProduct: null,
    });
  },

  validateBeforeSubmit: async (data: ProductFormData): Promise<boolean> => {
    const validation = await adminProductAPI.validateProductData(data);

    if (!validation.success) {
      set({ error: Object.values(validation.errors || {}).join(', ') });
      return false;
    }

    if (get().images.length === 0) {
      set({ error: 'Please upload at least one product image' });
      return false;
    }

    return true;
  },
}));
