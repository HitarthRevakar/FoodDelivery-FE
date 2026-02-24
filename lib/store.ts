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
    isVeg: boolean
    tags: string[]
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
    initialized: "fd_initialized_v5", // bumped to force re-seed with expanded Indian menu
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

const SEED_RESTAURANTS: Restaurant[] = [
    {
        id: "rest1",
        name: "Punjabi Rasoi",
        description: "Authentic North Indian curries, tandoor & rich gravies",
        cuisine: "North Indian",
        rating: 4.7,
        reviewCount: 512,
        deliveryTime: "30-40 min",
        priceRange: "₹₹",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop",
        address: "12 Ashram Road, Ahmedabad, GJ 380009",
        phone: "+91 99001 23456",
        isOpen: true,
        ownerId: "vendor1",
        status: "approved",
    },
    {
        id: "rest2",
        name: "Gujarati Thali House",
        description: "Traditional Gujarati unlimited thali with rotla, dal, shaak & more",
        cuisine: "Gujarati",
        rating: 4.8,
        reviewCount: 743,
        deliveryTime: "25-35 min",
        priceRange: "₹₹",
        image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&h=400&fit=crop",
        address: "Manek Chowk, Ahmedabad, GJ 380001",
        phone: "+91 98242 56789",
        isOpen: true,
        ownerId: "vendor2",
        status: "approved",
    },
    {
        id: "rest3",
        name: "Saurashtra Snacks Corner",
        description: "Crispy farsan, khakhra, fafda, jalebi & Gujarati street snacks",
        cuisine: "Gujarati Snacks",
        rating: 4.6,
        reviewCount: 389,
        deliveryTime: "20-30 min",
        priceRange: "₹",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop",
        address: "Law Garden, Ahmedabad, GJ 380006",
        phone: "+91 97234 11223",
        isOpen: true,
        ownerId: "vendor3",
        status: "approved",
    },
    {
        id: "rest4",
        name: "South Express",
        description: "Crispy dosas, fluffy idlis, vadas & Chettinad specials",
        cuisine: "South Indian",
        rating: 4.5,
        reviewCount: 298,
        deliveryTime: "30-40 min",
        priceRange: "₹₹",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop",
        address: "CG Road, Ahmedabad, GJ 380006",
        phone: "+91 96648 77889",
        isOpen: true,
        ownerId: "vendor4",
        status: "approved",
    },
    {
        id: "rest5",
        name: "Dragon Wok",
        description: "Indo-Chinese fusion – Manchurian, fried rice, noodles & more",
        cuisine: "Chinese",
        rating: 4.4,
        reviewCount: 421,
        deliveryTime: "25-35 min",
        priceRange: "₹₹",
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&h=400&fit=crop",
        address: "SG Highway, Ahmedabad, GJ 380054",
        phone: "+91 90161 33445",
        isOpen: true,
        ownerId: "vendor5",
        status: "approved",
    },
    {
        id: "rest6",
        name: "Chill Zone Beverages",
        description: "Refreshing lassi, chaas, shakes, fresh juices & mojitos",
        cuisine: "Beverages",
        rating: 4.3,
        reviewCount: 215,
        deliveryTime: "15-20 min",
        priceRange: "₹",
        image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&h=400&fit=crop",
        address: "Vastrapur Lake, Ahmedabad, GJ 380015",
        phone: "+91 91580 22334",
        isOpen: true,
        ownerId: "vendor6",
        status: "approved",
    },
    {
        id: "rest7",
        name: "Frosty Scoops",
        description: "Artisanal kesar pista ice cream, kulfi, sundaes & faloodas",
        cuisine: "Ice Cream",
        rating: 4.9,
        reviewCount: 634,
        deliveryTime: "20-30 min",
        priceRange: "₹₹",
        image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&h=400&fit=crop",
        address: "Prahlad Nagar, Ahmedabad, GJ 380015",
        phone: "+91 88491 55667",
        isOpen: true,
        ownerId: "vendor7",
        status: "approved",
    },
    {
        id: "rest8",
        name: "Mughal Darbar",
        description: "Royal Mughlai biryani, kebabs & rich kormas",
        cuisine: "North Indian",
        rating: 4.6,
        reviewCount: 476,
        deliveryTime: "35-45 min",
        priceRange: "₹₹₹",
        image: "https://images.unsplash.com/photo-1633945274417-84d707efd372?w=600&h=400&fit=crop",
        address: "Bose Road, Surat, GJ 395001",
        phone: "+91 87230 99001",
        isOpen: true,
        ownerId: "vendor8",
        status: "approved",
    },
    {
        id: "rest9",
        name: "Mumbai Street Bites",
        description: "Pav bhaji, vada pav, bhel puri & Mumbai street food classics",
        cuisine: "Street Food",
        rating: 4.5,
        reviewCount: 568,
        deliveryTime: "20-30 min",
        priceRange: "₹",
        image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&h=400&fit=crop",
        address: "Kalupur, Ahmedabad, GJ 380001",
        phone: "+91 99785 12345",
        isOpen: true,
        ownerId: "vendor9",
        status: "approved",
    },
    {
        id: "rest10",
        name: "Kerala Sadhya",
        description: "Authentic Kerala banana-leaf sadhya, appam, fish curry & seafood",
        cuisine: "South Indian",
        rating: 4.7,
        reviewCount: 332,
        deliveryTime: "35-45 min",
        priceRange: "₹₹",
        image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&h=400&fit=crop",
        address: "Navrangpura, Ahmedabad, GJ 380009",
        phone: "+91 97111 44556",
        isOpen: true,
        ownerId: "vendor10",
        status: "approved",
    },
    {
        id: "rest11",
        name: "Rajwada Rasoi",
        description: "Royal Rajasthani dal bati churma, laal maas & gatte ki sabzi",
        cuisine: "Rajasthani",
        rating: 4.6,
        reviewCount: 289,
        deliveryTime: "30-40 min",
        priceRange: "₹₹",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop",
        address: "Satellite, Ahmedabad, GJ 380015",
        phone: "+91 93271 88900",
        isOpen: true,
        ownerId: "vendor11",
        status: "approved",
    },
    {
        id: "rest12",
        name: "Punjabi Dhaba 47",
        description: "Highway-style Punjabi dhaba – sarson da saag, makki roti & lassi",
        cuisine: "North Indian",
        rating: 4.4,
        reviewCount: 412,
        deliveryTime: "25-35 min",
        priceRange: "₹₹",
        image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=400&fit=crop",
        address: "Thaltej, Ahmedabad, GJ 380054",
        phone: "+91 88001 56789",
        isOpen: true,
        ownerId: "vendor12",
        status: "approved",
    },
    {
        id: "rest13",
        name: "Wok N Roll",
        description: "Pan-Asian delights – dim sum, ramen, Thai curry & Indo-Chinese fusion",
        cuisine: "Chinese",
        rating: 4.3,
        reviewCount: 244,
        deliveryTime: "30-40 min",
        priceRange: "₹₹",
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&h=400&fit=crop",
        address: "Bodakdev, Ahmedabad, GJ 380054",
        phone: "+91 90100 34567",
        isOpen: true,
        ownerId: "vendor13",
        status: "approved",
    },
    {
        id: "rest14",
        name: "Mithaiwala Sweet House",
        description: "Traditional Indian sweets, halwa, gulab jamun & festive mithai",
        cuisine: "Sweets & Desserts",
        rating: 4.8,
        reviewCount: 527,
        deliveryTime: "20-30 min",
        priceRange: "₹₹",
        image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&h=400&fit=crop",
        address: "Manek Chowk, Ahmedabad, GJ 380001",
        phone: "+91 99009 77665",
        isOpen: true,
        ownerId: "vendor14",
        status: "approved",
    },
]

const SEED_PRODUCTS: Product[] = [
    // ─── Punjabi Rasoi (rest1) ────────────────────────────────────
    { id: "p1_1", restaurantId: "rest1", name: "Butter Chicken", description: "Tender chicken in creamy tomato-butter gravy", price: 220, category: "Main Course", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Bestseller"] },
    { id: "p1_2", restaurantId: "rest1", name: "Dal Makhani", description: "Slow-cooked black dal with cream & butter", price: 160, category: "Main Course", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p1_3", restaurantId: "rest1", name: "Paneer Butter Masala", description: "Soft paneer in rich butter masala gravy", price: 190, category: "Main Course", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Bestseller"] },
    { id: "p1_4", restaurantId: "rest1", name: "Chicken Biryani", description: "Fragrant basmati rice with spiced chicken", price: 260, category: "Rice", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Bestseller", "Popular"] },
    { id: "p1_5", restaurantId: "rest1", name: "Tandoori Roti", description: "Soft wheat flatbread from the tandoor", price: 30, category: "Breads", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p1_6", restaurantId: "rest1", name: "Lassi (Sweet)", description: "Thick chilled yoghurt drink", price: 60, category: "Drinks", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p1_7", restaurantId: "rest1", name: "Chicken Tikka", description: "Marinated chicken pieces grilled in tandoor", price: 240, category: "Starters", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Popular"] },
    { id: "p1_8", restaurantId: "rest1", name: "Aloo Paratha", description: "Whole wheat flatbread stuffed with spiced potato", price: 80, category: "Breads", image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },

    // ─── Gujarati Thali House (rest2) ─────────────────────────────
    { id: "p2_1", restaurantId: "rest2", name: "Full Gujarati Thali", description: "Dal, kadhi, 4 sabzi, roti, rice, papad & chaas", price: 180, category: "Thali", image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Bestseller", "Vegetarian"] },
    { id: "p2_2", restaurantId: "rest2", name: "Undhiyu", description: "Mixed winter vegetables slow-cooked with spices", price: 140, category: "Main Course", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Seasonal"] },
    { id: "p2_3", restaurantId: "rest2", name: "Kadhi Khichdi", description: "Yellow moong khichdi with tangy kadhi", price: 120, category: "Rice", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Comfort Food"] },
    { id: "p2_4", restaurantId: "rest2", name: "Aam Ras", description: "Sweet Kesar mango pulp served with puri", price: 90, category: "Desserts", image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p2_5", restaurantId: "rest2", name: "Puri Bhaji", description: "Crispy puri with spiced potato sabzi", price: 70, category: "Breakfast", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p2_6", restaurantId: "rest2", name: "Chaas (Buttermilk)", description: "Spiced cool buttermilk", price: 30, category: "Drinks", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p2_7", restaurantId: "rest2", name: "Mohanthal", description: "Besan-based sweet fudge with dry fruits", price: 80, category: "Desserts", image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },

    // ─── Saurashtra Snacks Corner (rest3) ─────────────────────────
    { id: "p3_1", restaurantId: "rest3", name: "Fafda Jalebi", description: "Crispy fafda with sweet jalebi – classic Guju combo", price: 60, category: "Snacks", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Bestseller", "Vegetarian"] },
    { id: "p3_2", restaurantId: "rest3", name: "Dhokla", description: "Steamed soft besan dhokla with mustard tempering", price: 50, category: "Snacks", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p3_3", restaurantId: "rest3", name: "Khakhra (Plain)", description: "Crispy thin wheat cracker – 5 pcs", price: 40, category: "Snacks", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p3_4", restaurantId: "rest3", name: "Sev Mamra", description: "Puffed rice with sev, chutney and spices", price: 45, category: "Snacks", image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p3_5", restaurantId: "rest3", name: "Dabeli", description: "Spiced potato in bun with chutneys & peanuts", price: 35, category: "Snacks", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Bestseller", "Vegetarian"] },
    { id: "p3_6", restaurantId: "rest3", name: "Khandvi", description: "Rolled besan & buttermilk delicacy with coconut", price: 55, category: "Snacks", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p3_7", restaurantId: "rest3", name: "Gathiya", description: "Thick crispy chickpea flour snack", price: 50, category: "Snacks", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p3_8", restaurantId: "rest3", name: "Sukhdi", description: "Wholesome wheat flour & jaggery sweet cake", price: 60, category: "Sweets", image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },

    // ─── South Express (rest4) ─────────────────────────────────────
    { id: "p4_1", restaurantId: "rest4", name: "Masala Dosa", description: "Crispy rice crepe with spiced potato filling", price: 100, category: "Dosa", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Bestseller", "Vegetarian"] },
    { id: "p4_2", restaurantId: "rest4", name: "Idli Sambar (4 pcs)", description: "Steamed soft idlis with sambar & chutneys", price: 80, category: "Breakfast", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p4_3", restaurantId: "rest4", name: "Medu Vada (2 pcs)", description: "Crispy lentil fritters with sambar", price: 70, category: "Breakfast", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p4_4", restaurantId: "rest4", name: "Rava Dosa", description: "Thin crispy semolina crepe", price: 110, category: "Dosa", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p4_5", restaurantId: "rest4", name: "Chicken Chettinad", description: "Spicy Chettinad-style chicken curry", price: 220, category: "Main Course", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Spicy", "Popular"] },
    { id: "p4_6", restaurantId: "rest4", name: "Coconut Chutney", description: "Fresh ground coconut & green chilli chutney", price: 30, category: "Sides", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p4_7", restaurantId: "rest4", name: "Filter Coffee", description: "Strong South Indian drip coffee with frothy milk", price: 50, category: "Drinks", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },

    // ─── Dragon Wok (rest5) ────────────────────────────────────────
    { id: "p5_1", restaurantId: "rest5", name: "Veg Hakka Noodles", description: "Stir-fried noodles with vegetables", price: 140, category: "Noodles", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p5_2", restaurantId: "rest5", name: "Chicken Fried Rice", description: "Wok-tossed rice with chicken & eggs", price: 170, category: "Rice", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Bestseller"] },
    { id: "p5_3", restaurantId: "rest5", name: "Gobi Manchurian (Dry)", description: "Crispy cauliflower in Indo-Chinese sauce", price: 130, category: "Starters", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Bestseller"] },
    { id: "p5_4", restaurantId: "rest5", name: "Chicken Manchurian", description: "Juicy chicken balls in sweet & spicy sauce", price: 200, category: "Starters", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Popular"] },
    { id: "p5_5", restaurantId: "rest5", name: "Spring Rolls (6 pcs)", description: "Crispy rolls stuffed with vegetables", price: 110, category: "Starters", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p5_6", restaurantId: "rest5", name: "Schezwan Paneer", description: "Spicy schezwan sauce tossed with paneer", price: 180, category: "Main Course", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Spicy"] },
    { id: "p5_7", restaurantId: "rest5", name: "Hot & Sour Soup", description: "Tangy & spicy vegetable soup", price: 90, category: "Soups", image: "https://images.unsplash.com/photo-1605300647680-dc9d1aebfef7?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },

    // ─── Chill Zone Beverages (rest6) ─────────────────────────────
    { id: "p6_1", restaurantId: "rest6", name: "Mango Lassi", description: "Thick Kesar mango blended with yoghurt", price: 80, category: "Lassi", image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Bestseller", "Vegetarian"] },
    { id: "p6_2", restaurantId: "rest6", name: "Masala Chaas", description: "Spiced salted buttermilk with roasted cumin", price: 40, category: "Chaas", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p6_3", restaurantId: "rest6", name: "Virgin Mojito", description: "Mint-lemon fizzy refresher", price: 90, category: "Mocktails", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p6_4", restaurantId: "rest6", name: "Sugarcane Juice", description: "Fresh pressed ganne ka ras", price: 50, category: "Fresh Juice", image: "https://images.unsplash.com/photo-1587545329052-68e1eb4831e9?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p6_5", restaurantId: "rest6", name: "Rose Sharbat", description: "Chilled rose syrup drink with sabja seeds", price: 60, category: "Sharbat", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p6_6", restaurantId: "rest6", name: "Oreo Shake", description: "Thick Oreo biscuit blended milkshake", price: 120, category: "Shakes", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p6_7", restaurantId: "rest6", name: "Cold Coffee", description: "Chilled strong coffee blended with milk & ice cream", price: 100, category: "Coffee", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },

    // ─── Frosty Scoops (rest7) ────────────────────────────────────
    { id: "p7_1", restaurantId: "rest7", name: "Kesar Pista Ice Cream", description: "Rich saffron & pistachio Indian ice cream", price: 90, category: "Ice Cream", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Bestseller", "Vegetarian"] },
    { id: "p7_2", restaurantId: "rest7", name: "Kulfi (Malai)", description: "Creamy frozen milk dessert on stick", price: 60, category: "Kulfi", image: "https://images.unsplash.com/photo-1557142046-c704a3adf364?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p7_3", restaurantId: "rest7", name: "Falooda", description: "Rose milk with vermicelli, sabja & ice cream", price: 120, category: "Falooda", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Bestseller"] },
    { id: "p7_4", restaurantId: "rest7", name: "Sundae (Chocolate)", description: "Two scoops of chocolate ice cream with hot fudge", price: 130, category: "Sundae", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p7_5", restaurantId: "rest7", name: "Mango Sorbet", description: "Dairy-free Alphonso mango sorbet", price: 80, category: "Sorbet", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p7_6", restaurantId: "rest7", name: "Ice Cream Sandwich", description: "Cookie sandwich with vanilla ice cream filling", price: 70, category: "Ice Cream", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },

    // ─── Mughal Darbar (rest8) ─────────────────────────────────────
    { id: "p8_1", restaurantId: "rest8", name: "Mutton Biryani", description: "Slow-cooked dum biryani with tender mutton", price: 350, category: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Bestseller", "Popular"] },
    { id: "p8_2", restaurantId: "rest8", name: "Seekh Kebab (4 pcs)", description: "Minced lamb kebabs grilled to perfection", price: 280, category: "Starters", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Popular"] },
    { id: "p8_3", restaurantId: "rest8", name: "Paneer Lababdar", description: "Paneer cubes in spiced onion-tomato gravy", price: 220, category: "Main Course", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p8_4", restaurantId: "rest8", name: "Rogan Josh", description: "Kashmiri lamb curry with whole spices", price: 320, category: "Main Course", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Bestseller"] },
    { id: "p8_5", restaurantId: "rest8", name: "Garlic Naan", description: "Soft tandoor naan with garlic & butter", price: 50, category: "Breads", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p8_6", restaurantId: "rest8", name: "Shahi Tukda", description: "Bread pudding with rabri & dry fruits", price: 130, category: "Desserts", image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Bestseller"] },
    { id: "p8_7", restaurantId: "rest8", name: "Chicken Korma", description: "Mild & creamy chicken in cashew gravy", price: 270, category: "Main Course", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Popular"] },
    { id: "p8_8", restaurantId: "rest8", name: "Chicken Biryani (Mughlai)", description: "Aromatic dum biryani with whole spices & saffron", price: 290, category: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Popular"] },
    { id: "p8_9", restaurantId: "rest8", name: "Peshwari Naan", description: "Stuffed naan with coconut & almond filling", price: 70, category: "Breads", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p8_10", restaurantId: "rest8", name: "Murgh Musallam", description: "Whole chicken slow-cooked in spiced Mughlai gravy", price: 520, category: "Main Course", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Special"] },

    // ─── also expand rest1 (Punjabi Rasoi) ───────────────────────
    { id: "p1_9", restaurantId: "rest1", name: "Chole Bhature", description: "Spiced chickpea curry with fluffy bhature", price: 120, category: "Main Course", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Bestseller"] },
    { id: "p1_10", restaurantId: "rest1", name: "Sarson da Saag", description: "Mustard greens cooked with spices, served with makki roti", price: 160, category: "Main Course", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Seasonal"] },
    { id: "p1_11", restaurantId: "rest1", name: "Mutton Rogan Josh", description: "Tender mutton in aromatic Kashmiri sauce", price: 340, category: "Main Course", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Popular"] },
    { id: "p1_12", restaurantId: "rest1", name: "Palak Paneer", description: "Fresh spinach gravy with soft paneer cubes", price: 180, category: "Main Course", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p1_13", restaurantId: "rest1", name: "Paneer Tikka", description: "Marinated paneer grilled in tandoor", price: 210, category: "Starters", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Bestseller"] },
    { id: "p1_14", restaurantId: "rest1", name: "Fish Amritsari", description: "Crispy spiced fish fillet in besan batter", price: 280, category: "Starters", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Popular", "Spicy"] },

    // ─── also expand rest2 (Gujarati Thali House) ─────────────────
    { id: "p2_8", restaurantId: "rest2", name: "Sev Tameta Nu Shaak", description: "Tomato curry topped with crispy sev", price: 80, category: "Main Course", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p2_9", restaurantId: "rest2", name: "Rotla (Bajra)", description: "Pearl millet flatbread with ghee", price: 40, category: "Breads", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p2_10", restaurantId: "rest2", name: "Lapsi", description: "Broken wheat cooked in jaggery & ghee", price: 70, category: "Desserts", image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Sweet"] },
    { id: "p2_11", restaurantId: "rest2", name: "Ringan Na Odo", description: "Smoky roasted brinjal bharta Gujarati style", price: 95, category: "Main Course", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p2_12", restaurantId: "rest2", name: "Gulab Jamun (2 pcs)", description: "Soft milk-solid dumplings in rose sugar syrup", price: 60, category: "Desserts", image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },

    // ─── also expand rest3 (Saurashtra Snacks Corner) ─────────────
    { id: "p3_9", restaurantId: "rest3", name: "Bhajiya (Pakoda)", description: "Crispy besan-fried onion & potato fritters", price: 50, category: "Snacks", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p3_10", restaurantId: "rest3", name: "Methi Thepla", description: "Fenugreek spiced thin flatbread – 3 pcs with achaar", price: 60, category: "Snacks", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p3_11", restaurantId: "rest3", name: "Chakli", description: "Spiral crispy fried snack made of rice flour", price: 45, category: "Snacks", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p3_12", restaurantId: "rest3", name: "Tawa Sandwich", description: "Butter grilled sandwich with chutneys & veggies", price: 70, category: "Snacks", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p3_13", restaurantId: "rest3", name: "Patra", description: "Colocasia leaves stuffed with tangy besan & steamed", price: 65, category: "Snacks", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },

    // ─── also expand rest4 (South Express) ────────────────────────
    { id: "p4_8", restaurantId: "rest4", name: "Pesarattu", description: "Green moong dosa with ginger-onion filling", price: 90, category: "Dosa", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p4_9", restaurantId: "rest4", name: "Uttapam", description: "Thick rice pancake with tomato, onion & chilli topping", price: 95, category: "Breakfast", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p4_10", restaurantId: "rest4", name: "Bisi Bele Bhat", description: "Karnataka-style lentil rice with vegetables & ghee", price: 130, category: "Rice", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p4_11", restaurantId: "rest4", name: "Prawn Masala", description: "Juicy prawns in spicy coastal gravy", price: 310, category: "Main Course", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Popular", "Seafood"] },
    { id: "p4_12", restaurantId: "rest4", name: "Curd Rice", description: "Cooling rice mixed with fresh yoghurt & tarka", price: 80, category: "Rice", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p4_13", restaurantId: "rest4", name: "Rasam", description: "Tangy peppery tomato soup", price: 40, category: "Soups", image: "https://images.unsplash.com/photo-1605300647680-dc9d1aebfef7?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },

    // ─── also expand rest5 (Dragon Wok) ───────────────────────────
    { id: "p5_8", restaurantId: "rest5", name: "Paneer Fried Rice", description: "Wok-tossed rice with paneer & vegetables", price: 160, category: "Rice", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p5_9", restaurantId: "rest5", name: "Chicken Noodles", description: "Pan-tossed egg noodles with chicken strips", price: 180, category: "Noodles", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Popular"] },
    { id: "p5_10", restaurantId: "rest5", name: "Mushroom Manchurian", description: "Crispy mushrooms tossed in sweet-spicy Indo-Chinese sauce", price: 150, category: "Starters", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p5_11", restaurantId: "rest5", name: "Sweet Corn Soup", description: "Creamy corn soup with vegetable bits", price: 80, category: "Soups", image: "https://images.unsplash.com/photo-1605300647680-dc9d1aebfef7?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p5_12", restaurantId: "rest5", name: "Crispy Chilli Potato", description: "Twice-fried potatoes tossed in garlic chilli sauce", price: 120, category: "Starters", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Bestseller"] },

    // ─── also expand rest6 (Chill Zone Beverages) ─────────────────
    { id: "p6_8", restaurantId: "rest6", name: "Pineapple Juice (Fresh)", description: "Chilled fresh pineapple juice", price: 70, category: "Fresh Juice", image: "https://images.unsplash.com/photo-1587545329052-68e1eb4831e9?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p6_9", restaurantId: "rest6", name: "Kachi Keri Panha", description: "Raw mango summer cooler with cumin & jaggery", price: 55, category: "Sharbat", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Seasonal"] },
    { id: "p6_10", restaurantId: "rest6", name: "Thandai", description: "Chilled milk with rose, saffron, and Holi spice mix", price: 90, category: "Shakes", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Festive"] },
    { id: "p6_11", restaurantId: "rest6", name: "Banana Shake", description: "Thick chilled banana milkshake", price: 80, category: "Shakes", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },

    // ─── also expand rest7 (Frosty Scoops) ───────────────────────
    { id: "p7_7", restaurantId: "rest7", name: "Sitafal Ice Cream", description: "Creamy custard apple ice cream", price: 100, category: "Ice Cream", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Seasonal"] },
    { id: "p7_8", restaurantId: "rest7", name: "Choco Lava Cup", description: "Warm chocolate lava cake with ice cream scoop", price: 150, category: "Sundae", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p7_9", restaurantId: "rest7", name: "Rabri Faluda", description: "Dense reduced milk faluda with vermicelli & sabja", price: 140, category: "Falooda", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Bestseller"] },
    { id: "p7_10", restaurantId: "rest7", name: "Anjeer Roll Kulfi", description: "Fig & pistachio stuffed frozen kulfi roll", price: 110, category: "Kulfi", image: "https://images.unsplash.com/photo-1557142046-c704a3adf364?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Premium"] },

    // ─── Mumbai Street Bites (rest9) ──────────────────────────────
    { id: "p9_1", restaurantId: "rest9", name: "Pav Bhaji", description: "Spiced mashed vegetable curry with buttery pav", price: 90, category: "Main Course", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Bestseller", "Vegetarian"] },
    { id: "p9_2", restaurantId: "rest9", name: "Vada Pav", description: "Mumbai's iconic potato-fritter burger", price: 30, category: "Snacks", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Bestseller", "Vegetarian"] },
    { id: "p9_3", restaurantId: "rest9", name: "Bhel Puri", description: "Puffed rice, sev & tangy chutneys tossed together", price: 40, category: "Snacks", image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p9_4", restaurantId: "rest9", name: "Sev Puri", description: "Crispy puris topped with potatoes, chutneys & sev", price: 45, category: "Snacks", image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p9_5", restaurantId: "rest9", name: "Ragda Pattice", description: "Potato patties with white pea ragda & chutneys", price: 70, category: "Snacks", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p9_6", restaurantId: "rest9", name: "Bombay Sandwich", description: "Grilled sandwich with beetroot, tomato & green chutney", price: 60, category: "Snacks", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p9_7", restaurantId: "rest9", name: "Misal Pav", description: "Spicy moth bean curry served with pav", price: 80, category: "Main Course", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Spicy"] },
    { id: "p9_8", restaurantId: "rest9", name: "Chicken Keema Pav", description: "Minced chicken keema bhaji with pav", price: 130, category: "Main Course", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Popular"] },
    { id: "p9_9", restaurantId: "rest9", name: "Pani Puri (8 pcs)", description: "Crispy puris with spicy mint-tamarind water", price: 50, category: "Snacks", image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Bestseller"] },
    { id: "p9_10", restaurantId: "rest9", name: "Fresh Lime Soda", description: "Salted or sweet fresh lime carbonated drink", price: 40, category: "Drinks", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },

    // ─── Kerala Sadhya (rest10) ────────────────────────────────────
    { id: "p10_1", restaurantId: "rest10", name: "Appam with Stew", description: "Lacy rice hoppers with coconut milk vegetable stew", price: 120, category: "Breakfast", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p10_2", restaurantId: "rest10", name: "Kerala Fish Curry", description: "Red snapper in tangy coconut-tamarind gravy", price: 280, category: "Main Course", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Bestseller", "Seafood"] },
    { id: "p10_3", restaurantId: "rest10", name: "Sadhya Thali", description: "Banana leaf spread – rice, 12 curries, payasam", price: 220, category: "Thali", image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Bestseller"] },
    { id: "p10_4", restaurantId: "rest10", name: "Chicken Roast (Kerala)", description: "Slow-cooked spicy Kerala style chicken roast", price: 270, category: "Main Course", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Popular", "Spicy"] },
    { id: "p10_5", restaurantId: "rest10", name: "Puttu & Kadala Curry", description: "Steamed rice cylinders with black chickpea curry", price: 100, category: "Breakfast", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p10_6", restaurantId: "rest10", name: "Payasam", description: "Rice & coconut milk sweet pudding", price: 80, category: "Desserts", image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p10_7", restaurantId: "rest10", name: "Prawn Biryani (Kerala)", description: "Fragrant Malabar prawn biryani with raita", price: 320, category: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Bestseller", "Seafood"] },
    { id: "p10_8", restaurantId: "rest10", name: "Coconut Water", description: "Fresh natural tender coconut water", price: 50, category: "Drinks", image: "https://images.unsplash.com/photo-1587545329052-68e1eb4831e9?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },

    // ─── Rajwada Rasoi (rest11) ────────────────────────────────────
    { id: "p11_1", restaurantId: "rest11", name: "Dal Bati Churma", description: "Baked whole-wheat dumplings with spicy dal & churma", price: 180, category: "Main Course", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Bestseller", "Vegetarian"] },
    { id: "p11_2", restaurantId: "rest11", name: "Laal Maas", description: "Fiery Rajasthani red mutton curry", price: 340, category: "Main Course", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Bestseller", "Spicy"] },
    { id: "p11_3", restaurantId: "rest11", name: "Gatte Ki Sabzi", description: "Besan dumplings in tangy yoghurt curry", price: 130, category: "Main Course", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p11_4", restaurantId: "rest11", name: "Ker Sangri", description: "Wild desert berries & beans stir-fry", price: 150, category: "Main Course", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Special"] },
    { id: "p11_5", restaurantId: "rest11", name: "Rajasthani Thali", description: "Full Rajasthani spread – dal, sabzi, roti, baati, churma", price: 220, category: "Thali", image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Bestseller"] },
    { id: "p11_6", restaurantId: "rest11", name: "Chicken Safed Maas", description: "White gravy chicken cooked in yoghurt & poppy seed", price: 290, category: "Main Course", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Popular"] },
    { id: "p11_7", restaurantId: "rest11", name: "Mawa Kachori", description: "Deep-fried pastry filled with sweetened mawa", price: 60, category: "Sweets", image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Sweet"] },
    { id: "p11_8", restaurantId: "rest11", name: "Jaljeera", description: "Chilled spiced cumin cooler", price: 35, category: "Drinks", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },

    // ─── Punjabi Dhaba 47 (rest12) ─────────────────────────────────
    { id: "p12_1", restaurantId: "rest12", name: "Makki di Roti & Sarson", description: "Corn flour roti with mustard greens & white butter", price: 120, category: "Main Course", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Bestseller", "Vegetarian", "Seasonal"] },
    { id: "p12_2", restaurantId: "rest12", name: "Amritsari Kulcha", description: "Flaky stuffed kulcha with chole & onion salad", price: 100, category: "Breads", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p12_3", restaurantId: "rest12", name: "Dhaba Chicken Curry", description: "Rustic highway-style chicken in tomato-onion masala", price: 240, category: "Main Course", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Bestseller"] },
    { id: "p12_4", restaurantId: "rest12", name: "Paneer Bhurji", description: "Scrambled paneer with onion, tomato & spices", price: 180, category: "Main Course", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p12_5", restaurantId: "rest12", name: "Mutton Keema Naan Roll", description: "Spiced minced mutton wrapped in tandoor naan", price: 220, category: "Starters", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Popular"] },
    { id: "p12_6", restaurantId: "rest12", name: "Lassi (Sweetened)", description: "Ice-cold thick sweetened lassi – large glass", price: 70, category: "Drinks", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p12_7", restaurantId: "rest12", name: "Aloo Gobi", description: "Classic dry potato & cauliflower stir-fry", price: 140, category: "Main Course", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p12_8", restaurantId: "rest12", name: "Egg Bhurji", description: "Spiced scrambled eggs with onion & tomato", price: 100, category: "Main Course", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Popular"] },

    // ─── Wok N Roll (rest13) ──────────────────────────────────────
    { id: "p13_1", restaurantId: "rest13", name: "Dimsums (Veg, 6 pcs)", description: "Steamed momos with garlic chilli dipping sauce", price: 130, category: "Starters", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Bestseller", "Vegetarian"] },
    { id: "p13_2", restaurantId: "rest13", name: "Chicken Dimsums (6 pcs)", description: "Juicy chicken momos with chilli oil", price: 160, category: "Starters", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Bestseller"] },
    { id: "p13_3", restaurantId: "rest13", name: "Veg Schezwan Noodles", description: "Fiery schezwan stir-fried noodles with veggies", price: 150, category: "Noodles", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Spicy"] },
    { id: "p13_4", restaurantId: "rest13", name: "Prawn Fried Rice", description: "Wok-tossed rice with succulent prawns", price: 250, category: "Rice", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Popular"] },
    { id: "p13_5", restaurantId: "rest13", name: "Tofu Stir Fry", description: "Crispy tofu with vegetables in ginger-soy glaze", price: 170, category: "Main Course", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p13_6", restaurantId: "rest13", name: "Thai Green Curry (Veg)", description: "Coconut-based green curry with Thai vegetables", price: 200, category: "Main Course", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p13_7", restaurantId: "rest13", name: "Chilli Garlic Chicken", description: "Tossed chicken in bold chilli-garlic sauce", price: 210, category: "Starters", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Popular", "Spicy"] },
    { id: "p13_8", restaurantId: "rest13", name: "Wonton Soup", description: "Delicate pork & prawn wontons in clear broth", price: 110, category: "Soups", image: "https://images.unsplash.com/photo-1605300647680-dc9d1aebfef7?w=300&h=300&fit=crop", isAvailable: true, isVeg: false, tags: ["Popular"] },

    // ─── Mithaiwala Sweet House (rest14) ──────────────────────────
    { id: "p14_1", restaurantId: "rest14", name: "Gulab Jamun (4 pcs)", description: "Soft milk-solid dumplings soaked in rose syrup", price: 80, category: "Sweets", image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Bestseller", "Vegetarian"] },
    { id: "p14_2", restaurantId: "rest14", name: "Kaju Katli (250g)", description: "Diamond-cut cashew fudge with silver leaf", price: 280, category: "Sweets", image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Bestseller", "Premium"] },
    { id: "p14_3", restaurantId: "rest14", name: "Gajar Ka Halwa", description: "Slow-cooked carrot halwa with ghee & dry fruits", price: 100, category: "Sweets", image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Seasonal"] },
    { id: "p14_4", restaurantId: "rest14", name: "Jalebi (200g)", description: "Crispy spiral fritters soaked in sugar syrup", price: 70, category: "Sweets", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p14_5", restaurantId: "rest14", name: "Motichoor Ladoo (4 pcs)", description: "Delicate saffron boondi ladoos", price: 100, category: "Sweets", image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian", "Popular"] },
    { id: "p14_6", restaurantId: "rest14", name: "Rabri", description: "Dense reduced milk with cardamom & pistachios", price: 90, category: "Sweets", image: "https://images.unsplash.com/photo-1557142046-c704a3adf364?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p14_7", restaurantId: "rest14", name: "Barfi (Mix, 250g)", description: "Assorted coconut, besan & khoya barfi platter", price: 200, category: "Sweets", image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
    { id: "p14_8", restaurantId: "rest14", name: "Imarti", description: "Crispy deep-fried lentil sweet in amber syrup", price: 60, category: "Sweets", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=300&fit=crop", isAvailable: true, isVeg: true, tags: ["Vegetarian"] },
]

const SEED_ORDERS: Order[] = [
    {
        id: "ORD-1001",
        customerId: "customer1",
        customerName: "Nishant Patel",
        customerPhone: "+91 98765 43210",
        restaurantId: "rest1",
        restaurantName: "Punjabi Rasoi",
        driverId: null,
        driverName: null,
        items: [
            { productId: "p1_1", name: "Butter Chicken", price: 220, quantity: 1 },
            { productId: "p1_4", name: "Chicken Biryani", price: 260, quantity: 1 },
        ],
        status: "preparing",
        total: 480,
        deliveryAddress: "123 R G Road, Apt 4B, Surat, GJ 395001",
        paymentMethod: "UPI",
        createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
    },
    {
        id: "ORD-1002",
        customerId: "customer1",
        customerName: "Nishant Patel",
        customerPhone: "+91 98765 43210",
        restaurantId: "rest2",
        restaurantName: "Gujarati Thali House",
        driverId: "driver1",
        driverName: "Ravi Sharma",
        items: [
            { productId: "p2_1", name: "Full Gujarati Thali", price: 180, quantity: 2 },
        ],
        status: "picked",
        total: 360,
        deliveryAddress: "123 R G Road, Apt 4B, Surat, GJ 395001",
        paymentMethod: "UPI",
        createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    },
]

const SEED_PENDING_VENDORS: PendingVendor[] = [
    {
        id: "pv1",
        name: "Bombay Street Food",
        email: "info@bombaystreet.com",
        cuisine: "Street Food",
        phone: "+91 98230 55667",
        address: "Ratan Pol, Ahmedabad, GJ 380001",
        submittedDate: "2024-01-15",
        status: "pending",
    },
    {
        id: "pv2",
        name: "Kerala Sadhya",
        email: "hello@keralasadhya.com",
        cuisine: "South Indian",
        phone: "+91 97111 44556",
        address: "Navrangpura, Ahmedabad, GJ 380009",
        submittedDate: "2024-01-14",
        status: "pending",
    },
]

const SEED_SETTINGS: PlatformSettings = {
    commissionRate: 15,
    deliveryFeeMin: 20,
    deliveryFeeMax: 50,
    supportEmail: "support@foodhub.in",
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
