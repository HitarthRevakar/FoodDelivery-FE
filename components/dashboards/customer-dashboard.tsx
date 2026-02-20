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
  Filter,
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
  const [showCheckout, setShowCheckout] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState("All")
  const [toast, setToast] = useState<string | null>(null)
  const [deliveryAddress] = useState("123 Main St, Apt 4B, New York, NY 10001")

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
    const order: Order = {
      id: generateOrderId(),
      customerId: user?.id ?? "",
      customerName: user?.name ?? "",
      customerPhone: "+1 234-567-8900",
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
      deliveryAddress,
      paymentMethod: "Visa ending in 4242",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    addOrder(order)
    clearCart()
    setCart([])
    setShowCheckout(false)
    setShowCart(false)
    setActiveTab("orders")
    refreshData()
    showToast("Order placed successfully!")
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
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center min-w-0">
              <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mr-2 sm:mr-3 shrink-0" />
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold text-gray-900">VioletEats</h1>
                <p className="text-xs text-gray-500 flex items-center truncate"><MapPin className="h-3 w-3 mr-1 shrink-0" /><span className="truncate">{deliveryAddress.split(",")[0]}</span></p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => { setShowCart(!showCart); setShowCheckout(false) }}
                className="relative p-2 rounded-full hover:bg-gray-100 transition"
              >
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
              <Avatar className="h-8 w-8 hidden sm:flex">
                <AvatarFallback className="bg-purple-100 text-purple-700">{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={logout} className="px-2 sm:px-3">
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Navigation Tabs */}
        {!selectedRestaurant && (
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit overflow-x-auto">
              <Button
                variant={activeTab === "browse" ? "default" : "ghost"}
                onClick={() => setActiveTab("browse")}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Browse
              </Button>
              <Button
                variant={activeTab === "orders" ? "default" : "ghost"}
                onClick={() => setActiveTab("orders")}
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                My Orders
              </Button>
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                onClick={() => setActiveTab("profile")}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Profile
              </Button>
            </div>
          </div>
        )}

        {/* ─── Cart Sidebar ─── */}
        {showCart && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/30" onClick={() => { setShowCart(false); setShowCheckout(false) }} />
            <div className="relative w-full max-w-md bg-white shadow-xl h-full overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Your Cart</h3>
                  <button onClick={() => { setShowCart(false); setShowCheckout(false) }}>
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">Your cart is empty</p>
                ) : showCheckout ? (
                  /* Checkout */
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Delivery Address</h4>
                      <div className="flex items-center p-3 border rounded-lg bg-gray-50">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">{deliveryAddress}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Payment Method</h4>
                      <div className="flex items-center p-3 border rounded-lg bg-gray-50">
                        <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">Visa ending in 4242</span>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Order Summary</h4>
                      {cart.map((item) => (
                        <div key={item.productId} className="flex justify-between text-sm py-1">
                          <span>{item.quantity}x {item.name}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${getCartTotal().toFixed(2)}</span>
                      </div>
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handlePlaceOrder}>
                      Confirm & Place Order
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => setShowCheckout(false)}>
                      Back to Cart
                    </Button>
                  </div>
                ) : (
                  /* Cart Items */
                  <div>
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.productId} className="flex items-center gap-3 p-3 border rounded-lg">
                          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
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
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-lg">Total</span>
                      <span className="font-bold text-xl">${getCartTotal().toFixed(2)}</span>
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => setShowCheckout(true)}>
                      Proceed to Checkout
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
                    <span>{selectedRestaurant.priceRange}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu */}
            <div className="mt-14">
              <h3 className="text-xl font-bold mb-4">Menu</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border rounded-xl hover:shadow-md transition bg-white"
                  >
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.description}</p>
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
                      <span className="font-bold text-lg">${item.price.toFixed(2)}</span>
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
              <div>
                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search restaurants or cuisines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>

                {/* Active Orders Banner */}
                {activeOrders.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg">Active Orders</h3>
                      <button onClick={() => setActiveTab("orders")} className="text-sm text-purple-600 hover:underline">
                        View All
                      </button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {activeOrders.slice(0, 3).map((order) => (
                        <div
                          key={order.id}
                          className="min-w-[280px] bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl p-4 cursor-pointer hover:shadow-lg transition"
                          onClick={() => setActiveTab("orders")}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm opacity-80">{order.id}</span>
                            <Badge className="bg-white/20 text-white border-0 capitalize">
                              {order.status}
                            </Badge>
                          </div>
                          <p className="font-semibold">{order.restaurantName}</p>
                          <p className="text-sm opacity-80 flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {order.status === "picked" ? "Arriving in 10-15 min" : "Arriving in 25-35 min"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cuisine Filters */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {cuisines.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCuisine(c)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedCuisine === c
                        ? "bg-purple-600 text-white"
                        : "bg-white border text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* Restaurant List */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">All Restaurants</h3>
                  <span className="text-sm text-gray-500">{filteredRestaurants.length} restaurants</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRestaurants.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer border"
                      onClick={() => handleRestaurantClick(restaurant)}
                    >
                      <div className="relative">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-medium px-3 py-1 rounded-full">
                          {restaurant.deliveryTime}
                        </div>
                        <button
                          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Heart className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-lg">{restaurant.name}</h4>
                        <p className="text-sm text-gray-500 mb-2">{restaurant.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center text-yellow-600 font-medium text-sm">
                              <Star className="h-4 w-4 fill-current mr-1" />
                              {restaurant.rating}
                              <span className="text-gray-400 ml-1">({restaurant.reviewCount})</span>
                            </span>
                            <span className="text-gray-400">{restaurant.priceRange}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">{restaurant.cuisine}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
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
                              <p className="text-lg font-semibold">${order.total.toFixed(2)}</p>
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
