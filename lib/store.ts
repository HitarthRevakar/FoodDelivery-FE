"use client"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Restaurant {
    id: string
    name: string
    description: string
    cuisine: string
    rating: number
    reviewCount: number
    deliveryTime: string
    priceRange: string
    image: string
    address: string
    phone: string
    isOpen: boolean
    ownerId: string // matches vendor user id
    status: "approved" | "pending" | "rejected"
}

export interface Product {
    id: string
    restaurantId: string
    name: string
    description: string
    price: number
    category: string
    image: string
    isAvailable: boolean
    tags: string[] // e.g. ["Bestseller", "Vegetarian", "Popular"]
}

export interface CartItem {
    productId: string
    restaurantId: string
    name: string
    price: number
    quantity: number
    image: string
}

export interface OrderItem {
    productId: string
    name: string
    price: number
    quantity: number
}

export type OrderStatus = "placed" | "accepted" | "preparing" | "ready" | "picked" | "delivered" | "rejected"

export interface Order {
    id: string
    customerId: string
    customerName: string
    customerPhone: string
    restaurantId: string
    restaurantName: string
    driverId: string | null
    driverName: string | null
    items: OrderItem[]
    status: OrderStatus
    total: number
    deliveryAddress: string
    paymentMethod: string
    createdAt: string
    updatedAt: string
}

export interface PendingVendor {
    id: string
    name: string
    email: string
    cuisine: string
    phone: string
    address: string
    submittedDate: string
    status: "pending" | "approved" | "rejected"
}

export interface PlatformSettings {
    commissionRate: number
    deliveryFeeMin: number
    deliveryFeeMax: number
    supportEmail: string
}

export interface Notification {
    id: string
    userId: string
    message: string
    read: boolean
    createdAt: string
}

// ─── Storage Keys ────────────────────────────────────────────────────────────

const KEYS = {
    restaurants: "fd_restaurants",
    products: "fd_products",
    orders: "fd_orders",
    cart: "fd_cart",
    pendingVendors: "fd_pending_vendors",
    settings: "fd_settings",
    notifications: "fd_notifications",
    initialized: "fd_initialized",
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

const SEED_RESTAURANTS: Restaurant[] = [
    {
        id: "rest1",
        name: "Spice Garden",
        description: "Authentic Indian flavors and aromatic spices",
        cuisine: "Indian",
        rating: 4.6,
        reviewCount: 289,
        deliveryTime: "30-40 min",
        priceRange: "$$",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
        address: "456 Curry Lane, NY 10002",
        phone: "+1 234-567-8901",
        isOpen: true,
        ownerId: "vendor1",
        status: "approved",
    },
    {
        id: "rest2",
        name: "Burger Barn",
        description: "Juicy handcrafted burgers and crispy fries",
        cuisine: "American",
        rating: 4.3,
        reviewCount: 412,
        deliveryTime: "20-30 min",
        priceRange: "$$",
        image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&h=400&fit=crop",
        address: "789 Grill St, NY 10003",
        phone: "+1 234-567-8902",
        isOpen: true,
        ownerId: "vendor2",
        status: "approved",
    },
    {
        id: "rest3",
        name: "Sushi Haven",
        description: "Fresh sushi and Japanese delicacies",
        cuisine: "Japanese",
        rating: 4.9,
        reviewCount: 512,
        deliveryTime: "25-35 min",
        priceRange: "$$$",
        image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=600&h=400&fit=crop",
        address: "321 Tokyo Blvd, NY 10004",
        phone: "+1 234-567-8903",
        isOpen: true,
        ownerId: "vendor1",
        status: "approved",
    },
]

const SEED_PRODUCTS: Product[] = [
    // Spice Garden
    {
        id: "prod1",
        restaurantId: "rest1",
        name: "Butter Chicken",
        description: "Creamy tomato curry with tender chicken",
        price: 15.99,
        category: "Main Course",
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200&h=200&fit=crop",
        isAvailable: true,
        tags: ["Bestseller"],
    },
    {
        id: "prod2",
        restaurantId: "rest1",
        name: "Paneer Tikka",
        description: "Grilled cottage cheese with spices",
        price: 13.99,
        category: "Starters",
        image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200&h=200&fit=crop",
        isAvailable: true,
        tags: ["Vegetarian"],
    },
    {
        id: "prod3",
        restaurantId: "rest1",
        name: "Biryani Bowl",
        description: "Fragrant basmati rice with aromatic spices",
        price: 16.99,
        category: "Main Course",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop",
        isAvailable: true,
        tags: ["Bestseller", "Popular"],
    },
    // Burger Barn
    {
        id: "prod4",
        restaurantId: "rest2",
        name: "Classic Cheeseburger",
        description: "Angus beef patty with melted cheddar",
        price: 12.99,
        category: "Burgers",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop",
        isAvailable: true,
        tags: ["Bestseller"],
    },
    {
        id: "prod5",
        restaurantId: "rest2",
        name: "Loaded Fries",
        description: "Crispy fries with cheese sauce and bacon",
        price: 8.99,
        category: "Sides",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=200&fit=crop",
        isAvailable: true,
        tags: ["Popular"],
    },
    {
        id: "prod6",
        restaurantId: "rest2",
        name: "BBQ Bacon Burger",
        description: "Smoky BBQ sauce with crispy bacon strips",
        price: 14.99,
        category: "Burgers",
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=200&h=200&fit=crop",
        isAvailable: true,
        tags: [],
    },
    // Sushi Haven
    {
        id: "prod7",
        restaurantId: "rest3",
        name: "California Roll",
        description: "Crab, avocado, and cucumber roll",
        price: 14.99,
        category: "Rolls",
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=200&fit=crop",
        isAvailable: true,
        tags: ["Popular"],
    },
    {
        id: "prod8",
        restaurantId: "rest3",
        name: "Salmon Nigiri",
        description: "Fresh salmon over pressed vinegared rice",
        price: 11.99,
        category: "Nigiri",
        image: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=200&h=200&fit=crop",
        isAvailable: true,
        tags: ["Bestseller"],
    },
    {
        id: "prod9",
        restaurantId: "rest3",
        name: "Dragon Roll",
        description: "Eel and cucumber topped with avocado",
        price: 18.99,
        category: "Rolls",
        image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=200&h=200&fit=crop",
        isAvailable: true,
        tags: ["Bestseller", "Popular"],
    },
]

const SEED_ORDERS: Order[] = [
    {
        id: "ORD-1001",
        customerId: "customer1",
        customerName: "John Doe",
        customerPhone: "+1 234-567-8900",
        restaurantId: "rest1",
        restaurantName: "Spice Garden",
        driverId: null,
        driverName: null,
        items: [
            { productId: "prod1", name: "Butter Chicken", price: 15.99, quantity: 1 },
            { productId: "prod3", name: "Biryani Bowl", price: 16.99, quantity: 1 },
        ],
        status: "preparing",
        total: 32.98,
        deliveryAddress: "123 Main St, Apt 4B, New York, NY 10001",
        paymentMethod: "Visa ending in 4242",
        createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
    },
    {
        id: "ORD-1002",
        customerId: "customer1",
        customerName: "John Doe",
        customerPhone: "+1 234-567-8900",
        restaurantId: "rest3",
        restaurantName: "Sushi Haven",
        driverId: "driver1",
        driverName: "Mike Johnson",
        items: [
            { productId: "prod7", name: "California Roll", price: 14.99, quantity: 2 },
            { productId: "prod8", name: "Salmon Nigiri", price: 11.99, quantity: 1 },
        ],
        status: "picked",
        total: 41.97,
        deliveryAddress: "123 Main St, Apt 4B, New York, NY 10001",
        paymentMethod: "Visa ending in 4242",
        createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    },
]

const SEED_PENDING_VENDORS: PendingVendor[] = [
    {
        id: "pv1",
        name: "Taco Fiesta",
        email: "info@tacofiesta.com",
        cuisine: "Mexican",
        phone: "+1 234-567-9000",
        address: "555 Taco Way, NY 10005",
        submittedDate: "2024-01-15",
        status: "pending",
    },
    {
        id: "pv2",
        name: "Green Bowl",
        email: "hello@greenbowl.com",
        cuisine: "Healthy",
        phone: "+1 234-567-9001",
        address: "666 Salad Ave, NY 10006",
        submittedDate: "2024-01-14",
        status: "pending",
    },
]

const SEED_SETTINGS: PlatformSettings = {
    commissionRate: 15,
    deliveryFeeMin: 1.99,
    deliveryFeeMax: 4.99,
    supportEmail: "support@foodhub.com",
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getItem<T>(key: string): T | null {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
}

function setItem<T>(key: string, value: T): void {
    if (typeof window === "undefined") return
    localStorage.setItem(key, JSON.stringify(value))
}

// ─── Initialization ──────────────────────────────────────────────────────────

export function initializeStore(): void {
    if (typeof window === "undefined") return
    const already = localStorage.getItem(KEYS.initialized)
    if (already) return

    setItem(KEYS.restaurants, SEED_RESTAURANTS)
    setItem(KEYS.products, SEED_PRODUCTS)
    setItem(KEYS.orders, SEED_ORDERS)
    setItem(KEYS.cart, [] as CartItem[])
    setItem(KEYS.pendingVendors, SEED_PENDING_VENDORS)
    setItem(KEYS.settings, SEED_SETTINGS)
    setItem(KEYS.notifications, [] as Notification[])
    localStorage.setItem(KEYS.initialized, "true")
}

// ─── Restaurants ─────────────────────────────────────────────────────────────

export function getRestaurants(): Restaurant[] {
    return getItem<Restaurant[]>(KEYS.restaurants) ?? []
}

export function getRestaurantById(id: string): Restaurant | undefined {
    return getRestaurants().find((r) => r.id === id)
}

export function getRestaurantsByOwner(ownerId: string): Restaurant[] {
    return getRestaurants().filter((r) => r.ownerId === ownerId)
}

export function updateRestaurant(id: string, updates: Partial<Restaurant>): void {
    const list = getRestaurants().map((r) => (r.id === id ? { ...r, ...updates } : r))
    setItem(KEYS.restaurants, list)
}

// ─── Products ────────────────────────────────────────────────────────────────

export function getProducts(): Product[] {
    return getItem<Product[]>(KEYS.products) ?? []
}

export function getProductsByRestaurant(restaurantId: string): Product[] {
    return getProducts().filter((p) => p.restaurantId === restaurantId)
}

export function addProduct(product: Product): void {
    const list = getProducts()
    list.push(product)
    setItem(KEYS.products, list)
}

export function updateProduct(id: string, updates: Partial<Product>): void {
    const list = getProducts().map((p) => (p.id === id ? { ...p, ...updates } : p))
    setItem(KEYS.products, list)
}

export function deleteProduct(id: string): void {
    const list = getProducts().filter((p) => p.id !== id)
    setItem(KEYS.products, list)
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export function getCart(): CartItem[] {
    return getItem<CartItem[]>(KEYS.cart) ?? []
}

export function addToCart(item: CartItem): void {
    const cart = getCart()
    const existing = cart.find((c) => c.productId === item.productId)
    if (existing) {
        existing.quantity += item.quantity
    } else {
        cart.push(item)
    }
    setItem(KEYS.cart, cart)
}

export function updateCartItemQuantity(productId: string, quantity: number): void {
    let cart = getCart()
    if (quantity <= 0) {
        cart = cart.filter((c) => c.productId !== productId)
    } else {
        cart = cart.map((c) => (c.productId === productId ? { ...c, quantity } : c))
    }
    setItem(KEYS.cart, cart)
}

export function removeFromCart(productId: string): void {
    const cart = getCart().filter((c) => c.productId !== productId)
    setItem(KEYS.cart, cart)
}

export function clearCart(): void {
    setItem(KEYS.cart, [])
}

export function getCartTotal(): number {
    return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0)
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export function getOrders(): Order[] {
    return getItem<Order[]>(KEYS.orders) ?? []
}

export function getOrdersByCustomer(customerId: string): Order[] {
    return getOrders().filter((o) => o.customerId === customerId)
}

export function getOrdersByRestaurant(restaurantId: string): Order[] {
    return getOrders().filter((o) => o.restaurantId === restaurantId)
}

export function getOrdersByDriver(driverId: string): Order[] {
    return getOrders().filter((o) => o.driverId === driverId)
}

export function getAvailableOrdersForDriver(): Order[] {
    return getOrders().filter((o) => o.status === "ready" && !o.driverId)
}

export function getActiveOrdersForDriver(driverId: string): Order[] {
    return getOrders().filter(
        (o) => o.driverId === driverId && (o.status === "picked")
    )
}

export function addOrder(order: Order): void {
    const list = getOrders()
    list.push(order)
    setItem(KEYS.orders, list)
}

export function updateOrderStatus(orderId: string, status: OrderStatus, extras?: Partial<Order>): void {
    const list = getOrders().map((o) =>
        o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString(), ...extras } : o
    )
    setItem(KEYS.orders, list)
}

// ─── Pending Vendors ─────────────────────────────────────────────────────────

export function getPendingVendors(): PendingVendor[] {
    return getItem<PendingVendor[]>(KEYS.pendingVendors) ?? []
}

export function approveVendor(vendorId: string): void {
    const list = getPendingVendors().map((v) =>
        v.id === vendorId ? { ...v, status: "approved" as const } : v
    )
    setItem(KEYS.pendingVendors, list)
}

export function rejectVendor(vendorId: string): void {
    const list = getPendingVendors().map((v) =>
        v.id === vendorId ? { ...v, status: "rejected" as const } : v
    )
    setItem(KEYS.pendingVendors, list)
}

// ─── Platform Settings ───────────────────────────────────────────────────────

export function getSettings(): PlatformSettings {
    return getItem<PlatformSettings>(KEYS.settings) ?? SEED_SETTINGS
}

export function updateSettings(updates: Partial<PlatformSettings>): void {
    const current = getSettings()
    setItem(KEYS.settings, { ...current, ...updates })
}

// ─── Notifications ───────────────────────────────────────────────────────────

export function getNotifications(userId: string): Notification[] {
    const all = getItem<Notification[]>(KEYS.notifications) ?? []
    return all.filter((n) => n.userId === userId)
}

export function addNotification(notification: Notification): void {
    const list = getItem<Notification[]>(KEYS.notifications) ?? []
    list.push(notification)
    setItem(KEYS.notifications, list)
}

// ─── Utility ─────────────────────────────────────────────────────────────────

export function generateId(prefix: string = "id"): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
}

export function generateOrderId(): string {
    const orders = getOrders()
    const num = 1001 + orders.length
    return `ORD-${num}`
}

// ─── Reset (for development) ─────────────────────────────────────────────────

export function resetStore(): void {
    if (typeof window === "undefined") return
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key))
    initializeStore()
}
