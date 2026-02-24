"use client"

import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  Store,
  ShoppingCart,
  Clock,
  TrendingUp,
  Star,
  DollarSign,
  Package,
  LogOut,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  X,
  Heart,
  MapPin,
  User,
} from "lucide-react"
import { useAuth } from "../../contexts/auth-context"
import {
  getRestaurantsByOwner,
  getOrdersByRestaurant,
  getProductsByRestaurant,
  updateOrderStatus,
  addProduct,
  updateProduct,
  deleteProduct,
  generateId,
  type Restaurant,
  type Order,
  type Product,
} from "../../lib/store"

export function VendorDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("orders")
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [menuItems, setMenuItems] = useState<Product[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Product | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "", price: "", category: "", tags: "" })
  const [toast, setToast] = useState<string | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Simulated weekly revenue data
  const weeklyRevenue = [
    { day: "Monday", revenue: 856.43 },
    { day: "Tuesday", revenue: 1234.56 },
    { day: "Wednesday", revenue: 987.21 },
    { day: "Thursday", revenue: 1456.78 },
    { day: "Friday", revenue: 1789.12 },
    { day: "Saturday", revenue: 2134.56 },
    { day: "Sunday", revenue: 1567.89 },
  ]

  // Simulated top selling items data
  const topSellingItems = [
    { name: "Margherita Pizza", orders: 45 },
    { name: "Cheese Burger", orders: 38 },
    { name: "Caesar Salad", orders: 32 },
    { name: "Pasta Carbonara", orders: 28 },
    { name: "Chicken Wings", orders: 25 },
  ]

  useEffect(() => {
    refreshData()
  }, [user])

  const refreshData = () => {
    const rests = getRestaurantsByOwner(user?.id ?? "")
    setRestaurants(rests)
    const allOrders: Order[] = []
    const allProducts: Product[] = []
    rests.forEach((r) => {
      allOrders.push(...getOrdersByRestaurant(r.id))
      allProducts.push(...getProductsByRestaurant(r.id))
    })
    setOrders(allOrders)
    setMenuItems(allProducts)
  }

  const showToastMsg = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleAcceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, "accepted")
    refreshData()
    showToastMsg("Order accepted!")
  }

  const handleRejectOrder = (orderId: string) => {
    updateOrderStatus(orderId, "rejected")
    refreshData()
    showToastMsg("Order rejected")
  }

  const handleMarkPreparing = (orderId: string) => {
    updateOrderStatus(orderId, "preparing")
    refreshData()
    showToastMsg("Order status: Preparing")
  }

  const handleMarkReady = (orderId: string) => {
    updateOrderStatus(orderId, "ready")
    refreshData()
    showToastMsg("Order marked as Ready!")
  }

  const openAddModal = () => {
    setEditingItem(null)
    setFormData({ name: "", description: "", price: "", category: "", tags: "" })
    setShowModal(true)
  }

  const openEditModal = (item: Product) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      tags: item.tags.join(", "),
    })
    setShowModal(true)
  }

  const handleSaveItem = () => {
    if (!formData.name || !formData.price) return
    const restId = restaurants[0]?.id ?? ""
    if (editingItem) {
      updateProduct(editingItem.id, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      })
      showToastMsg("Menu item updated!")
    } else {
      addProduct({
        id: generateId("prod"),
        restaurantId: restId,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop",
        isAvailable: true,
        isVeg: false,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      })
      showToastMsg("Menu item added!")
    }
    setShowModal(false)
    refreshData()
  }

  const handleDeleteItem = (id: string) => {
    deleteProduct(id)
    refreshData()
    showToastMsg("Menu item deleted")
  }

  const handleToggleAvailability = (item: Product) => {
    updateProduct(item.id, { isAvailable: !item.isAvailable })
    refreshData()
  }

  // Stats from real data
  const todayOrders = orders.length
  const completedOrders = orders.filter((o) => o.status === "delivered")
  const todayRevenue = completedOrders.reduce((s, o) => s + o.total, 0) || 1234.56
  const avgOrderValue = todayOrders > 0 ? orders.reduce((s, o) => s + o.total, 0) / todayOrders : 27.43
  const avgRating = restaurants.length > 0 ? restaurants.reduce((s, r) => s + r.rating, 0) / restaurants.length : 4.5

  const getStatusColor = (status: string) => {
    switch (status) {
      case "placed": return "bg-red-100 text-red-800"
      case "accepted": return "bg-blue-100 text-blue-800"
      case "preparing": return "bg-yellow-100 text-yellow-800"
      case "ready": return "bg-green-100 text-green-800"
      case "picked": return "bg-indigo-100 text-indigo-800"
      case "delivered": return "bg-emerald-100 text-emerald-800"
      case "rejected": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "placed": return <AlertCircle className="h-4 w-4" />
      case "accepted":
      case "preparing": return <Clock className="h-4 w-4" />
      case "ready":
      case "delivered": return <CheckCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-4 sm:px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm sm:text-base max-w-[90vw]">
          <CheckCircle className="h-5 w-5" />
          {toast}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-xl mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{editingItem ? "Edit Menu Item" : "Add Menu Item"}</h3>
              <button onClick={() => setShowModal(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Item name" />
              </div>
              <div>
                <Label>Description</Label>
                <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Short description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price (₹)</Label>
                  <Input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Main Course" />
                </div>
              </div>
              <div>
                <Label>Tags (comma separated)</Label>
                <Input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="Bestseller, Vegetarian" />
              </div>
              <Button className="w-full" onClick={handleSaveItem}>
                {editingItem ? "Update Item" : "Add Item"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">

            {/* Left: FoodHub brand + Restaurant name */}
            <div className="flex items-center gap-3 min-w-0">
              {/* FoodHub brand */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center">
                  <Store className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-extrabold text-purple-600 tracking-tight hidden sm:block">FoodHub</span>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-7 bg-gray-200" />

              {/* Restaurant info (Zomato/Swiggy partner style) */}
              <div className="flex items-start gap-1.5 min-w-0">
                <Store className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold leading-none">Partner Restaurant</p>
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {restaurants[0]?.name ?? user?.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Avatar dropdown */}
            <div className="ml-auto flex items-center gap-2">
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

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b bg-gray-50">
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      {[
                        { icon: <ShoppingCart className="h-4 w-4" />, label: "Orders", tab: "orders" },
                        { icon: <Package className="h-4 w-4" />, label: "Menu", tab: "menu" },
                        { icon: <TrendingUp className="h-4 w-4" />, label: "Analytics", tab: "analytics" },
                        { icon: <Store className="h-4 w-4" />, label: "Store", tab: "profile" },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => { setActiveTab(item.tab); setShowUserMenu(false) }}
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

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{todayRevenue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{todayOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">₹{avgOrderValue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Restaurants Section - matching reference screenshot style */}
        {restaurants.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">My Restaurants</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition border"
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
                        {/* <span className="text-gray-400">{restaurant.priceRange}</span> */}
                      </div>
                      <Badge variant="outline" className="text-xs">{restaurant.cuisine}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 text-xs sm:text-sm mb-6">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Store
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Orders</h3>
                <p className="text-sm text-gray-500">{orders.filter(o => !["delivered", "rejected"].includes(o.status)).length} active orders</p>
              </div>
            </div>
            {orders.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {[...orders].reverse().map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">Order #{order.id}</h4>
                            <Badge className={getStatusColor(order.status)}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(order.status)}
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                          </p>
                          <p className="text-sm text-gray-500">
                            Customer: {order.customerName} • {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">₹{order.total.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">{order.customerPhone}</p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex gap-2">
                        {order.status === "placed" && (
                          <>
                            <Button size="sm" onClick={() => handleAcceptOrder(order.id)}>Accept Order</Button>
                            <Button variant="outline" size="sm" onClick={() => handleRejectOrder(order.id)}>Reject</Button>
                          </>
                        )}
                        {order.status === "accepted" && (
                          <Button size="sm" onClick={() => handleMarkPreparing(order.id)}>Start Preparing</Button>
                        )}
                        {order.status === "preparing" && (
                          <Button size="sm" onClick={() => handleMarkReady(order.id)}>Mark as Ready</Button>
                        )}
                        {order.status === "ready" && (
                          <Badge className="bg-green-100 text-green-800 py-2 px-4">Waiting for driver pickup</Badge>
                        )}
                        {(order.status === "delivered" || order.status === "rejected") && (
                          <Badge variant="outline" className="py-2 px-4 capitalize">{order.status}</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Menu Items</h3>
                <p className="text-sm text-gray-500">{menuItems.length} items</p>
              </div>
              <Button onClick={openAddModal} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <Card key={item.id} className={!item.isAvailable ? "opacity-60" : ""}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="min-w-0">
                            <h4 className="font-semibold truncate">{item.name}</h4>
                            <p className="text-xs text-gray-500">{item.category}</p>
                          </div>
                          <Badge variant={item.isAvailable ? "default" : "secondary"} className="ml-1 shrink-0 text-xs">
                            {item.isAvailable ? "Live" : "Hidden"}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-base font-bold">₹{item.price.toFixed(2)}</p>
                      <div className="flex gap-1.5">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(item)} className="h-8 px-2">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleToggleAvailability(item)} className="h-8 px-2 text-xs">
                          {item.isAvailable ? "Hide" : "Show"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteItem(item.id)} className="h-8 px-2 text-red-500">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Analytics</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Last 7 days performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyRevenue.map((day) => (
                      <div key={day.day} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 w-24">{day.day}</span>
                        <div className="flex-1 mx-4">
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-purple-700 h-2.5 rounded-full"
                              style={{ width: `${(day.revenue / 2500) * 100}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-bold text-gray-900 w-24 text-right">₹{day.revenue.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Weekly Total</span>
                    <span className="text-lg font-bold text-gray-900">₹{weeklyRevenue.reduce((s, d) => s + d.revenue, 0).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Items</CardTitle>
                  <CardDescription>Most popular menu items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topSellingItems.map((item, idx) => (
                      <div key={item.name} className="flex items-center justify-between p-3 border rounded-xl">
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? "bg-yellow-100 text-yellow-700" :
                            idx === 1 ? "bg-gray-100 text-gray-700" :
                              idx === 2 ? "bg-purple-100 text-purple-700" : "bg-gray-50 text-gray-500"
                            }`}>{idx + 1}</span>
                          <span className="font-medium text-sm">{item.name}</span>
                        </div>
                        <Badge variant="outline">{item.orders} orders</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Store/Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Store</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader><CardTitle>Store Information</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700 text-3xl font-bold mb-4">
                      {user?.name?.charAt(0)}
                    </div>
                    <h3 className="font-semibold text-lg">{user?.name}</h3>
                    <p className="text-gray-600 text-sm">{user?.email}</p>
                    <Badge variant="outline" className="mt-2">Vendor</Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader><CardTitle>Store Details</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Store Name</label>
                        <p className="mt-1 text-sm text-gray-900">{user?.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Cuisine Type</label>
                        <p className="mt-1 text-sm text-gray-900">{restaurants.map((r) => r.cuisine).join(", ") || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <p className="mt-1 text-sm text-gray-900">{restaurants[0]?.phone || "+91 234-567-8900"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Address</label>
                        <p className="mt-1 text-sm text-gray-900">{restaurants[0]?.address || "Ahmedabad, Gujarat"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Operating Hours</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Monday - Friday</span>
                        <span className="text-sm text-gray-600">11:00 AM - 10:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Saturday - Sunday</span>
                        <span className="text-sm text-gray-600">12:00 PM - 11:00 PM</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
