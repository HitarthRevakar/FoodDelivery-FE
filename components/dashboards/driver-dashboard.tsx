"use client"

import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import {
  Truck,
  MapPin,
  Clock,
  DollarSign,
  Package,
  LogOut,
  Navigation,
  CheckCircle,
  TrendingUp,
  Phone,
  Store,
} from "lucide-react"
import { useAuth } from "../../contexts/auth-context"
import {
  getAvailableOrdersForDriver,
  getActiveOrdersForDriver,
  getOrdersByDriver,
  updateOrderStatus,
  type Order,
} from "../../lib/store"

export function DriverDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("available")
  const [availableOrders, setAvailableOrders] = useState<Order[]>([])
  const [activeOrders, setActiveOrders] = useState<Order[]>([])
  const [completedOrders, setCompletedOrders] = useState<Order[]>([])
  const [toast, setToast] = useState<string | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    refreshData()
  }, [user])

  const refreshData = () => {
    const driverId = user?.id ?? ""
    setAvailableOrders(getAvailableOrdersForDriver())
    setActiveOrders(getActiveOrdersForDriver(driverId))
    const all = getOrdersByDriver(driverId)
    setCompletedOrders(all.filter((o) => o.status === "delivered"))
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleAcceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, "picked", {
      driverId: user?.id ?? "",
      driverName: user?.name ?? "",
    })
    refreshData()
    setActiveTab("active")
    showToast("Order accepted! Navigate to pickup.")
  }

  const handleMarkDelivered = (orderId: string) => {
    updateOrderStatus(orderId, "delivered")
    refreshData()
    showToast("Order delivered successfully!")
  }

  // Stats
  const todayEarnings = completedOrders.reduce((s, o) => s + o.total * 0.15, 0) // 15% delivery commission
  const totalDeliveries = completedOrders.length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready": return "bg-green-100 text-green-800"
      case "picked": return "bg-blue-100 text-blue-800"
      case "delivered": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed top-[calc(1rem+env(safe-area-inset-top,0px))] left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-4 sm:px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm sm:text-base max-w-[90vw]">
          <CheckCircle className="h-5 w-5" />
          {toast}
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50 pt-[env(safe-area-inset-top,0px)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">

            {/* Left: FoodHub brand + Driver info */}
            <div className="flex items-center gap-3 min-w-0">
              {/* FoodHub brand */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center">
                  <Truck className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-extrabold text-purple-600 tracking-tight hidden sm:block">FoodHub</span>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-7 bg-gray-200" />

              {/* Driver info */}
              <div className="flex items-start gap-1.5 min-w-0">
                <Truck className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold leading-none">Delivery Partner</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
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
                  <p className="text-sm font-medium text-gray-600">Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">₹{todayEarnings.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Deliveries</p>
                  <p className="text-2xl font-bold text-gray-900">{totalDeliveries}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">{availableOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{activeOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] justify-start sm:grid sm:grid-cols-4 text-xs sm:text-sm">
            <TabsTrigger value="available" className="flex items-center gap-2 whitespace-nowrap px-3 sm:px-4 shrink-0 sm:shrink">
              <Package className="h-4 w-4" />
              Available
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2 whitespace-nowrap px-3 sm:px-4 shrink-0 sm:shrink">
              <Truck className="h-4 w-4" />
              Active
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2 whitespace-nowrap px-3 sm:px-4 shrink-0 sm:shrink">
              <CheckCircle className="h-4 w-4" />
              Completed
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 whitespace-nowrap px-3 sm:px-4 shrink-0 sm:shrink">
              <Truck className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Available Orders</h3>
              <Badge variant="outline">{availableOrders.length} available</Badge>
            </div>
            {availableOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No orders available for pickup right now</p>
                  <Button variant="outline" className="mt-4" onClick={refreshData}>Refresh</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {availableOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <h4 className="font-bold text-gray-900">Order #{order.id}</h4>
                            <Badge className="bg-green-100 text-green-800">Ready for Pickup</Badge>
                          </div>
                          <div className="grid gap-2 sm:gap-1.5 text-sm text-gray-600">
                            <p className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                              <span className="truncate"><span className="font-medium text-gray-900">Pickup:</span> {order.restaurantName}</span>
                            </p>
                            <p className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
                              <span className="truncate"><span className="font-medium text-gray-900">Drop-off:</span> {order.deliveryAddress}</span>
                            </p>
                            <div className="pt-2 mt-2 border-t border-gray-100">
                              <p className="text-sm text-gray-600 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                                <span className="font-medium text-gray-900 shrink-0">Items:</span>
                                <span className="text-gray-500 leading-snug">{order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="w-full sm:w-auto bg-green-50/50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end shrink-0 border sm:border-0 border-green-100 mt-2 sm:mt-0">
                          <div className="text-left sm:text-right">
                            <p className="text-lg sm:text-xl font-bold text-gray-900">₹{order.total.toFixed(2)}</p>
                            <p className="text-[13px] sm:text-sm font-medium text-green-600 sm:text-green-600 mt-0.5 whitespace-nowrap">
                              ~₹{(order.total * 0.15).toFixed(2)} tip
                            </p>
                          </div>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" onClick={() => handleAcceptOrder(order.id)}>
                          Accept & Pickup
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Active Deliveries</h3>
              <Badge variant="outline">{activeOrders.length} active</Badge>
            </div>
            {activeOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Truck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No active deliveries</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <h4 className="font-bold text-gray-900">Order #{order.id}</h4>
                            <Badge className="bg-blue-100 text-blue-800">
                              <span className="flex items-center gap-1">
                                <Truck className="h-3 w-3" />
                                In Transit
                              </span>
                            </Badge>
                          </div>
                          <div className="grid gap-2 sm:gap-1.5 text-sm text-gray-600">
                            <p className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
                              <span className="truncate"><span className="font-medium text-gray-900">Drop-off:</span> {order.deliveryAddress}</span>
                            </p>
                            <p className="flex items-start gap-2">
                              <Phone className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
                              <span className="truncate"><span className="font-medium text-gray-900">Contact:</span> {order.customerPhone}</span>
                            </p>
                            <div className="pt-2 mt-2 border-t border-gray-100">
                              <p className="text-sm text-gray-600 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                                <span className="font-medium text-gray-900 shrink-0">Items:</span>
                                <span className="text-gray-500 leading-snug">{order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="w-full sm:w-auto bg-gray-50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end shrink-0 border sm:border-0 border-gray-100 mt-2 sm:mt-0">
                          <div className="text-left sm:text-right">
                            <p className="text-lg sm:text-xl font-bold text-gray-900">₹{order.total.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" className="flex-1" onClick={() => handleMarkDelivered(order.id)}>
                          Mark as Delivered
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Completed Deliveries</h3>
            {completedOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No completed deliveries yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {[...completedOrders].reverse().map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h4 className="font-bold text-gray-900">Order #{order.id}</h4>
                            <Badge className="bg-green-100 text-green-800">Delivered</Badge>
                          </div>
                          <div className="grid gap-1 text-sm text-gray-600">
                            <p className="flex items-start gap-2">
                              <span className="truncate"><span className="font-medium text-gray-900">Route:</span> {order.restaurantName} → {order.customerName}</span>
                            </p>
                            <p className="text-xs text-gray-500">{new Date(order.updatedAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="w-full sm:w-auto flex flex-row sm:flex-col justify-between items-center sm:items-end shrink-0 border-t sm:border-0 border-gray-100 pt-3 sm:pt-0 mt-2 sm:mt-0">
                          <p className="text-lg font-bold text-green-600">₹{(order.total * 0.15).toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Driver Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarFallback className="text-2xl">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg">{user?.name}</h3>
                    <p className="text-gray-600">{user?.email}</p>
                    <Badge variant="outline" className="mt-2">Driver</Badge>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">4.8 Rating</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Vehicle Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Vehicle Type</label>
                        <p className="mt-1 text-sm text-gray-900">Motorcycle</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">License Plate</label>
                        <p className="mt-1 text-sm text-gray-900">ABC-1234</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Vehicle Model</label>
                        <p className="mt-1 text-sm text-gray-900">Honda CB200X</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Color</label>
                        <p className="mt-1 text-sm text-gray-900">Black</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Total Deliveries</label>
                        <p className="mt-1 text-sm text-gray-900">{totalDeliveries}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Total Earnings</label>
                        <p className="mt-1 text-sm text-gray-900">₹{todayEarnings.toFixed(2)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Acceptance Rate</label>
                        <p className="mt-1 text-sm text-gray-900">95%</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Avg Delivery Time</label>
                        <p className="mt-1 text-sm text-gray-900">22 mins</p>
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
