import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Upload,
  Download,
  Lock,
  LogOut,
  Shield,
  Search,
  Package,
  Layers,
  Sparkles,
  AlertCircle,
  Check,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { Product, ProductCategory } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

interface BulkUploadItem {
  id: string;
  name: string;
  category: Exclude<ProductCategory, 'All'>;
  price: number;
  image: string;
  filename: string;
}

export const AdminModal: React.FC = () => {
  const {
    adminModalOpen,
    setAdminModalOpen,
    isAdmin,
    loginAdmin,
    logoutAdmin,
    products,
    stats,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteAllProducts,
    toggleAvailability,
    uploadImage,
    uploadBulk,
    exportProducts,
  } = useProducts();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [activeTab, setActiveTab] = useState<'list' | 'form' | 'bulk'>('list');
  const [adminSearch, setAdminSearch] = useState('');

  // Editing form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Suits' as Exclude<ProductCategory, 'All'>,
    price: 6500,
    description: '',
    image: '',
    fabric: 'Pure Cotton Tie-Dye',
    colors: 'Crimson Red, Gold',
    sizes: 'Unstitched 3-Piece',
    available: true,
    featured: false,
    newArrival: true,
  });

  // Bulk Upload State
  const [bulkItems, setBulkItems] = useState<BulkUploadItem[]>([]);
  const [isUploadingBulk, setIsUploadingBulk] = useState(false);

  if (!adminModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setLoginError('Admin username is required');
      return;
    }
    if (!password.trim()) {
      setLoginError('Password is required');
      return;
    }
    setIsSubmitting(true);
    setLoginError(null);
    const success = await loginAdmin({ username: username.trim(), password: password.trim() });
    setIsSubmitting(false);
    if (!success) {
      setLoginError('Invalid username or password. Please try again.');
    } else {
      setPassword('');
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          const base64 = reader.result;
          setFormData((prev) => ({ ...prev, image: base64 }));
          try {
            const serverUrl = await uploadImage(base64, file.name);
            setFormData((prev) => ({ ...prev, image: serverUrl }));
            setStatusMessage({ type: 'success', text: 'Image uploaded successfully to server!' });
          } catch {
            // keep dataUrl
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Replace photo directly from product row
  const handleQuickReplacePhoto = async (productId: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result === 'string') {
        const base64 = reader.result;
        try {
          const serverUrl = await uploadImage(base64, file.name);
          await updateProduct(productId, { image: serverUrl, images: [serverUrl] });
          setStatusMessage({ type: 'success', text: 'Photo updated with your exact camera picture!' });
        } catch {
          setStatusMessage({ type: 'error', text: 'Failed to update photo.' });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle multi-file bulk selection
  const handleBulkFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: BulkUploadItem[] = [];
    let processed = 0;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          // Guess name from filename or default
          const cleanName = file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/WhatsApp Image 2026-09-29 at /gi, 'Chunri Piece ')
            .replace(/_/g, ' ');

          newItems.push({
            id: `temp-${Date.now()}-${index}`,
            name: cleanName || `Chunri Dress #${bulkItems.length + index + 1}`,
            category: 'Suits',
            price: 6500,
            image: reader.result,
            filename: file.name,
          });
        }

        processed++;
        if (processed === files.length) {
          setBulkItems((prev) => [...prev, ...newItems]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveBulkUploads = async () => {
    if (bulkItems.length === 0) return;
    setIsUploadingBulk(true);
    setStatusMessage(null);

    try {
      const itemsToUpload = bulkItems.map((item) => ({
        filename: item.filename,
        image: item.image,
        name: item.name,
        category: item.category,
        price: item.price,
      }));

      const count = await uploadBulk(itemsToUpload);
      setStatusMessage({
        type: 'success',
        text: `Successfully added ${count} exact clothing items to your live catalog!`,
      });
      setBulkItems([]);
      setActiveTab('list');
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Failed to upload bulk photos.' });
    } finally {
      setIsUploadingBulk(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setStatusMessage(null);
    setFormData({
      name: '',
      category: 'Suits',
      price: 6500,
      description: '',
      image: '',
      fabric: 'Pure Traditional Cotton',
      colors: 'Crimson Red, Gold',
      sizes: 'Unstitched 3-Piece',
      available: true,
      featured: false,
      newArrival: true,
    });
    setActiveTab('form');
  };

  const handleOpenEdit = (product: Product) => {
    setEditingId(product.id);
    setStatusMessage(null);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      image: product.image,
      fabric: product.fabric || '',
      colors: product.colors.join(', '),
      sizes: product.sizes.join(', '),
      available: product.available,
      featured: product.featured,
      newArrival: product.newArrival,
    });
    setActiveTab('form');
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!formData.name.trim()) {
      setStatusMessage({ type: 'error', text: 'Product name is required.' });
      return;
    }
    if (!formData.image.trim()) {
      setStatusMessage({ type: 'error', text: 'Product image (Upload or URL) is required.' });
      return;
    }
    if (Number(formData.price) <= 0) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid price in PKR.' });
      return;
    }

    setIsSubmitting(true);
    const colorsArr = formData.colors
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    const sizesArr = formData.sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (editingId) {
        await updateProduct(editingId, {
          name: formData.name,
          category: formData.category,
          price: Number(formData.price),
          description: formData.description,
          image: formData.image,
          fabric: formData.fabric,
          colors: colorsArr,
          sizes: sizesArr,
          available: formData.available,
          featured: formData.featured,
          newArrival: formData.newArrival,
        });
        setStatusMessage({ type: 'success', text: `"${formData.name}" updated successfully in database!` });
      } else {
        await addProduct({
          name: formData.name,
          category: formData.category,
          price: Number(formData.price),
          description: formData.description,
          image: formData.image,
          fabric: formData.fabric,
          colors: colorsArr,
          sizes: sizesArr,
          available: formData.available,
          featured: formData.featured,
          newArrival: formData.newArrival,
        });
        setStatusMessage({ type: 'success', text: `"${formData.name}" added to database catalog!` });
      }
      setActiveTab('list');
      setEditingId(null);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Failed to save product.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAdminProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(adminSearch.toLowerCase())
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/65 backdrop-blur-xs animate-in fade-in"
    >
      <div
        className={`relative rounded-xl max-w-5xl w-full h-[90vh] sm:h-[86vh] overflow-hidden shadow-2xl border flex flex-col my-auto transition-colors duration-300 ${
          isDark
            ? 'bg-[#261D1F] border-[#3D2E32] text-[#F7EFE8]'
            : 'bg-white border-[#EAE2D6] text-[#2B211E]'
        }`}
      >
        
        {/* Modal Top Header */}
        <div
          className={`px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between gap-3 transition-colors ${
            isDark ? 'bg-[#1D1718] border-[#3D2E32]' : 'bg-[#FAF7F2] border-[#EAE2D6]'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded bg-[#651F32] text-white shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3
                className={`font-serif text-sm sm:text-lg font-medium truncate ${
                  isDark ? 'text-[#F7EFE8]' : 'text-[#2B211E]'
                }`}
              >
                {isAdmin ? 'Welcome, Yasir Farooq' : 'Admin Portal · Fairytale Chunri Closet'}
              </h3>
              <p className={`text-[10px] sm:text-[11px] truncate ${isDark ? 'text-[#D8C7B5]' : 'text-[#6B5B53]'}`}>
                {isAdmin
                  ? 'Boutique Catalog & Live Persistent Inventory'
                  : 'Bahawalpur, Punjab · Secure Owner Access'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            {isAdmin && (
              <button
                onClick={logoutAdmin}
                className={`text-xs flex items-center gap-1 px-2.5 py-1.5 rounded-md border transition-colors cursor-pointer ${
                  isDark
                    ? 'text-[#F7EFE8] border-[#3D2E32] hover:bg-[#35282B]'
                    : 'text-[#6B5B53] hover:text-[#651F32] border-[#EAE2D6] hover:bg-white'
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Logout</span>
              </button>
            )}
            <button
              onClick={() => setAdminModalOpen(false)}
              className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                isDark ? 'hover:bg-[#35282B] text-white' : 'hover:bg-[#EAE2D6] text-[#2B211E]'
              }`}
              aria-label="Close admin portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Logged In View - Real Username & Password Login */}
        {!isAdmin ? (
          <div className="p-6 sm:p-10 text-center max-w-md mx-auto space-y-5 my-auto w-full">
            <div className="w-14 h-14 rounded-full bg-[#651F32]/10 text-[#651F32] flex items-center justify-center mx-auto border border-[#C9A96E]/40">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#C9A96E] font-semibold block mb-1">
                Authorized Access
              </span>
              <h4 className="font-serif text-2xl text-[#2B211E] font-medium">
                Admin Login
              </h4>
              <p className="font-serif text-sm text-[#651F32] font-semibold mt-0.5">
                Fairytale Chunri Closet
              </p>
              <p className="text-xs text-[#6B5B53] dark:text-[#C9A96E] mt-2">
                Enter your admin credentials to manage clothing catalog, prices, and inventory.
              </p>
              <div className="mt-2 p-2 bg-[#FAF7F2] dark:bg-[#261D1F] border border-[#E2D7C8] dark:border-[#3D2E32] rounded text-[11px] text-[#651F32] dark:text-[#DEC596] font-medium">
                💡 Demo Credentials — Username: <strong className="font-semibold">yasirFarooq</strong> | Password: <strong className="font-semibold">yasir6466</strong>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-[#F7EFE8]' : 'text-[#2B211E]'}`}>
                  Admin Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setLoginError(null);
                  }}
                  placeholder="yasirFarooq"
                  className={`w-full px-3.5 py-2.5 rounded-md text-sm border focus:outline-hidden transition-colors ${
                    isDark
                      ? 'bg-[#1D1718] border-[#3D2E32] text-white focus:border-[#C9A96E]'
                      : 'bg-white border-[#D8C7B5] text-[#2B211E] focus:border-[#651F32]'
                  }`}
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-[#F7EFE8]' : 'text-[#2B211E]'}`}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError(null);
                  }}
                  placeholder="yasir6466"
                  className={`w-full px-3.5 py-2.5 rounded-md text-sm border focus:outline-hidden transition-colors ${
                    isDark
                      ? 'bg-[#1D1718] border-[#3D2E32] text-white focus:border-[#C9A96E]'
                      : 'bg-white border-[#D8C7B5] text-[#2B211E] focus:border-[#651F32]'
                  }`}
                  autoComplete="current-password"
                  required
                />
              </div>

              {loginError && (
                <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded text-xs text-red-700 dark:text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#651F32] hover:bg-[#4E1525] text-white py-2.5 rounded-md text-sm font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSubmitting ? 'Verifying Credentials...' : 'Sign In'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Logged In Admin Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Overview Metric Cards */}
            <div className={`p-3 sm:px-6 border-b grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 transition-colors ${
              isDark ? 'bg-[#1D1718] border-[#3D2E32]' : 'bg-[#FAF7F2] border-[#EAE2D6]'
            }`}>
              <div className={`p-2 sm:p-2.5 rounded border transition-colors ${
                isDark ? 'bg-[#261D1F] border-[#3D2E32]' : 'bg-white border-[#E2D7C8]'
              }`}>
                <span className={`text-[10px] sm:text-[11px] block ${isDark ? 'text-[#D8C7B5]' : 'text-[#8C7A6B]'}`}>Total Pieces</span>
                <span className={`text-sm sm:text-lg font-semibold tabular-nums ${isDark ? 'text-[#F7EFE8]' : 'text-[#2A211D]'}`}>
                  {stats ? stats.total : products.length}
                </span>
              </div>
              <div className={`p-2 sm:p-2.5 rounded border transition-colors ${
                isDark ? 'bg-[#261D1F] border-[#3D2E32]' : 'bg-white border-[#E2D7C8]'
              }`}>
                <span className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 block">Available</span>
                <span className="text-sm sm:text-lg font-semibold text-emerald-700 dark:text-emerald-300 tabular-nums">
                  {stats ? stats.available : products.filter((p) => p.available).length}
                </span>
              </div>
              <div className={`p-2 sm:p-2.5 rounded border transition-colors ${
                isDark ? 'bg-[#261D1F] border-[#3D2E32]' : 'bg-white border-[#E2D7C8]'
              }`}>
                <span className="text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 block">Out of Stock</span>
                <span className="text-sm sm:text-lg font-semibold text-stone-700 dark:text-stone-300 tabular-nums">
                  {stats ? stats.outOfStock : products.filter((p) => !p.available).length}
                </span>
              </div>
              <div className={`p-2 sm:p-2.5 rounded border transition-colors ${
                isDark ? 'bg-[#261D1F] border-[#3D2E32]' : 'bg-white border-[#E2D7C8]'
              }`}>
                <span className="text-[10px] sm:text-[11px] text-[#C5A059] block">Featured</span>
                <span className={`text-sm sm:text-lg font-semibold tabular-nums ${isDark ? 'text-[#F7EFE8]' : 'text-[#2A211D]'}`}>
                  {stats ? stats.featured : products.filter((p) => p.featured).length}
                </span>
              </div>
              <div className={`p-2 sm:p-2.5 rounded border col-span-3 sm:col-span-1 transition-colors ${
                isDark ? 'bg-[#261D1F] border-[#3D2E32]' : 'bg-white border-[#E2D7C8]'
              }`}>
                <span className="text-[10px] sm:text-[11px] text-[#6B1728] dark:text-[#DEC596] block">New Arrivals</span>
                <span className="text-sm sm:text-lg font-semibold text-[#6B1728] dark:text-[#DEC596] tabular-nums">
                  {stats ? stats.newArrivals : products.filter((p) => p.newArrival).length}
                </span>
              </div>
            </div>

            {/* Status Feedback banner */}
            {statusMessage && (
              <div
                className={`px-4 sm:px-6 py-2.5 text-xs flex items-center justify-between ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                    : 'bg-red-50 text-red-800 border-b border-red-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {statusMessage.type === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
                <button
                  onClick={() => setStatusMessage(null)}
                  className="text-stone-500 hover:text-stone-800"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Tabs Header - Horizontally scrollable on mobile */}
            <div className={`px-4 sm:px-6 pt-3 border-b flex items-center justify-between gap-4 overflow-x-auto whitespace-nowrap transition-colors ${
              isDark ? 'bg-[#1D1718] border-[#3D2E32]' : 'bg-white border-[#EAE2D6]'
            }`}>
              <div className="flex space-x-1 sm:space-x-3">
                <button
                  onClick={() => {
                    setActiveTab('list');
                    setStatusMessage(null);
                  }}
                  className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'list'
                      ? isDark ? 'border-[#DEC596] text-[#DEC596]' : 'border-[#6B1728] text-[#6B1728]'
                      : isDark ? 'border-transparent text-[#D8C7B5] hover:text-white' : 'border-transparent text-[#685950] hover:text-[#2A211D]'
                  }`}
                >
                  Catalog ({products.length})
                </button>

                <button
                  onClick={() => {
                    setActiveTab('bulk');
                    setStatusMessage(null);
                  }}
                  className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'bulk'
                      ? isDark ? 'border-[#DEC596] text-[#DEC596]' : 'border-[#6B1728] text-[#6B1728]'
                      : isDark ? 'border-transparent text-[#D8C7B5] hover:text-white' : 'border-transparent text-[#685950] hover:text-[#2A211D]'
                  }`}
                >
                  <Camera className="w-4 h-4 text-[#6B1728] dark:text-[#DEC596]" />
                  <span>Bulk Upload</span>
                </button>

                <button
                  onClick={handleOpenAdd}
                  className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'form' && !editingId
                      ? isDark ? 'border-[#DEC596] text-[#DEC596]' : 'border-[#6B1728] text-[#6B1728]'
                      : isDark ? 'border-transparent text-[#D8C7B5] hover:text-white' : 'border-transparent text-[#685950] hover:text-[#2A211D]'
                  }`}
                >
                  + Add Piece
                </button>

                {editingId && activeTab === 'form' && (
                  <span className="pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 border-[#6B1728] text-[#6B1728] dark:border-[#DEC596] dark:text-[#DEC596]">
                    Editing Piece
                  </span>
                )}
              </div>

              <div className="pb-3 flex items-center gap-2">
                <button
                  onClick={exportProducts}
                  title="Download database JSON backup"
                  className={`px-3 py-1.5 text-xs font-medium rounded border flex items-center gap-1.5 cursor-pointer transition-colors ${
                    isDark
                      ? 'bg-[#261D1F] text-[#F7EFE8] border-[#3D2E32] hover:bg-[#35282B]'
                      : 'bg-[#FAF7F2] text-[#5A4D45] border-[#E2D7C8] hover:bg-white hover:text-[#2A211D]'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export Backup</span>
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            <div className={`flex-1 overflow-y-auto p-6 sm:p-8 transition-colors ${
              isDark ? 'bg-[#1D1718] text-[#F7EFE8]' : 'bg-[#FAF7F2]/50 text-[#2B211E]'
            }`}>
              
              {activeTab === 'bulk' ? (
                /* TAB: Bulk Upload Exact Photos */
                <div className="space-y-6 max-w-4xl mx-auto">
                  <div className={`p-6 rounded-xl border space-y-4 transition-colors ${
                    isDark ? 'bg-[#261D1F] border-[#3D2E32] text-[#F7EFE8]' : 'bg-white border-[#EAE2D6] text-[#2B211E]'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-serif text-xl font-medium text-[#2A211D] flex items-center gap-2">
                          <Camera className="w-5 h-5 text-[#6B1728]" />
                          <span>Add Your Exact WhatsApp Clothes Photos</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-[#685950] mt-1">
                          Select one or multiple photos directly from your device (including your 28 WhatsApp clothing pictures). The website will save and display your exact photos without altering the design.
                        </p>
                      </div>
                    </div>

                    {/* Upload Zone */}
                    <label className="border-2 border-dashed border-[#D8C7B5] hover:border-[#6B1728] bg-[#FAF7F2] rounded-xl p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-colors group">
                      <div className="w-14 h-14 rounded-full bg-white shadow-xs flex items-center justify-center text-[#6B1728] group-hover:scale-110 transition-transform mb-3">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-[#2A211D]">
                        Click to Select Your Exact Clothes Photos (Multi-Select Supported)
                      </p>
                      <p className="text-xs text-[#8C7A6B] mt-1">
                        Select any number of JPEG or PNG photos from your computer or phone
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleBulkFilesSelected}
                        className="hidden"
                      />
                    </label>

                    {/* Selected Photos List */}
                    {bulkItems.length > 0 && (
                      <div className="space-y-4 pt-4 border-t border-[#EAE2D6]">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#2A211D]">
                            {bulkItems.length} Photos Selected & Ready to Publish:
                          </span>
                          <button
                            onClick={() => setBulkItems([])}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Clear All
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[420px] overflow-y-auto pr-1">
                          {bulkItems.map((item, idx) => (
                            <div
                              key={item.id}
                              className="p-3 bg-[#FAF7F2] dark:bg-[#1D1718] rounded-lg border border-[#E2D7C8] dark:border-[#3D2E32] flex gap-3 items-center shadow-2xs"
                            >
                              <img
                                src={item.image}
                                alt="Selected preview"
                                className="w-16 h-20 object-cover object-center rounded bg-white dark:bg-[#261D1F] border border-[#E2D7C8] dark:border-[#3D2E32] shrink-0"
                              />
                              <div className="flex-1 space-y-2 min-w-0">
                                <div>
                                  <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setBulkItems((prev) =>
                                        prev.map((it, i) => (i === idx ? { ...it, name: val } : it))
                                      );
                                    }}
                                    placeholder="Piece Name"
                                    className="w-full text-xs font-medium px-2.5 py-1.5 bg-white dark:bg-[#261D1F] text-[#2B211E] dark:text-[#F7EFE8] border border-[#E2D7C8] dark:border-[#3D2E32] rounded focus:border-[#651F32] focus:outline-hidden"
                                  />
                                </div>
                                
                                <div className="grid grid-cols-12 gap-2 items-center">
                                  {/* Price Input */}
                                  <div className="col-span-5 min-w-0">
                                    <input
                                      type="number"
                                      value={item.price}
                                      onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setBulkItems((prev) =>
                                          prev.map((it, i) => (i === idx ? { ...it, price: val } : it))
                                        );
                                      }}
                                      placeholder="PKR"
                                      title="Price in PKR"
                                      className="w-full text-xs px-2 py-1.5 bg-white dark:bg-[#261D1F] text-[#2B211E] dark:text-[#F7EFE8] border border-[#E2D7C8] dark:border-[#3D2E32] rounded focus:border-[#651F32] focus:outline-hidden"
                                    />
                                  </div>

                                  {/* Full-width Category Dropdown */}
                                  <div className="col-span-7 min-w-0">
                                    <select
                                      value={item.category}
                                      onChange={(e) => {
                                        const val = e.target.value as any;
                                        setBulkItems((prev) =>
                                          prev.map((it, i) => (i === idx ? { ...it, category: val } : it))
                                        );
                                      }}
                                      title="Category"
                                      className="w-full text-xs px-2 py-1.5 bg-white dark:bg-[#261D1F] text-[#2B211E] dark:text-[#F7EFE8] border border-[#E2D7C8] dark:border-[#3D2E32] rounded focus:border-[#651F32] focus:outline-hidden cursor-pointer truncate"
                                    >
                                      <option value="Suits">Suits</option>
                                      <option value="Chunri">Chunri</option>
                                      <option value="Dupattas">Dupattas</option>
                                      <option value="Unstitched">Unstitched</option>
                                      <option value="Ready to Wear">Ready to Wear</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Publish All Button */}
                        <div className="pt-3 flex justify-end">
                          <button
                            onClick={handleSaveBulkUploads}
                            disabled={isUploadingBulk}
                            className="bg-[#6B1728] hover:bg-[#52101E] text-white px-6 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-colors shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>
                              {isUploadingBulk
                                ? 'Saving Photos to Live Store...'
                                : `Save All ${bulkItems.length} Pieces to Live Store`}
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : activeTab === 'list' ? (
                /* TAB 1: Product List Management */
                <div className="space-y-4">
                  
                  {/* Top Bar: Search + Add Product */}
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={adminSearch}
                        onChange={(e) => setAdminSearch(e.target.value)}
                        placeholder="Search products in database..."
                        className={`w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-md border transition-colors focus:outline-hidden ${
                          isDark
                            ? 'bg-[#1D1718] text-[#F7EFE8] border-[#3D2E32] focus:border-[#DEC596] placeholder-[#A8988C]'
                            : 'bg-white text-[#2B211E] border-[#E2D7C8] focus:border-[#6B1728]'
                        }`}
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {products.length > 0 && (
                        <button
                          type="button"
                          onClick={async () => {
                            if (
                              confirm(
                                `Permanently delete all ${products.length} clothes from the database? This will clear the catalog so you can add your own photos. They will NOT reappear on refresh.`
                              )
                            ) {
                              await deleteAllProducts();
                              setStatusMessage({
                                type: 'success',
                                text: 'All clothes permanently deleted from the database! You can now add your own images.',
                              });
                            }
                          }}
                          className="inline-flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-md transition-colors cursor-pointer"
                          title="Delete all clothes to start fresh"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                          <span>Delete All Clothes</span>
                        </button>
                      )}

                      <button
                        onClick={() => setActiveTab('bulk')}
                        className="inline-flex items-center justify-center gap-1.5 bg-[#FAF7F2] hover:bg-[#F2EAE0] text-[#6B1728] border border-[#D8C7B5] text-xs sm:text-sm font-medium px-3.5 py-2 rounded-md transition-colors cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Upload Your Photos</span>
                      </button>

                      <button
                        onClick={handleOpenAdd}
                        className="inline-flex items-center justify-center gap-1.5 bg-[#6B1728] hover:bg-[#52101E] text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-md transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Add Product</span>
                      </button>
                    </div>
                  </div>

                  {/* Clean Product Grid/Table */}
                  <div className="border border-[#EAE2D6] rounded-lg overflow-hidden bg-white shadow-2xs">
                    <div className="divide-y divide-[#EAE2D6]">
                      {filteredAdminProducts.map((p) => (
                        <div
                          key={p.id}
                          className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF7F2] transition-colors"
                        >
                          {/* Image & Title */}
                          <div className="flex items-center gap-3">
                            <div className="relative group/pic shrink-0">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-14 h-16 object-cover object-top rounded bg-[#F2EAE0] border border-[#EAE2D6]"
                              />
                              {/* Quick Change Photo overlay */}
                              <label
                                title="Click to upload exact photo for this piece"
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover/pic:opacity-100 flex flex-col items-center justify-center rounded cursor-pointer transition-opacity text-white text-[9px] font-medium"
                              >
                                <Camera className="w-3.5 h-3.5 mb-0.5" />
                                <span>Change</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleQuickReplacePhoto(p.id, file);
                                  }}
                                />
                              </label>
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs sm:text-sm font-semibold text-[#2A211D]">
                                  {p.name}
                                </h4>
                                {p.newArrival && (
                                  <span className="text-[10px] bg-[#6B1728]/10 text-[#6B1728] px-1.5 py-0.5 rounded font-medium">
                                    New
                                  </span>
                                )}
                                {p.featured && (
                                  <span className="text-[10px] bg-[#C5A059]/15 text-[#8C6B1C] px-1.5 py-0.5 rounded font-medium">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#8C7A6B]">
                                {p.category} · PKR {p.price.toLocaleString()}
                              </p>
                              <label className="text-[11px] text-[#6B1728] hover:underline cursor-pointer inline-flex items-center gap-1 mt-0.5">
                                <ImageIcon className="w-3 h-3" />
                                <span>Change Photo</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleQuickReplacePhoto(p.id, file);
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          {/* Controls: Availability, Edit, Delete */}
                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            {/* Toggle stock */}
                            <button
                              onClick={() => toggleAvailability(p.id)}
                              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 border transition-colors cursor-pointer ${
                                p.available
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-stone-100 text-stone-600 border-stone-300 hover:bg-stone-200'
                              }`}
                            >
                              {p.available ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Mark Out of Stock</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3.5 h-3.5 text-stone-500" />
                                  <span>Mark Available</span>
                                </>
                              )}
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="p-1.5 text-xs text-[#4A3E37] hover:text-[#6B1728] border border-[#E2D7C8] rounded hover:bg-white transition-colors cursor-pointer"
                              title="Edit piece"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={async () => {
                                if (confirm(`Permanently delete "${p.name}"? It will not appear on the website or after refreshing.`)) {
                                  await deleteProduct(p.id);
                                  setStatusMessage({
                                    type: 'success',
                                    text: `"${p.name}" permanently deleted from database.`,
                                  });
                                }
                              }}
                              className="p-1.5 text-xs text-red-600 hover:bg-red-50 border border-red-200 rounded transition-colors cursor-pointer"
                              title="Delete piece permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {filteredAdminProducts.length === 0 && (
                        <div className="p-10 text-center space-y-3">
                          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
                            <Check className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-serif text-base font-medium text-[#2B211E]">
                              Catalog is Empty (0 Clothes)
                            </p>
                            <p className="text-xs text-[#6B5B53] mt-1 max-w-sm mx-auto">
                              All demo clothes have been permanently deleted. You can now upload your own clothes photos or add individual pieces.
                            </p>
                          </div>
                          <div className="pt-2 flex justify-center gap-2">
                            <button
                              onClick={() => setActiveTab('bulk')}
                              className="inline-flex items-center gap-1.5 bg-[#6B1728] hover:bg-[#52101E] text-white px-4 py-2 rounded-md text-xs font-semibold cursor-pointer shadow-xs"
                            >
                              <Camera className="w-4 h-4" />
                              <span>Upload Your Photos</span>
                            </button>
                            <button
                              onClick={handleOpenAdd}
                              className="inline-flex items-center gap-1.5 border border-[#D8C7B5] bg-white hover:bg-[#FAF7F2] text-[#2B211E] px-4 py-2 rounded-md text-xs font-semibold cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              <span>+ Add Product</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              ) : (
                /* TAB 2: Add / Edit Product Form */
                <form onSubmit={handleSubmitForm} className={`space-y-4 max-w-2xl mx-auto p-6 rounded-lg border transition-colors ${
                  isDark ? 'bg-[#261D1F] border-[#3D2E32] text-[#F7EFE8]' : 'bg-white border-[#EAE2D6] text-[#2B211E]'
                }`}>
                  <div className="flex items-center justify-between border-b border-[#EAE2D6] pb-3">
                    <div>
                      <h4 className="font-serif text-lg font-medium text-[#2A211D]">
                        {editingId ? 'Edit Product' : 'Add New Product to Database'}
                      </h4>
                      <p className="text-xs text-[#8C7A6B]">
                        Changes are saved directly to persistent storage.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('list')}
                      className="text-xs text-[#6B1728] hover:underline cursor-pointer"
                    >
                      ← Back to List
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="sm:col-span-2">
                      <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-[#D8C7B5]' : 'text-[#4A3E37]'}`}>
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Royal Blue Bahawalpuri Chunri"
                        className={`w-full px-3 py-2 text-xs sm:text-sm rounded-md border focus:outline-hidden ${
                          isDark
                            ? 'bg-[#1D1718] text-[#F7EFE8] border-[#3D2E32] focus:border-[#DEC596]'
                            : 'bg-[#FAF7F2] text-[#2B211E] border-[#E2D7C8] focus:border-[#6B1728]'
                        }`}
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-[#D8C7B5]' : 'text-[#4A3E37]'}`}>
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            category: e.target.value as Exclude<ProductCategory, 'All'>,
                          })
                        }
                        className={`w-full px-3 py-2 text-xs sm:text-sm rounded-md border focus:outline-hidden cursor-pointer ${
                          isDark
                            ? 'bg-[#1D1718] text-[#F7EFE8] border-[#3D2E32] focus:border-[#DEC596]'
                            : 'bg-[#FAF7F2] text-[#2B211E] border-[#E2D7C8] focus:border-[#6B1728]'
                        }`}
                      >
                        <option value="Suits" className={isDark ? 'bg-[#1D1718] text-white' : ''}>Suits</option>
                        <option value="Chunri" className={isDark ? 'bg-[#1D1718] text-white' : ''}>Chunri</option>
                        <option value="Dupattas" className={isDark ? 'bg-[#1D1718] text-white' : ''}>Dupattas</option>
                        <option value="Unstitched" className={isDark ? 'bg-[#1D1718] text-white' : ''}>Unstitched</option>
                        <option value="Ready to Wear" className={isDark ? 'bg-[#1D1718] text-white' : ''}>Ready to Wear</option>
                      </select>
                    </div>

                    {/* Price in PKR */}
                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-[#D8C7B5]' : 'text-[#4A3E37]'}`}>
                        Price in PKR *
                      </label>
                      <input
                        type="number"
                        required
                        min={100}
                        step={50}
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        placeholder="3500"
                        className={`w-full px-3 py-2 text-xs sm:text-sm rounded-md border focus:outline-hidden tabular-nums ${
                          isDark
                            ? 'bg-[#1D1718] text-[#F7EFE8] border-[#3D2E32] focus:border-[#DEC596]'
                            : 'bg-[#FAF7F2] text-[#2B211E] border-[#E2D7C8] focus:border-[#6B1728]'
                        }`}
                      />
                    </div>

                    {/* Fabric */}
                    <div className="sm:col-span-2">
                      <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-[#D8C7B5]' : 'text-[#4A3E37]'}`}>
                        Fabric Details
                      </label>
                      <input
                        type="text"
                        value={formData.fabric}
                        onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                        placeholder="e.g. Pure Cotton Tie-Dye, Crinkle Chiffon, Raw Silk & Gota"
                        className={`w-full px-3 py-2 text-xs sm:text-sm rounded-md border focus:outline-hidden ${
                          isDark
                            ? 'bg-[#1D1718] text-[#F7EFE8] border-[#3D2E32] focus:border-[#DEC596]'
                            : 'bg-[#FAF7F2] text-[#2B211E] border-[#E2D7C8] focus:border-[#6B1728]'
                        }`}
                      />
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-2">
                      <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-[#D8C7B5]' : 'text-[#4A3E37]'}`}>
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe the chunri motif, border detailing, occasion..."
                        className={`w-full px-3 py-2 text-xs sm:text-sm rounded-md border focus:outline-hidden ${
                          isDark
                            ? 'bg-[#1D1718] text-[#F7EFE8] border-[#3D2E32] focus:border-[#DEC596]'
                            : 'bg-[#FAF7F2] text-[#2B211E] border-[#E2D7C8] focus:border-[#6B1728]'
                        }`}
                      />
                    </div>

                    {/* Image URL or Upload with Preview */}
                    <div className="sm:col-span-2 space-y-2">
                      <label className={`block text-xs font-semibold ${isDark ? 'text-[#D8C7B5]' : 'text-[#4A3E37]'}`}>
                        Product Image (Upload Photo or Paste URL) *
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <input
                          type="text"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="Paste image URL or upload file..."
                          className={`flex-1 w-full px-3 py-2 text-xs sm:text-sm rounded-md border focus:outline-hidden ${
                            isDark
                              ? 'bg-[#1D1718] text-[#F7EFE8] border-[#3D2E32] focus:border-[#DEC596]'
                              : 'bg-[#FAF7F2] text-[#2B211E] border-[#E2D7C8] focus:border-[#6B1728]'
                          }`}
                        />
                        <label className="cursor-pointer inline-flex items-center gap-1.5 bg-[#6B1728] hover:bg-[#52101E] text-white px-4 py-2 rounded-md text-xs font-medium shadow-xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Choose Camera Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Image Preview */}
                      {formData.image && (
                        <div className="mt-2 flex items-center gap-3 p-2.5 bg-[#FAF7F2] rounded border border-[#E2D7C8]">
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-16 h-20 object-cover object-top rounded border bg-white"
                          />
                          <div className="text-xs text-[#5A4D45]">
                            <p className="font-medium text-[#2A211D]">Photo Preview</p>
                            <p className="text-[11px] text-[#8C7A6B] truncate max-w-xs">{formData.image}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Colors */}
                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-[#D8C7B5]' : 'text-[#4A3E37]'}`}>
                        Available Colors (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.colors}
                        onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                        placeholder="e.g. Royal Blue, Crimson Red, Gold"
                        className={`w-full px-3 py-2 text-xs sm:text-sm rounded-md border focus:outline-hidden ${
                          isDark
                            ? 'bg-[#1D1718] text-[#F7EFE8] border-[#3D2E32] focus:border-[#DEC596]'
                            : 'bg-[#FAF7F2] text-[#2B211E] border-[#E2D7C8] focus:border-[#6B1728]'
                        }`}
                      />
                    </div>

                    {/* Sizes */}
                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-[#D8C7B5]' : 'text-[#4A3E37]'}`}>
                        Available Sizes (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.sizes}
                        onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                        placeholder="e.g. Standard 2.5 Yards, Unstitched 3-Piece"
                        className={`w-full px-3 py-2 text-xs sm:text-sm rounded-md border focus:outline-hidden ${
                          isDark
                            ? 'bg-[#1D1718] text-[#F7EFE8] border-[#3D2E32] focus:border-[#DEC596]'
                            : 'bg-[#FAF7F2] text-[#2B211E] border-[#E2D7C8] focus:border-[#6B1728]'
                        }`}
                      />
                    </div>

                    {/* Status Toggles */}
                    <div className={`sm:col-span-2 pt-2 border-t flex flex-wrap gap-6 ${isDark ? 'border-[#3D2E32]' : 'border-[#EAE2D6]'}`}>
                      <label className={`flex items-center gap-2 text-xs font-medium cursor-pointer ${isDark ? 'text-[#D8C7B5]' : 'text-[#4A3E37]'}`}>
                        <input
                          type="checkbox"
                          checked={formData.available}
                          onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                          className="accent-[#6B1728] w-4 h-4 rounded"
                        />
                        <span>In Stock / Available</span>
                      </label>

                      <label className={`flex items-center gap-2 text-xs font-medium cursor-pointer ${isDark ? 'text-[#D8C7B5]' : 'text-[#4A3E37]'}`}>
                        <input
                          type="checkbox"
                          checked={formData.newArrival}
                          onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                          className="accent-[#6B1728] w-4 h-4 rounded"
                        />
                        <span>Mark as New Arrival</span>
                      </label>

                      <label className={`flex items-center gap-2 text-xs font-medium cursor-pointer ${isDark ? 'text-[#D8C7B5]' : 'text-[#4A3E37]'}`}>
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="accent-[#6B1728] w-4 h-4 rounded"
                        />
                        <span>Mark as Featured</span>
                      </label>
                    </div>

                  </div>

                  {/* Buttons */}
                  <div className="pt-4 border-t border-[#EAE2D6] flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('list')}
                      className="px-4 py-2 border border-[#E2D7C8] text-xs font-medium rounded-md hover:bg-[#FAF7F2] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-[#6B1728] hover:bg-[#52101E] text-white text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving to Database...' : editingId ? 'Save Changes' : 'Add to Catalog'}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
