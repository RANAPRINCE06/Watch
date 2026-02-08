const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; [k: string]: unknown }> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const authApi = {
  register: (name: string, email: string, password: string) =>
    api<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  login: (email: string, password: string) =>
    api<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () => api<{ user: User }>('/auth/me'),
  updateProfile: (data: { name?: string; phone?: string; address?: object }) =>
    api<{ user: User }>('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
};

export const productsApi = {
  list: (params?: Record<string, string | number>) => {
    const q = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => q.set(k, String(v)));
    return api<{ products: Product[]; total: number; pages: number }>(`/products?${q}`);
  },
  featured: () => api<{ products: Product[] }>('/products/featured'),
  categories: () => api<{ categories: string[] }>('/products/categories'),
  filters: () => api<{ models: string[]; strapTypes: string[]; dialColors: string[] }>('/products/filters'),
  byId: (id: string) => api<{ product: Product; related: Product[] }>(`/products/${id}`),
};

export const ordersApi = {
  validateCoupon: (code: string, subtotal: number) =>
    api<{ success: boolean; discount?: number; couponCode?: string; message?: string }>(
      '/orders/validate-coupon',
      { method: 'POST', body: JSON.stringify({ code, subtotal }) }
    ),
  create: (body: CreateOrderBody) =>
    api<{ order: Order }>('/orders', { method: 'POST', body: JSON.stringify(body) }),
  list: () => api<{ orders: Order[] }>('/orders'),
  byId: (id: string) => api<{ order: Order }>(`/orders/${id}`),
  cancel: (id: string) => api<{ order: Order }>(`/orders/${id}/cancel`, { method: 'PATCH' }),
  invoiceUrl: (id: string) => {
    const token = getToken();
    return `${API_URL}/orders/${id}/invoice${token ? `?token=${token}` : ''}`;
  },
};

export const usersApi = {
  wishlist: () => api<{ wishlist: Product[] }>('/users/wishlist'),
  toggleWishlist: (productId: string) =>
    api<{ wishlist: string[]; added: boolean }>(`/users/wishlist/${productId}`, { method: 'POST' }),
};

export const paymentApi = {
  createOrder: (orderId: string, paymentMethod: string) =>
    api<{
      orderId: string;
      razorpayOrderId?: string;
      amount?: number;
      currency?: string;
      key?: string;
      clientSecret?: string;
    }>('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify({ orderId, paymentMethod }),
    }),
  verifyRazorpay: (body: {
    orderId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => api<{ order: Order }>('/payment/verify-razorpay', { method: 'POST', body: JSON.stringify(body) }),
  verifyStripe: (orderId: string, paymentIntentId: string) =>
    api<{ order: Order }>('/payment/verify-stripe', {
      method: 'POST',
      body: JSON.stringify({ orderId, paymentIntentId }),
    }),
};

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  address?: object;
  phone?: string;
  wishlist?: string[] | Product[];
}

export interface Product {
  _id: string;
  name: string;
  model: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  specifications?: {
    caseSize?: string;
    movement?: string;
    waterResistance?: string;
    strapType?: string;
    dialColor?: string;
    caseMaterial?: string;
  };
  featured?: boolean;
}

export interface OrderItem {
  product: string | Product;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  _id: string;
  userId: string;
  products: OrderItem[];
  totalAmount: number;
  subtotal?: number;
  gst?: number;
  discount?: number;
  couponCode?: string;
  paymentStatus: string;
  orderStatus: string;
  shippingDetails: {
    name: string;
    phone: string;
    email: string;
    address: string;
    pincode: string;
    city?: string;
    state?: string;
  };
  createdAt: string;
}

export interface CreateOrderBody {
  products: { product: string; quantity: number }[];
  shippingDetails: Order['shippingDetails'];
  couponCode?: string;
  paymentMethod?: string;
}

export const adminApi = {
  orders: () => api<{ orders: Order[] }>('/admin/orders'),
  updateOrderStatus: (orderId: string, status: string) =>
    api<{ order: Order }>(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  products: () => api<{ products: Product[] }>('/admin/products'),
  addProduct: (form: FormData) => {
    const token = getToken();
    return fetch(`${API_URL}/admin/products`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    }).then((res) => res.json());
  },
  updateProduct: (id: string, form: FormData) => {
    const token = getToken();
    return fetch(`${API_URL}/admin/products/${id}`, {
      method: 'PUT',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    }).then((res) => res.json());
  },
  deleteProduct: (id: string) =>
    api(`/admin/products/${id}`, { method: 'DELETE' }),
  coupons: () => api<{ coupons: unknown[] }>('/admin/coupons'),
  addCoupon: (data: unknown) =>
    api('/admin/coupons', { method: 'POST', body: JSON.stringify(data) }),
};
