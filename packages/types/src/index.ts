// User Types
export enum UserRole {
  ADMIN = 'ADMIN',
  PROCUREMENT_OFFICER = 'PROCUREMENT_OFFICER',
  VENDOR = 'VENDOR',
  MANAGER = 'MANAGER',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

// Vendor Types
export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  website?: string;
  gstNumber: string;
  panNumber: string;
  category: string;
  rating: number;
  isActive: boolean;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVendorRequest {
  name: string;
  email: string;
  phone: string;
  website?: string;
  gstNumber: string;
  panNumber: string;
  category: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UpdateVendorRequest extends Partial<CreateVendorRequest> {}

// RFQ Types
export enum RFQStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PO_GENERATED = 'PO_GENERATED',
  CLOSED = 'CLOSED',
}

export interface RFQItem {
  id: string;
  rfqId: string;
  productName: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RFQ {
  id: string;
  rfqNumber: string;
  title: string;
  description: string;
  status: RFQStatus;
  createdBy: string;
  publishDate: Date;
  deadlineDate: Date;
  items: RFQItem[];
  vendorIds: string[];
  attachmentUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRFQRequest {
  title: string;
  description: string;
  deadlineDate: Date;
  items: Array<{
    productName: string;
    description: string;
    quantity: number;
    unit: string;
    estimatedPrice?: number;
  }>;
  vendorIds: string[];
  attachmentUrls?: string[];
}

export interface UpdateRFQRequest extends Partial<CreateRFQRequest> {}

// Quotation Types
export enum QuotationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface QuotationItem {
  id: string;
  quotationId: string;
  rfqItemId: string;
  unitPrice: number;
  quantity: number;
  tax: number;
  discount: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  rfqId: string;
  vendorId: string;
  status: QuotationStatus;
  totalAmount: number;
  taxAmount: number;
  discountAmount: number;
  finalAmount: number;
  deliveryDays: number;
  paymentTerms: string;
  items: QuotationItem[];
  attachmentUrls: string[];
  score?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQuotationRequest {
  rfqId: string;
  vendorId: string;
  items: Array<{
    rfqItemId: string;
    unitPrice: number;
    quantity: number;
    tax: number;
    discount: number;
  }>;
  deliveryDays: number;
  paymentTerms: string;
  attachmentUrls?: string[];
}

export interface UpdateQuotationRequest extends Partial<CreateQuotationRequest> {}

// Quotation Comparison Types
export interface QuotationScore {
  quotationId: string;
  vendorId: string;
  vendorName: string;
  priceScore: number; // 50%
  deliveryScore: number; // 30%
  ratingScore: number; // 20%
  totalScore: number;
  finalAmount: number;
  deliveryDays: number;
  vendorRating: number;
}

export interface QuotationComparison {
  rfqId: string;
  quotations: QuotationScore[];
  bestQuotation: QuotationScore;
}

// PO Types
export enum POStatus {
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

export interface POItem {
  id: string;
  poId: string;
  rfqItemId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  rfqId: string;
  quotationId: string;
  vendorId: string;
  status: POStatus;
  totalAmount: number;
  taxAmount: number;
  finalAmount: number;
  items: POItem[];
  issueDate: Date;
  deliveryDate: Date;
  attachmentUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePORequest {
  rfqId: string;
  quotationId: string;
  vendorId: string;
  deliveryDate: Date;
}

// Invoice Types
export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  OVERDUE = 'OVERDUE',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  poItemId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  poId: string;
  vendorId: string;
  status: InvoiceStatus;
  totalAmount: number;
  taxAmount: number;
  finalAmount: number;
  items: InvoiceItem[];
  invoiceDate: Date;
  dueDate: Date;
  attachmentUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInvoiceRequest {
  poId: string;
  vendorId: string;
  dueDate: Date;
  items: Array<{
    poItemId: string;
    quantity: number;
  }>;
}

// Audit Log Types
export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  SUBMIT = 'SUBMIT',
  PUBLISH = 'PUBLISH',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export interface AuditLog {
  id: string;
  userId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  changes: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

// Notification Types
export enum NotificationType {
  RFQ_PUBLISHED = 'RFQ_PUBLISHED',
  QUOTATION_REQUESTED = 'QUOTATION_REQUESTED',
  QUOTATION_SUBMITTED = 'QUOTATION_SUBMITTED',
  RFQ_APPROVED = 'RFQ_APPROVED',
  RFQ_REJECTED = 'RFQ_REJECTED',
  PO_ISSUED = 'PO_ISSUED',
  INVOICE_GENERATED = 'INVOICE_GENERATED',
  INVOICE_OVERDUE = 'INVOICE_OVERDUE',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntityId: string;
  relatedEntityType: string;
  isRead: boolean;
  createdAt: Date;
}

// Report Types
export interface VendorPerformanceReport {
  vendorId: string;
  vendorName: string;
  totalQuotations: number;
  approvedQuotations: number;
  averageScore: number;
  totalSpent: number;
  deliveryOnTimePercentage: number;
  qualityRating: number;
  periodStart: Date;
  periodEnd: Date;
}

export interface MonthlySpendsReport {
  month: string;
  year: number;
  totalSpend: number;
  vendorBreakdown: Array<{
    vendorId: string;
    vendorName: string;
    amount: number;
    percentage: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

export interface ProcurementStatisticsReport {
  totalRFQs: number;
  activeRFQs: number;
  completedRFQs: number;
  totalQuotations: number;
  totalPOs: number;
  totalInvoices: number;
  totalSpend: number;
  averageProcessingTime: number;
  vendorCount: number;
  reportGeneratedAt: Date;
}

// Dashboard Types
export interface DashboardMetrics {
  totalSpend: number;
  totalVendors: number;
  activeRFQs: number;
  pendingApprovals: number;
  monthlySpend: Array<{
    month: string;
    amount: number;
  }>;
  topVendors: Array<{
    vendorId: string;
    vendorName: string;
    totalSpent: number;
  }>;
  rfqByStatus: Array<{
    status: RFQStatus;
    count: number;
  }>;
  recentActivities: AuditLog[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// Query Types
export interface PaginationQuery {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface FilterQuery {
  [key: string]: any;
}
