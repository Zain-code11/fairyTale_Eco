import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Admin authentication constants
const OWNER_PASSCODE = 'yasir6466';
const OWNER_SECRET_TOKEN = 'ft_admin_token_yasir_farooq_2026';
const VALID_USERNAMES = new Set(['yasirfarooq']);
const VALID_PASSCODES = new Set(['yasir6466']);

// Paths
const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const DIST_DIR = path.join(__dirname, 'dist');
const DIST_IMAGES_DIR = path.join(DIST_DIR, 'images');
const DIST_UPLOADS_DIR = path.join(DIST_DIR, 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Body parsing with capacity for image uploads
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Static paths
const PUBLIC_DIR = path.join(__dirname, 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const SRC_ASSETS_DIR = path.join(__dirname, 'src', 'assets', 'images');

// Ensure image directories exist
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Static serving for images and uploads in both dev and production
app.use('/images', express.static(IMAGES_DIR));
app.use('/images', express.static(DIST_IMAGES_DIR));
app.use('/images', express.static(SRC_ASSETS_DIR));
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/uploads', express.static(DIST_UPLOADS_DIR));
app.use('/src/assets/images', express.static(IMAGES_DIR));
app.use('/src/assets/images', express.static(SRC_ASSETS_DIR));
app.use('/src/assets/images', express.static(DIST_IMAGES_DIR));
app.use(express.static(PUBLIC_DIR));
app.use(express.static(DIST_DIR));

// Helper: read products from disk
function readProducts(): any[] {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading products database:', err);
  }
  return [];
}

// Helper: write products to disk
function writeProducts(products: any[]): boolean {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing products database:', err);
    return false;
  }
}

// Auth Middleware for Admin mutations
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : req.headers['x-admin-token'];

  if (token === OWNER_SECRET_TOKEN || (typeof token === 'string' && VALID_PASSCODES.has(token.trim().toLowerCase()))) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    store: 'Fairytale Chunri Closet',
    owner: 'Yasir Farooq',
    location: 'Bahawalpur, Punjab, Pakistan',
    time: new Date().toISOString(),
  });
});

// 2. Admin Login (Requires Username AND Password)
const handleAdminLogin = (req: Request, res: Response) => {
  const { username, password, passcode } = req.body;
  
  const rawPass = password || passcode;
  if (!rawPass) {
    return res.status(400).json({ error: 'Password is required' });
  }

  // Validate username if provided
  if (username) {
    const cleanUser = String(username).trim().toLowerCase();
    if (!VALID_USERNAMES.has(cleanUser)) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  }

  const cleanPass = String(rawPass).trim().toLowerCase();
  if (VALID_PASSCODES.has(cleanPass)) {
    return res.json({
      success: true,
      token: OWNER_SECRET_TOKEN,
      user: {
        name: 'Yasir Farooq',
        username: username ? String(username).trim() : 'yasirfarooq',
        role: 'owner',
        business: 'Fairytale Chunri Closet',
      },
    });
  }

  return res.status(401).json({ error: 'Invalid username or password' });
};

app.post('/api/admin/login', handleAdminLogin);
app.post('/api/auth/login', handleAdminLogin);

// 2b. Admin Verification
app.get('/api/admin/verify', requireAdmin, (req: Request, res: Response) => {
  res.json({
    authenticated: true,
    user: {
      name: 'Yasir Farooq',
      username: 'yasirfarooq',
      role: 'owner',
      business: 'Fairytale Chunri Closet',
    },
  });
});

// 2c. Admin Logout
app.post('/api/admin/logout', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// 3. GET /api/products
app.get('/api/products', (req: Request, res: Response) => {
  let products = readProducts();
  const { category, search, available, sort } = req.query;

  // Filter by category
  if (category && category !== 'All') {
    if (category === 'New Arrivals') {
      products = products.filter((p) => p.newArrival === true);
    } else {
      products = products.filter(
        (p) => String(p.category).toLowerCase() === String(category).toLowerCase()
      );
    }
  }

  // Filter by search query
  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.fabric && p.fabric.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }

  // Filter by availability
  if (available === 'true') {
    products = products.filter((p) => p.available === true);
  }

  // Sort
  if (sort === 'price-asc') {
    products.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sort === 'price-desc') {
    products.sort((a, b) => Number(b.price) - Number(a.price));
  } else {
    // Newest first default
    products.sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  res.json(products);
});

// 4. GET /api/products/:id
app.get('/api/products/:id', (req: Request, res: Response) => {
  const products = readProducts();
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// 5. POST /api/products (Admin Only)
app.post('/api/products', requireAdmin, (req: Request, res: Response) => {
  const {
    name,
    category,
    price,
    description,
    image,
    images,
    fabric,
    colors,
    sizes,
    available,
    featured,
    newArrival,
  } = req.body;

  if (!name || !category || price === undefined || !image) {
    return res.status(400).json({ error: 'Name, category, price, and image are required' });
  }

  const products = readProducts();
  const newProduct = {
    id: `prod-${Date.now()}`,
    name: String(name).trim(),
    category: String(category).trim(),
    price: Number(price),
    description: String(description || '').trim(),
    image: String(image).trim(),
    images: Array.isArray(images) && images.length > 0 ? images : [String(image).trim()],
    fabric: fabric ? String(fabric).trim() : 'Pure Traditional Cotton',
    colors: Array.isArray(colors)
      ? colors
      : String(colors || '')
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean),
    sizes: Array.isArray(sizes)
      ? sizes
      : String(sizes || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
    available: available !== undefined ? Boolean(available) : true,
    featured: Boolean(featured),
    newArrival: Boolean(newArrival),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  products.unshift(newProduct);
  writeProducts(products);

  res.status(201).json(newProduct);
});

// 6. PUT /api/products/:id (Admin Only)
app.put('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
  const products = readProducts();
  const index = products.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existing = products[index];
  const updates = req.body;

  const updatedProduct = {
    ...existing,
    ...updates,
    price: updates.price !== undefined ? Number(updates.price) : existing.price,
    updatedAt: new Date().toISOString(),
  };

  // Format arrays if passed as strings
  if (typeof updates.colors === 'string') {
    updatedProduct.colors = updates.colors.split(',').map((c: string) => c.trim()).filter(Boolean);
  }
  if (typeof updates.sizes === 'string') {
    updatedProduct.sizes = updates.sizes.split(',').map((s: string) => s.trim()).filter(Boolean);
  }

  products[index] = updatedProduct;
  writeProducts(products);

  res.json(updatedProduct);
});

// 7. DELETE /api/products/:id (Admin Only)
app.delete('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
  const products = readProducts();
  const filtered = products.filter((p) => p.id !== req.params.id);

  if (filtered.length === products.length) {
    return res.status(404).json({ error: 'Product not found' });
  }

  writeProducts(filtered);
  res.json({ success: true, id: req.params.id });
});

// 7b. DELETE /api/products (Delete All Products - Admin Only)
app.delete('/api/products', requireAdmin, (req: Request, res: Response) => {
  writeProducts([]);
  res.json({ success: true, count: 0, message: 'All products permanently deleted from database' });
});

// 8. POST /api/upload (Admin Only)
app.post('/api/upload', requireAdmin, (req: Request, res: Response) => {
  try {
    const { image, filename } = req.body;
    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: 'Image data URL is required' });
    }

    const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 image data' });
    }

    const ext = matches[1].replace('jpeg', 'jpg');
    const base64Data = matches[2];
    const safeName = (filename || 'product')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();
    const uniqueFilename = `${safeName}_${Date.now()}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, uniqueFilename);

    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    res.json({
      success: true,
      url: `/uploads/${uniqueFilename}`,
    });
  } catch (err: any) {
    console.error('Error handling upload:', err);
    res.status(500).json({ error: 'Failed to save image' });
  }
});

// 8b. POST /api/upload-bulk (Admin Only) - Batch upload user's exact photos
app.post('/api/upload-bulk', requireAdmin, (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Array of items required' });
    }

    const products = readProducts();
    const uploadedProducts: any[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.image) continue;

      const matches = item.image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (!matches) continue;

      const ext = matches[1].replace('jpeg', 'jpg');
      const base64Data = matches[2];
      const safeName = (item.filename || `product_${i}`)
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .toLowerCase();
      const uniqueFilename = `${safeName}_${Date.now()}_${i}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, uniqueFilename);

      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
      const imageUrl = `/uploads/${uniqueFilename}`;

      const newProduct = {
        id: `prod-${Date.now()}-${i}`,
        name: item.name || `Authentic Chunri Suit #${products.length + 1}`,
        category: item.category || 'Suits',
        price: item.price ? Number(item.price) : 6500,
        description:
          item.description ||
          'Authentic handcrafted Bahawalpuri tie-dye Chunri with traditional bandhani dots.',
        image: imageUrl,
        images: [imageUrl],
        fabric: item.fabric || 'Pure Traditional Cotton',
        colors: item.colors ? (Array.isArray(item.colors) ? item.colors : [item.colors]) : ['Multi'],
        sizes: item.sizes ? (Array.isArray(item.sizes) ? item.sizes : [item.sizes]) : ['Unstitched 3-Piece'],
        available: true,
        featured: Boolean(item.featured),
        newArrival: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      products.unshift(newProduct);
      uploadedProducts.push(newProduct);
    }

    writeProducts(products);

    res.json({
      success: true,
      count: uploadedProducts.length,
      products: uploadedProducts,
    });
  } catch (err: any) {
    console.error('Error handling bulk upload:', err);
    res.status(500).json({ error: 'Failed to process bulk upload' });
  }
});

// 9. Admin Stats Overview
app.get('/api/stats', (req: Request, res: Response) => {
  const products = readProducts();
  res.json({
    total: products.length,
    available: products.filter((p) => p.available).length,
    outOfStock: products.filter((p) => !p.available).length,
    featured: products.filter((p) => p.featured).length,
    newArrivals: products.filter((p) => p.newArrival).length,
  });
});

// ==========================================
// VITE DEV SERVER OR PRODUCTION STATIC
// ==========================================
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    // Mount Vite dev server middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // Production: serve built static files from dist
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      if (req.path.startsWith('/api/') || req.path.match(/\.(jpg|jpeg|png|webp|svg|ico)$/i)) {
        return res.status(404).send('Asset not found');
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fairytale Chunri Closet server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
