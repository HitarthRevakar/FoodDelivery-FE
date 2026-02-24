"use client"

import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Input } from "../ui/input"
import {
  User,
  ShoppingCart,
  Clock,
  MapPin,
  Star,
  CreditCard,
  Package,
  LogOut,
  Search,
  ArrowLeft,
  Heart,
  Plus,
  Minus,
  Trash2,
  X,
  CheckCircle
} from "lucide-react"
import { useAuth } from "../../contexts/auth-context"
import {
  getRestaurants,
  getProductsByRestaurant,
  getOrdersByCustomer,
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  getCartTotal,
  addOrder,
  generateOrderId,
  type Restaurant,
  type Product,
  type Order,
  type CartItem,
} from "../../lib/store"

const ORDER_STATUS_STEPS: { key: string; label: string }[] = [
  { key: "placed", label: "Placed" },
  { key: "accepted", label: "Accepted" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "picked", label: "Picked Up" },
  { key: "delivered", label: "Delivered" },
]

export function CustomerDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("browse")
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [menuItems, setMenuItems] = useState<Product[]>([])
  const [showCart, setShowCart] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState(0) // 0=cart,1=address,2=payment,3=confirm
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState("All")
  const [vegFilter, setVegFilter] = useState<"all" | "veg" | "nonveg">("all")
  const [toast, setToast] = useState<string | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const DUMMY_ADDRESSES = [
    "123 R G Road, Apt 4B, Surat, GJ 395001",
    "45 Adajan Patiya, Flat 302, Surat, GJ 395009",
    "7 Vesu Main Road, Bungalow 12, Surat, GJ 395007",
  ]
  const DUMMY_PAYMENTS = [
    { id: "visa", label: "Visa ending in 4242", icon: "💳", type: "Card" },
    { id: "master", label: "Mastercard ending in 5353", icon: "💳", type: "Card" },
    { id: "upi", label: "UPI — hreva@okaxis", icon: "📱", type: "UPI" },
    { id: "cod", label: "Cash on Delivery", icon: "💵", type: "Cash" },
  ]
  const [selectedAddress, setSelectedAddress] = useState(DUMMY_ADDRESSES[0])
  const [selectedPayment, setSelectedPayment] = useState(DUMMY_PAYMENTS[0].id)

  useEffect(() => {
    refreshData()
  }, [user])

  const refreshData = () => {
    setRestaurants(getRestaurants().filter((r) => r.status === "approved"))
    setOrders(getOrdersByCustomer(user?.id ?? ""))
    setCart(getCart())
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const cuisines = ["All", ...Array.from(new Set(restaurants.map((r) => r.cuisine)))]

  const filteredRestaurants = restaurants.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCuisine = selectedCuisine === "All" || r.cuisine === selectedCuisine
    return matchSearch && matchCuisine
  })

  const filteredMenuItems = menuItems.filter((item) => {
    if (vegFilter === "veg") return item.isVeg
    if (vegFilter === "nonveg") return !item.isVeg
    return true
  })

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    setMenuItems(getProductsByRestaurant(restaurant.id).filter((p) => p.isAvailable))
  }

  const handleAddToCart = (product: Product) => {
    const restaurant = selectedRestaurant!
    addToCart({
      productId: product.id,
      restaurantId: restaurant.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    })
    setCart(getCart())
    showToast(`${product.name} added to cart!`)
  }

  const handleUpdateQty = (productId: string, qty: number) => {
    updateCartItemQuantity(productId, qty)
    setCart(getCart())
  }

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId)
    setCart(getCart())
  }

  const handlePlaceOrder = () => {
    if (cart.length === 0) return
    const restaurantId = cart[0].restaurantId
    const restaurant = restaurants.find((r) => r.id === restaurantId)
    const paymentLabel = DUMMY_PAYMENTS.find(p => p.id === selectedPayment)?.label ?? selectedPayment
    const order: Order = {
      id: generateOrderId(),
      customerId: user?.id ?? "",
      customerName: user?.name ?? "",
      customerPhone: "+91 98765 43210",
      restaurantId,
      restaurantName: restaurant?.name ?? "",
      driverId: null,
      driverName: null,
      items: cart.map((c) => ({
        productId: c.productId,
        name: c.name,
        price: c.price,
        quantity: c.quantity,
      })),
      status: "placed",
      total: getCartTotal(),
      deliveryAddress: selectedAddress,
      paymentMethod: paymentLabel,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    addOrder(order)
    clearCart()
    setCart([])
    setCheckoutStep(0)
    setShowCart(false)
    setActiveTab("orders")
    refreshData()
    showToast("Order placed successfully! 🎉")
  }

  const activeOrders = orders.filter((o) => o.status !== "delivered" && o.status !== "rejected")
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0)

  const getStatusIndex = (status: string) => ORDER_STATUS_STEPS.findIndex((s) => s.key === status)

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-4 sm:px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 text-sm sm:text-base max-w-[90vw]">
          <CheckCircle className="h-5 w-5" />
          {toast}
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">

            {/* ── Left: Brand + Location ── */}
            <div className="flex items-center gap-3 min-w-0">
              {/* FoodHub brand */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-extrabold text-purple-600 tracking-tight hidden sm:block">FoodHub</span>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-7 bg-gray-200" />

              {/* Delivery location */}
              <div className="flex items-start gap-1.5 cursor-pointer group min-w-0">
                <MapPin className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold leading-none">Deliver to</p>
                  <p className="text-sm font-bold text-gray-900 flex items-center gap-0.5 truncate">
                    {/* Show area + city, e.g. "Apt 4B, Surat" */}
                    <span className="truncate">
                      {selectedAddress.split(",").slice(1, 3).map(s => s.trim()).join(", ")}
                    </span>
                    <svg className="h-3 w-3 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </p>
                </div>
              </div>
            </div>

            {/* ── Right: Cart + Avatar dropdown ── */}
            <div className="ml-auto flex items-center gap-2">
              {/* Cart button */}
              <button
                onClick={() => { setShowCart(!showCart); setCheckoutStep(0) }}
                className="relative p-2 rounded-full hover:bg-gray-100 transition"
              >
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Avatar dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-gray-100 transition border border-transparent hover:border-gray-200"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[90px] truncate">{user?.name?.split(" ")[0]}</span>
                  <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown panel */}
                {showUserMenu && (
                  <>
                    {/* Click-outside backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      {/* User info */}
                      <div className="px-4 py-3 border-b bg-gray-50">
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      {/* Menu items */}
                      {[
                        { icon: <Search className="h-4 w-4" />, label: "Browse", action: () => { setActiveTab("browse"); setSelectedRestaurant(null); setShowUserMenu(false) } },
                        { icon: <Package className="h-4 w-4" />, label: "My Orders", action: () => { setActiveTab("orders"); setSelectedRestaurant(null); setShowUserMenu(false) } },
                        { icon: <User className="h-4 w-4" />, label: "Profile", action: () => { setActiveTab("profile"); setSelectedRestaurant(null); setShowUserMenu(false) } },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={item.action}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition text-left"
                        >
                          <span className="text-gray-400">{item.icon}</span>
                          {item.label}
                        </button>
                      ))}
                      <div className="border-t" />
                      <button
                        onClick={() => { setShowUserMenu(false); logout() }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">


        {/* ─── Cart Sidebar ─── */}
        {showCart && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/30" onClick={() => { setShowCart(false); setCheckoutStep(0) }} />
            <div className="relative w-full max-w-md bg-white shadow-xl h-full flex flex-col">

              {/* ── Step indicator (steps 1-3) ── */}
              {checkoutStep > 0 && (
                <div className="px-6 pt-5 pb-3 border-b flex items-center gap-2">
                  {["Address", "Payment", "Confirm"].map((label, i) => {
                    const step = i + 1
                    const done = checkoutStep > step
                    const active = checkoutStep === step
                    return (
                      <div key={label} className="flex items-center gap-1 flex-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${done ? "bg-purple-600 text-white" : active ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500"
                          }`}>
                          {done ? "✓" : step}
                        </div>
                        <span className={`text-xs font-medium truncate ${active ? "text-purple-700" : done ? "text-purple-500" : "text-gray-400"
                          }`}>{label}</span>
                        {i < 2 && <div className="flex-1 h-px bg-gray-200 mx-1" />}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* ── Header ── */}
              <div className="px-6 pt-5 pb-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {checkoutStep > 0 && (
                    <button onClick={() => setCheckoutStep(s => s - 1)} className="p-1 rounded-full hover:bg-gray-100 transition">
                      <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </button>
                  )}
                  <h3 className="text-xl font-bold">
                    {checkoutStep === 0 ? "Your Cart" : checkoutStep === 1 ? "Delivery Address" : checkoutStep === 2 ? "Payment Method" : "Confirm Order"}
                  </h3>
                </div>
                <button onClick={() => { setShowCart(false); setCheckoutStep(0) }}>
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* ── Content ── */}
              <div className="flex-1 overflow-y-auto px-6 pb-6">

                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">Your cart is empty</p>

                ) : checkoutStep === 0 ? (
                  /* ── Step 0: Cart Items ── */
                  <div>
                    <div className="space-y-4 mt-2">
                      {cart.map((item) => (
                        <div key={item.productId} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">₹{item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateQty(item.productId, item.quantity - 1)}
                              className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-medium w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQty(item.productId, item.quantity + 1)}
                              className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button onClick={() => handleRemoveItem(item.productId)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between items-center mb-5">
                      <span className="font-semibold text-lg">Total</span>
                      <span className="font-bold text-xl">₹{getCartTotal().toFixed(2)}</span>
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 h-11" onClick={() => setCheckoutStep(1)}>
                      Continue →
                    </Button>
                  </div>

                ) : checkoutStep === 1 ? (
                  /* ── Step 1: Choose Delivery Address ── */
                  <div className="mt-3 space-y-3">
                    <p className="text-sm text-gray-500 mb-4">Select where you'd like your order delivered</p>
                    {DUMMY_ADDRESSES.map((addr) => (
                      <button
                        key={addr}
                        onClick={() => setSelectedAddress(addr)}
                        className={`w-full text-left p-4 border-2 rounded-xl transition flex items-start gap-3 ${selectedAddress === addr
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300 bg-white"
                          }`}
                      >
                        <MapPin className={`h-4 w-4 mt-0.5 shrink-0 ${selectedAddress === addr ? "text-purple-600" : "text-gray-400"}`} />
                        <span className={`text-sm font-medium leading-snug ${selectedAddress === addr ? "text-purple-900" : "text-gray-700"}`}>
                          {addr}
                        </span>
                        {selectedAddress === addr && (
                          <CheckCircle className="h-4 w-4 ml-auto shrink-0 text-purple-600" />
                        )}
                      </button>
                    ))}
                    <Separator className="my-4" />
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 h-11" onClick={() => setCheckoutStep(2)}>
                      Continue →
                    </Button>
                  </div>

                ) : checkoutStep === 2 ? (
                  /* ── Step 2: Select Payment Method ── */
                  <div className="mt-3 space-y-3">
                    <p className="text-sm text-gray-500 mb-4">Choose how you'd like to pay</p>
                    {DUMMY_PAYMENTS.map((pm) => (
                      <button
                        key={pm.id}
                        onClick={() => setSelectedPayment(pm.id)}
                        className={`w-full text-left p-4 border-2 rounded-xl transition flex items-center gap-3 ${selectedPayment === pm.id
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300 bg-white"
                          }`}
                      >
                        <span className="text-xl shrink-0">{pm.icon}</span>
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${selectedPayment === pm.id ? "text-purple-900" : "text-gray-800"}`}>
                            {pm.label}
                          </p>
                          <p className="text-xs text-gray-400">{pm.type}</p>
                        </div>
                        {selectedPayment === pm.id && (
                          <CheckCircle className="h-4 w-4 shrink-0 text-purple-600" />
                        )}
                      </button>
                    ))}
                    <Separator className="my-4" />
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 h-11" onClick={() => setCheckoutStep(3)}>
                      Continue →
                    </Button>
                  </div>

                ) : (
                  /* ── Step 3: Confirm Order ── */
                  <div className="mt-3 space-y-5">
                    {/* Delivery address summary */}
                    <div className="p-4 bg-gray-50 rounded-xl border">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Delivering to</p>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-gray-800 font-medium">{selectedAddress}</p>
                      </div>
                    </div>

                    {/* Payment summary */}
                    <div className="p-4 bg-gray-50 rounded-xl border">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Payment</p>
                      <div className="flex items-center gap-2">
                        <span className="text-base">{DUMMY_PAYMENTS.find(p => p.id === selectedPayment)?.icon}</span>
                        <p className="text-sm text-gray-800 font-medium">
                          {DUMMY_PAYMENTS.find(p => p.id === selectedPayment)?.label}
                        </p>
                      </div>
                    </div>

                    {/* Order items */}
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Order Summary</p>
                      <div className="space-y-1.5">
                        {cart.map((item) => (
                          <div key={item.productId} className="flex justify-between text-sm">
                            <span className="text-gray-700">{item.quantity}× {item.name}</span>
                            <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <Separator className="my-3" />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{getCartTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    <Button className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-base font-bold" onClick={handlePlaceOrder}>
                      Place Order ✓
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── Restaurant Detail View ─── */}
        {selectedRestaurant ? (
          <div>
            <button
              onClick={() => setSelectedRestaurant(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            {/* Restaurant Hero */}
            <div className="relative rounded-2xl overflow-hidden mb-6">
              <img
                src={selectedRestaurant.image}
                alt={selectedRestaurant.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <div className="bg-white rounded-xl p-4 -mb-10 relative shadow-lg inline-block min-w-[300px]">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedRestaurant.name}</h2>
                      <p className="text-gray-600">{selectedRestaurant.description}</p>
                    </div>
                    <button className="text-gray-400 hover:text-red-500 transition">
                      <Heart className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                    <span className="flex items-center text-yellow-600 font-medium">
                      <Star className="h-4 w-4 fill-current mr-1" />
                      {selectedRestaurant.rating}
                      <span className="text-gray-400 ml-1">({selectedRestaurant.reviewCount})</span>
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {selectedRestaurant.deliveryTime}
                    </span>
                    <Badge variant="outline">{selectedRestaurant.cuisine}</Badge>

                  </div>
                </div>
              </div>
            </div>

            {/* Menu */}
            <div className="mt-14">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Menu</h3>
                <div className="flex gap-2">
                  {(["all", "veg", "nonveg"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setVegFilter(f)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${vegFilter === f
                        ? f === "veg"
                          ? "bg-green-600 text-white border-green-600"
                          : f === "nonveg"
                            ? "bg-red-600 text-white border-red-600"
                            : "bg-gray-800 text-white border-gray-800"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      {f === "veg" ? "🟢 Veg" : f === "nonveg" ? "🔴 Non-Veg" : "All"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMenuItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border rounded-xl hover:shadow-md transition bg-white"
                  >
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-sm border-2 flex-shrink-0 ${item.isVeg ? "border-green-600 bg-green-100" : "border-red-600 bg-red-100"}`} title={item.isVeg ? "Veg" : "Non-Veg"} />
                        <h4 className="font-semibold">{item.name}</h4>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                      <div className="flex gap-1 mt-1">
                        {item.tags.map((tag) => (
                          <Badge
                            key={tag}
                            className={
                              tag === "Bestseller"
                                ? "bg-green-100 text-green-700 text-xs"
                                : tag === "Vegetarian"
                                  ? "bg-emerald-100 text-emerald-700 text-xs"
                                  : "bg-orange-100 text-orange-700 text-xs"
                            }
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <span className="font-bold text-lg">₹{item.price.toFixed(2)}</span>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ─── Browse Tab ─── */}
            {activeTab === "browse" && (
              <div className="flex gap-6 items-start">

                {/* ── Left Sidebar Filter Panel ── */}
                <aside className="hidden lg:flex flex-col gap-6 w-64 shrink-0 sticky top-24 self-start">
                  {/* Search */}
                  <div className="bg-white rounded-2xl shadow-sm border p-5">
                    <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Search</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Restaurants, cuisines..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Food Type */}
                  <div className="bg-white rounded-2xl shadow-sm border p-5">
                    <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Food Type</h3>
                    <div className="flex flex-col gap-2">
                      {([
                        { key: "all", label: "All Items", icon: "🍽️", active: "bg-gray-900 text-white border-gray-900" },
                        { key: "veg", label: "Veg Only", icon: "🟢", active: "bg-green-600 text-white border-green-600" },
                        { key: "nonveg", label: "Non-Veg", icon: "🔴", active: "bg-red-600 text-white border-red-600" },
                      ] as const).map((f) => (
                        <button
                          key={f.key}
                          onClick={() => setVegFilter(f.key)}
                          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${vegFilter === f.key ? f.active : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700"
                            }`}
                        >
                          <span className="text-base">{f.icon}</span>
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cuisine */}
                  <div className="bg-white rounded-2xl shadow-sm border p-5">
                    <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Cuisine</h3>
                    <div className="flex flex-col gap-1">
                      {cuisines.map((c) => {
                        const cuisineIcons: Record<string, string> = {
                          "All": "🍴", "North Indian": "🫕", "Gujarati": "🥘", "Gujarati Snacks": "🥨",
                          "South Indian": "🥞", "Chinese": "🥡", "Beverages": "🥤", "Ice Cream": "🍦",
                          "Street Food": "🌮", "Rajasthani": "🫙", "Sweets & Desserts": "🍮",
                        }
                        const icon = cuisineIcons[c] ?? "🍽️"
                        const isActive = selectedCuisine === c
                        return (
                          <button
                            key={c}
                            onClick={() => setSelectedCuisine(c)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${isActive
                              ? "bg-purple-600 text-white"
                              : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                              }`}
                          >
                            <span>{icon}</span>
                            <span className="truncate">{c}</span>
                            {isActive && (
                              <span className="ml-auto bg-white/20 text-white text-xs rounded-full px-1.5 py-0.5">
                                {restaurants.filter(r => r.cuisine === c).length}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>


                </aside>

                {/* ── Main Content Area ── */}
                <div className="flex-1 min-w-0">

                  {/* Mobile search & filters (shown on small screens) */}
                  <div className="lg:hidden mb-4 space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search restaurants or cuisines..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                    </div>
                    <div className="flex gap-2">
                      {(["all", "veg", "nonveg"] as const).map((f) => (
                        <button key={f} onClick={() => setVegFilter(f)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${vegFilter === f
                            ? f === "veg" ? "bg-green-600 text-white border-green-600"
                              : f === "nonveg" ? "bg-red-600 text-white border-red-600"
                                : "bg-gray-800 text-white border-gray-800"
                            : "bg-white text-gray-600 border-gray-300"}`}>
                          {f === "veg" ? "🟢 Veg" : f === "nonveg" ? "🔴 Non-Veg" : "🍽️ All"}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {cuisines.map((c) => (
                        <button key={c} onClick={() => setSelectedCuisine(c)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition ${selectedCuisine === c ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-600 border-gray-200"}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active Orders Banner */}
                  {activeOrders.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse inline-block" />
                          Active Orders
                        </h3>
                        <button onClick={() => setActiveTab("orders")} className="text-sm text-purple-600 hover:underline font-medium">
                          View All →
                        </button>
                      </div>
                      <div className="flex gap-4 overflow-x-auto pb-2">
                        {activeOrders.slice(0, 3).map((order) => (
                          <div
                            key={order.id}
                            className="min-w-[260px] bg-gradient-to-br from-purple-700 to-indigo-600 text-white rounded-2xl p-4 cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all"
                            onClick={() => setActiveTab("orders")}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-xs opacity-70 font-mono">{order.id}</span>
                              <Badge className="bg-white/20 text-white border-0 capitalize text-xs">{order.status}</Badge>
                            </div>
                            <p className="font-bold text-base">{order.restaurantName}</p>
                            <p className="text-xs opacity-80 flex items-center mt-2 gap-1">
                              <Clock className="h-3 w-3" />
                              {order.status === "picked" ? "Arriving in 10–15 min" : "Arriving in 25–35 min"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Restaurant List Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">
                        {selectedCuisine === "All" ? "All Restaurants" : selectedCuisine}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? "s" : ""} available
                      </p>
                    </div>
                    {(selectedCuisine !== "All" || vegFilter !== "all" || searchQuery) && (
                      <button
                        onClick={() => { setSelectedCuisine("All"); setVegFilter("all"); setSearchQuery("") }}
                        className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 border border-purple-200 rounded-full px-3 py-1 hover:bg-purple-50 transition"
                      >
                        <X className="h-3 w-3" /> Clear filters
                      </button>
                    )}
                  </div>

                  {/* Restaurant Grid */}
                  {filteredRestaurants.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                      <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No restaurants found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {filteredRestaurants.map((restaurant) => (
                        <div
                          key={restaurant.id}
                          className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-gray-100 group"
                          onClick={() => handleRestaurantClick(restaurant)}
                        >
                          <div className="relative overflow-hidden">
                            <img
                              src={restaurant.image}
                              alt={restaurant.name}
                              className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur text-xs font-semibold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                              <Clock className="h-3 w-3 text-purple-600" />
                              {restaurant.deliveryTime}
                            </div>
                            <button
                              className="absolute top-3 right-3 w-8 h-8 bg-white/95 backdrop-blur rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition shadow-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Heart className="h-4 w-4 text-gray-400" />
                            </button>
                            <div className="absolute bottom-3 left-3">
                              <Badge className="bg-purple-600 text-white text-xs border-0 shadow">{restaurant.cuisine}</Badge>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-base text-gray-900 leading-tight">{restaurant.name}</h4>
                              <span className="text-xs text-gray-400 font-medium ml-2 shrink-0">{restaurant.priceRange}</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{restaurant.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="flex items-center text-amber-500 font-bold text-sm">
                                <Star className="h-4 w-4 fill-current mr-1" />
                                {restaurant.rating}
                                <span className="text-gray-400 font-normal ml-1 text-xs">({restaurant.reviewCount})</span>
                              </span>
                              <span className="text-xs text-purple-600 font-semibold group-hover:underline">View Menu →</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── Orders Tab ─── */}
            {activeTab === "orders" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Orders</h3>
                {orders.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No orders yet. Browse restaurants to place your first order!</p>
                      <Button className="mt-4" onClick={() => setActiveTab("browse")}>Browse Restaurants</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {[...orders].reverse().map((order) => (
                      <Card key={order.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{order.restaurantName}</h4>
                                <Badge
                                  className={
                                    order.status === "delivered"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "rejected"
                                        ? "bg-red-100 text-red-800"
                                        : order.status === "picked"
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-yellow-100 text-yellow-800"
                                  }
                                >
                                  {order.status === "picked" ? "Out for Delivery" : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                              </p>
                              <p className="text-sm text-gray-500">
                                Order #{order.id} • {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold">₹{order.total.toFixed(2)}</p>
                            </div>
                          </div>

                          {/* Order Status Progress */}
                          {order.status !== "delivered" && order.status !== "rejected" && (
                            <div className="mb-4">
                              <div className="flex items-center justify-between relative">
                                {ORDER_STATUS_STEPS.map((step, idx) => {
                                  const currentIdx = getStatusIndex(order.status)
                                  const isDone = idx <= currentIdx
                                  const isCurrent = idx === currentIdx
                                  return (
                                    <div key={step.key} className="flex flex-col items-center flex-1 relative">
                                      {idx > 0 && (
                                        <div
                                          className={`absolute top-3 -left-1/2 right-1/2 h-0.5 ${idx <= currentIdx ? "bg-purple-600" : "bg-gray-200"
                                            }`}
                                        />
                                      )}
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs z-10 ${isDone
                                          ? "bg-purple-600 text-white"
                                          : "bg-gray-200 text-gray-500"
                                          } ${isCurrent ? "ring-2 ring-purple-300" : ""}`}
                                      >
                                        {isDone ? "✓" : idx + 1}
                                      </div>
                                      <span className={`text-xs mt-1 ${isDone ? "text-purple-600 font-medium" : "text-gray-400"}`}>
                                        {step.label}
                                      </span>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          <Separator className="my-4" />
                          <div className="flex gap-2">
                            {order.status === "delivered" && (
                              <Button variant="outline" size="sm" onClick={() => {
                                // re-add items to cart for reorder
                                order.items.forEach((item) => {
                                  addToCart({
                                    productId: item.productId,
                                    restaurantId: order.restaurantId,
                                    name: item.name,
                                    price: item.price,
                                    quantity: item.quantity,
                                    image: "",
                                  })
                                })
                                setCart(getCart())
                                showToast("Items added to cart for reorder!")
                              }}>
                                Reorder
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── Profile Tab ─── */}
            {activeTab === "profile" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-20 w-20 mb-4">
                        <AvatarFallback className="text-2xl bg-purple-100 text-purple-700">{user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-lg">{user?.name}</h3>
                      <p className="text-gray-600">{user?.email}</p>
                      <Badge variant="outline" className="mt-2">Customer</Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Delivery Addresses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            <div>
                              <p className="font-medium">Home</p>
                              <p className="text-sm text-gray-600">123 Main St, Apt 4B, New York, NY 10001</p>
                            </div>
                          </div>
                          <Badge>Default</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            <div>
                              <p className="font-medium">Work</p>
                              <p className="text-sm text-gray-600">456 Office Blvd, Floor 12, New York, NY 10002</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Methods</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                            <div>
                              <p className="font-medium">Visa ending in 4242</p>
                              <p className="text-sm text-gray-600">Expires 12/25</p>
                            </div>
                          </div>
                          <Badge>Default</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
