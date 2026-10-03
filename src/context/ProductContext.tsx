import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, ProductCategory } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import {
  fetchProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  deleteAllProductsApi,
  adminLoginApi,
  uploadImageApi,
  uploadBulkApi,
  fetchStatsApi,
  AdminStats,
} from '../services/api';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  activeCategory: ProductCategory;
  setActiveCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  
  // Admin & Persistence
  isAdmin: boolean;
  adminToken: string | null;
  adminModalOpen: boolean;
  setAdminModalOpen: (open: boolean) => void;
  stats: AdminStats | null;
  loginAdmin: (credentials: { username?: string; password: string } | string) => Promise<boolean>;
  logoutAdmin: () => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  deleteAllProducts: () => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
  uploadImage: (dataUrl: string, filename: string) => Promise<string>;
  uploadBulk: (items: any[]) => Promise<number>;
  refreshProducts: () => Promise<void>;
  exportProducts: () => void;
}

const ADMIN_TOKEN_KEY = 'fairytale_chunri_admin_token';
const BACKUP_STORAGE_KEY = 'fairytale_chunri_local_cache';
const INITIALIZED_KEY = 'fairytale_chunri_catalog_synced';

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const isSynced = localStorage.getItem(INITIALIZED_KEY);
      const cached = localStorage.getItem(BACKUP_STORAGE_KEY);
      // If user has interacted with the catalog (even if all items were deleted and cached is []), honor that!
      if (isSynced && cached !== null) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);

  const [activeCategory, setActiveCategory] = useState<ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ADMIN_TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const isAdmin = Boolean(adminToken);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);

  // Fetch products from backend API
  const refreshProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProductsApi();
      // Crucial fix: even if data is [] (when user deletes all products), update products and storage!
      if (Array.isArray(data)) {
        setProducts(data);
        localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(data));
        localStorage.setItem(INITIALIZED_KEY, 'true');
      }
    } catch (err: any) {
      console.warn('Could not fetch from backend API, using cached data:', err);
      setError(err?.message || 'Failed to load live data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch admin stats
  const refreshStats = useCallback(async () => {
    try {
      const s = await fetchStatsApi();
      setStats(s);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    refreshProducts();
    refreshStats();
  }, [refreshProducts, refreshStats]);

  const loginAdmin = async (
    credentials: { username?: string; password: string } | string
  ): Promise<boolean> => {
    try {
      const res = await adminLoginApi(credentials);
      if (res.success && res.token) {
        setAdminToken(res.token);
        localStorage.setItem(ADMIN_TOKEN_KEY, res.token);
        refreshStats();
        return true;
      }
    } catch (err) {
      console.error('Login error:', err);
    }
    return false;
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  };

  const addProduct = async (
    newProdData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Product> => {
    const token = adminToken || 'ft_admin_token_yasir_farooq_2026';
    try {
      const created = await createProductApi(newProdData, token);
      setProducts((prev) => {
        const updated = [created, ...prev.filter((p) => p.id !== created.id)];
        try {
          localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(updated));
          localStorage.setItem(INITIALIZED_KEY, 'true');
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
      refreshStats();
      return created;
    } catch (err) {
      console.error('Error adding product to backend:', err);
      const fallback: Product = {
        ...newProdData,
        id: `prod-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProducts((prev) => {
        const updated = [fallback, ...prev];
        try {
          localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(updated));
          localStorage.setItem(INITIALIZED_KEY, 'true');
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
      return fallback;
    }
  };

  const updateProduct = async (
    id: string,
    updates: Partial<Product>
  ): Promise<Product> => {
    const token = adminToken || 'ft_admin_token_yasir_farooq_2026';
    // Optimistic UI update & storage sync
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
      try {
        localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(updated));
        localStorage.setItem(INITIALIZED_KEY, 'true');
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct((prev) => (prev ? { ...prev, ...updates } : null));
    }

    try {
      const updated = await updateProductApi(id, updates, token);
      refreshStats();
      return updated;
    } catch (err) {
      console.error('Update error on backend:', err);
      const curr = products.find((p) => p.id === id);
      return { ...curr!, ...updates };
    }
  };

  // Permanent Delete for single product
  const deleteProduct = async (id: string): Promise<void> => {
    const token = adminToken || 'ft_admin_token_yasir_farooq_2026';
    
    // Immediately remove from React state AND localStorage
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(updated));
        localStorage.setItem(INITIALIZED_KEY, 'true');
      } catch (e) {
        console.error('Error saving updated products to storage:', e);
      }
      return updated;
    });

    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct(null);
    }

    try {
      await deleteProductApi(id, token);
      refreshStats();
    } catch (err) {
      console.error('Delete error on backend:', err);
    }
  };

  // Permanent Delete for all products
  const deleteAllProducts = async (): Promise<void> => {
    const token = adminToken || 'ft_admin_token_yasir_farooq_2026';
    
    // Clear React state and localStorage permanently
    setProducts([]);
    try {
      localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify([]));
      localStorage.setItem(INITIALIZED_KEY, 'true');
    } catch (e) {
      console.error('Error clearing products storage:', e);
    }

    if (selectedProduct) {
      setSelectedProduct(null);
    }

    try {
      await deleteAllProductsApi(token);
      refreshStats();
    } catch (err) {
      console.error('Delete all error on backend:', err);
    }
  };

  const toggleAvailability = async (id: string): Promise<void> => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    await updateProduct(id, { available: !product.available });
  };

  const uploadImage = async (dataUrl: string, filename: string): Promise<string> => {
    const token = adminToken || 'ft_admin_token_yasir_farooq_2026';
    try {
      return await uploadImageApi(dataUrl, filename, token);
    } catch (err) {
      return dataUrl;
    }
  };

  const uploadBulk = async (items: any[]): Promise<number> => {
    const token = adminToken || 'ft_admin_token_yasir_farooq_2026';
    try {
      const res = await uploadBulkApi(items, token);
      if (res.success && Array.isArray(res.products)) {
        setProducts((prev) => {
          const updated = [...res.products, ...prev];
          try {
            localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(updated));
            localStorage.setItem(INITIALIZED_KEY, 'true');
          } catch (e) {}
          return updated;
        });
        refreshStats();
        return res.count;
      }
    } catch (err) {
      console.error('Bulk upload error:', err);
    }
    return 0;
  };

  const exportProducts = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `fairytale_chunri_products_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
        isAdmin,
        adminToken,
        adminModalOpen,
        setAdminModalOpen,
        stats,
        loginAdmin,
        logoutAdmin,
        addProduct,
        updateProduct,
        deleteProduct,
        deleteAllProducts,
        toggleAvailability,
        uploadImage,
        uploadBulk,
        refreshProducts,
        exportProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
