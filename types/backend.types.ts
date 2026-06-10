// ─── Enums ────────────────────────────────────────────────────────────────────

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  MANAGER = 'manager',
}

export enum ProductStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export enum ProductImageType {
  GALLERY = 'GALLERY',
  DIAGRAM = 'DIAGRAM',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export enum PaymentMethod {
  COD = 'COD',
  ONLINE = 'ONLINE',
  UPI = 'UPI',
}

export enum CategorySortBy {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  IS_ACTIVE = 'isActive',
}

export enum ProductSortBy {
  TITLE = 'title',
  PRICE = 'price',
  CREATED_AT = 'createdAt',
  STOCK = 'stock',
  STATUS = 'status',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

// ─── Shared Response Shapes ───────────────────────────────────────────────────

export interface BackendPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export interface BackendValidationError {
  statusCode: 400;
  message: string | string[];
  error: 'Bad Request';
}

export interface BackendHttpError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
  googleId: string | null;
  picture: string | null;
  provider: 'local' | 'google';
  createdAt: string;
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  image?: File;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
  image?: File;
}

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: CategorySortBy;
  order?: SortOrder;
  isActive?: boolean;
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface ProductImageRequest {
  imageUrl: string;
  imageType: ProductImageType;
  sortOrder?: number;
}

export interface ProductImageResponse {
  id: string;
  imageUrl: string;
  imageType: ProductImageType;
  sortOrder: number;
  createdAt: string;
}

export interface ProductCategoryResponse {
  id: string;
  name: string;
  slug: string;
}

export interface ProductResponse {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  discountPrice: number | null;
  stock: number;
  sku: string | null;
  material: string | null;
  status: ProductStatus;
  color: string | null;
  dimensions: string | null;
  weight: number | null;
  finish: string | null;
  style: string | null;
  careInstructions: string | null;
  warranty: string | null;
  images: ProductImageResponse[];
  isFeatured: boolean;
  isActive: boolean;
  categoryId: string;
  category: ProductCategoryResponse | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  title: string;
  description?: string;
  price: number;
  discountPrice?: number;
  stock?: number;
  sku?: string;
  material?: string;
  status?: ProductStatus;
  color?: string;
  dimensions?: string;
  weight?: number;
  finish?: string;
  style?: string;
  careInstructions?: string;
  warranty?: string;
  categoryId: string;
  images: ProductImageRequest[];
}

export type UpdateProductRequest = Partial<CreateProductRequest>;

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: ProductStatus;
  isFeatured?: boolean;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: ProductSortBy;
  order?: SortOrder;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export interface OrderItemResponse {
  productId: string;
  productTitle: string;
  productImage: string | null;
  productSku: string | null;
  productColor: string | null;
  productCategoryName: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderResponse {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber: string;
  shippingAddress: string;
  city: string;
  state: string;
  zipCode: string;
  gstin: string | null;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  productAmount: number;
  deliveryCharge: number;
  totalAmount: number;
  totalItems: number;
  items: OrderItemResponse[];
  createdAt: string;
  updatedAt: string;
  cancelReason: string | null;
  cancelledAt: string | null;
  cancelledBy?: string | null;
}

export interface AdminOrderUser {
  id: string;
  name: string;
  email: string;
}

export interface AdminOrderResponse extends OrderResponse {
  userId: string;
  user: AdminOrderUser;
}

export interface UpdateOrderStatusRequest {
  orderStatus: OrderStatus;
}

export interface OrderItemDetail {
  productId: string;
  productTitle: string;
  productImage: string | null;
  productSku: string | null;
  productColor: string | null;
  productCategoryName: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderItemsResponse {
  orderId: string;
  totalItems: number;
  items: OrderItemDetail[];
}

export interface GetAdminOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  userId?: string;
  fromDate?: string;
  toDate?: string;
}

// ─── Media ────────────────────────────────────────────────────────────────────

export interface MediaResponse {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  storageKey: string;
  url: string;
  storageType: string;
  uploadedById: string | null;
  createdAt: string;
}

export interface GetMediaParams {
  page?: number;
  limit?: number;
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface SalesMetrics {
  totalRevenue: number;
  todayRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

export interface OrderStatusBreakdown {
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export interface UserMetrics {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  repeatCustomers: number;
}

export interface AnalyticsDashboardResponse {
  sales: SalesMetrics;
  orders: OrderStatusBreakdown;
  users: UserMetrics;
}

export interface RevenueTrendPoint {
  date: string;
  revenue: number;
  orderCount: number;
  averageOrderValue: number;
}

export interface SalesAnalyticsResponse {
  revenueTrend: RevenueTrendPoint[];
  totalSales: number;
}

export interface BestSellingProduct {
  productId: string;
  title: string;
  totalSold: number;
  revenue: number;
}

export interface ProductAnalyticsResponse {
  bestSellingProducts: BestSellingProduct[];
  lowStockProducts: ProductResponse[];
  outOfStockProducts: ProductResponse[];
}

export interface AdminDashboardResponse {
  message: string;
  admin: JwtPayload;
  timestamp: string;
}

export interface AdminStatsResponse {
  totalUsers: number;
  totalAdmins: number;
  googleUsers: number;
  emailPasswordUsers: number;
}

export interface GetAdminUsersParams {
  page?: number;
  limit?: number;
}

export interface GetSalesAnalyticsParams {
  range?: 'daily' | 'weekly' | 'monthly';
  fromDate?: string;
  toDate?: string;
}
