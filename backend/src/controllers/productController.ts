import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../types';
import { dataStore } from '../services/dataStore';
import { env } from '../config/env';

const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  category: z.string().min(2, 'Category is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be positive'),
  unit: z.string().default('quintal'),
  price: z.coerce.number().min(1, 'Price must be positive'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Location is required'),
  district: z.string().default('Thanjavur'),
  state: z.string().default('Tamil Nadu'),
  harvestDate: z.string().optional(),
  imageUrl: z.string().optional(),
});

export class ProductController {
  public static async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, search, sellerId, minPrice, maxPrice, district } = req.query as any;

      let list = [...dataStore.products];

      if (category && category !== 'All') {
        list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }

      if (district) {
        list = list.filter(p => p.district.toLowerCase() === district.toLowerCase());
      }

      if (sellerId) {
        list = list.filter(p => p.sellerId === sellerId);
      }

      if (search) {
        const q = search.toLowerCase().trim();
        list = list.filter(
          p =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.location.toLowerCase().includes(q)
        );
      }

      if (minPrice) {
        list = list.filter(p => p.price >= parseFloat(minPrice));
      }

      if (maxPrice) {
        list = list.filter(p => p.price <= parseFloat(maxPrice));
      }

      res.status(200).json({
        success: true,
        data: {
          products: list,
          total: list.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const product = dataStore.products.find(p => p.id === id);

      if (!product) {
        res.status(404).json({ success: false, message: 'Product listing not found.' });
        return;
      }

      res.status(200).json({
        success: true,
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const validated = productSchema.parse(req.body);
      const file = req.file;

      let finalImageUrl = validated.imageUrl || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80';
      if (file) {
        finalImageUrl = `${env.API_URL}/uploads/products/${file.filename}`;
      }

      const newProduct = {
        id: `prod-${uuidv4().slice(0, 8)}`,
        sellerId: req.user.id,
        sellerName: req.user.fullName,
        sellerMobile: req.user.mobileNumber,
        name: validated.name,
        category: validated.category,
        quantity: validated.quantity,
        availableQuantity: validated.quantity,
        unit: validated.unit,
        price: validated.price,
        description: validated.description,
        location: validated.location,
        district: validated.district || req.user.district,
        state: validated.state || req.user.state,
        harvestDate: validated.harvestDate ? new Date(validated.harvestDate) : new Date(),
        imageUrl: finalImageUrl,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dataStore.products.unshift(newProduct);
      dataStore.persistProduct(newProduct);

      res.status(201).json({
        success: true,
        message: 'Product listing created successfully on AgriOne Marketplace.',
        data: { product: newProduct },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { id } = req.params;
      const product = dataStore.products.find(p => p.id === id);

      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }

      // Enforce ownership: Only the seller or Admin can update
      if (product.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
        res.status(403).json({
          success: false,
          message: 'Forbidden: You are not authorized to modify another farmer\'s product listing.',
        });
        return;
      }

      const file = req.file;
      if (file) {
        product.imageUrl = `${env.API_URL}/uploads/products/${file.filename}`;
      }

      const fields = ['name', 'category', 'quantity', 'availableQuantity', 'unit', 'price', 'description', 'location', 'district', 'state', 'isActive'];
      fields.forEach(field => {
        if (req.body[field] !== undefined) {
          (product as any)[field] = req.body[field];
        }
      });

      product.updatedAt = new Date();
      await dataStore.persistProduct(product);

      res.status(200).json({
        success: true,
        message: 'Product updated successfully.',
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { id } = req.params;
      const index = dataStore.products.findIndex(p => p.id === id);

      if (index === -1) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }

      const product = dataStore.products[index];
      // Enforce ownership check
      if (product.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
        res.status(403).json({
          success: false,
          message: 'Forbidden: You cannot delete another farmer\'s product.',
        });
        return;
      }

      dataStore.products.splice(index, 1);
      await dataStore.deleteProduct(String(id));

      res.status(200).json({
        success: true,
        message: 'Product listing deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }
}
