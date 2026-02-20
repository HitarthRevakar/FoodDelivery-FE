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
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-4 sm:px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm sm:text-base max-w-[90vw]">
          <CheckCircle className="h-5 w-5" />
          {toast}
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center min-w-0">
              <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 mr-2 sm:mr-3 shrink-0" />
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold text-gray-900">Driver Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-500">Delivery Partner</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout} className="px-2 sm:px-3">
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
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
                  <p className="text-2xl font-bold text-gray-900">${todayEarnings.toFixed(2)}</p>
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
          <TabsList className="grid w-full grid-cols-4 text-xs sm:text-sm">
            <TabsTrigger value="available" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Available
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Active
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
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
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">Order #{order.id}</h4>
                            <Badge className="bg-green-100 text-green-800">Ready for Pickup</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                          </p>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              Pickup: {order.restaurantName}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              Drop-off: {order.deliveryAddress}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-green-600">${order.total.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">~${(order.total * 0.15).toFixed(2)} tip</p>
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
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">Order #{order.id}</h4>
                            <Badge className="bg-blue-100 text-blue-800">
                              <span className="flex items-center gap-1">
                                <Truck className="h-3 w-3" />
                                In Transit
                              </span>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                          </p>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              Drop-off: {order.deliveryAddress}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {order.customerPhone}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-green-600">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex gap-2">
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
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">Order #{order.id}</h4>
                            <Badge className="bg-green-100 text-green-800">Delivered</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{order.restaurantName} → {order.customerName}</p>
                          <p className="text-xs text-gray-500">{new Date(order.updatedAt).toLocaleString()}</p>
                        </div>
                        <p className="font-semibold text-green-600">${(order.total * 0.15).toFixed(2)}</p>
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
                        <p className="mt-1 text-sm text-gray-900">${todayEarnings.toFixed(2)}</p>
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
