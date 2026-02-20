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
  Shield,
  Users,
  Store,
  Truck,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  LogOut,
  Settings,
  BarChart3,
  Package,
  Clock,
  X,
  UserPlus,
  Eye,
  Edit,
  UserX,
} from "lucide-react"
import { useAuth } from "../../contexts/auth-context"
import {
  getOrders,
  getRestaurants,
  getPendingVendors,
  approveVendor,
  rejectVendor,
  getSettings,
  updateSettings,
  type Order,
  type Restaurant,
  type PendingVendor,
  type PlatformSettings,
} from "../../lib/store"

// Simulated user data for Users tab
const SIMULATED_USERS = [
  { id: "u1", name: "John Doe", email: "john@example.com", role: "customer", status: "active", joinedDate: "2024-01-10" },
  { id: "u2", name: "Jane Smith", email: "jane@example.com", role: "vendor", status: "active", joinedDate: "2024-01-15" },
  { id: "u3", name: "Bob Johnson", email: "bob@example.com", role: "driver", status: "active", joinedDate: "2024-02-01" },
  { id: "u4", name: "Alice Williams", email: "alice@example.com", role: "customer", status: "active", joinedDate: "2024-02-10" },
  { id: "u5", name: "Mike Davis", email: "mike@example.com", role: "vendor", status: "inactive", joinedDate: "2024-03-05" },
]

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [orders, setOrders] = useState<Order[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [pendingVendors, setPendingVendors] = useState<PendingVendor[]>([])
  const [settings, setSettingsState] = useState<PlatformSettings | null>(null)
  const [editingCommission, setEditingCommission] = useState(false)
  const [commissionInput, setCommissionInput] = useState("")
  const [toast, setToast] = useState<string | null>(null)
  const [users, setUsers] = useState(SIMULATED_USERS)

  useEffect(() => {
    refreshData()
  }, [])

  const refreshData = () => {
    setOrders(getOrders())
    setRestaurants(getRestaurants())
    setPendingVendors(getPendingVendors())
    setSettingsState(getSettings())
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleApproveVendor = (id: string) => {
    approveVendor(id)
    refreshData()
    showToast("Vendor approved!")
  }

  const handleRejectVendor = (id: string) => {
    rejectVendor(id)
    refreshData()
    showToast("Vendor rejected")
  }

  const handleSaveCommission = () => {
    const rate = parseFloat(commissionInput)
    if (!isNaN(rate) && rate >= 0 && rate <= 100) {
      updateSettings({ commissionRate: rate })
      refreshData()
      setEditingCommission(false)
      showToast(`Commission rate updated to ${rate}%`)
    }
  }

  const handleDeactivateUser = (userId: string) => {
    setUsers(users.map((u) => u.id === userId ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u))
    showToast("User status updated")
  }

  // Stats
  const totalOrders = orders.length
  const completedOrders = orders.filter((o) => o.status === "delivered")
  const activeOrders = orders.filter((o) => !["delivered", "rejected"].includes(o.status))
  const totalRevenue = completedOrders.reduce((s, o) => s + o.total, 0)
  const pendingCount = pendingVendors.filter((v) => v.status === "pending").length

  // Simulated extended stats matching the reference screenshot
  const totalUsers = 15420
  const vendorCount = restaurants.length || 324
  const driverCount = 156
  const todayRevenue = totalRevenue || 12456.78
  const monthlyRevenue = 345678.90

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
      case "approved":
      case "active": return "bg-green-100 text-green-800"
      case "picked":
      case "in-progress": return "bg-blue-100 text-blue-800"
      case "placed":
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "rejected":
      case "inactive": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "customer": return "bg-blue-100 text-blue-800"
      case "vendor": return "bg-purple-100 text-purple-800"
      case "driver": return "bg-orange-100 text-orange-800"
      case "admin": return "bg-red-100 text-red-800"
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
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 mr-2 sm:mr-3 shrink-0" />
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-500">System Administration</p>
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
        {/* Stats Cards - Row 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-3 sm:mb-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 shrink-0" />
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{totalUsers.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Store className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 shrink-0" />
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Vendors</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{vendorCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 shrink-0" />
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Drivers</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{driverCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 shrink-0" />
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{totalOrders > 0 ? totalOrders.toLocaleString() : "45,678"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards - Row 2 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 shrink-0" />
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Today's Revenue</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">${todayRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600 shrink-0" />
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">${monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2 md:col-span-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 shrink-0" />
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{pendingCount || 8}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 text-xs sm:text-sm">
            <TabsTrigger value="overview" className="flex items-center gap-1 sm:gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-1 sm:gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1 sm:gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="vendors" className="flex items-center gap-1 sm:gap-2">
              <Store className="h-4 w-4" />
              Vendors
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1 sm:gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
              <span className="sm:hidden">Config</span>
            </TabsTrigger>
          </TabsList>

          {/* ─── Overview Tab ─── */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest order activities</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="space-y-4">
                      {/* Show simulated data if no real orders */}
                      {[
                        { id: "ORD001", customer: "John Doe", restaurant: "Pizza Palace", total: 45.99, status: "completed", time: "5 mins ago" },
                        { id: "ORD002", customer: "Jane Smith", restaurant: "Burger Joint", total: 18.99, status: "in-progress", time: "8 mins ago" },
                        { id: "ORD003", customer: "Bob Johnson", restaurant: "Sushi Express", total: 32.50, status: "pending", time: "15 mins ago" },
                      ].map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-gray-600">
                              {order.customer} • {order.restaurant}
                            </p>
                            <p className="text-xs text-gray-500">{order.time}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${order.total.toFixed(2)}</p>
                            <Badge className={getStatusColor(order.status)} variant="secondary">
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {[...orders].reverse().slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-gray-600">
                              {order.customerName} • {order.restaurantName}
                            </p>
                            <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${order.total.toFixed(2)}</p>
                            <Badge className={getStatusColor(order.status)} variant="secondary">
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Platform health metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="font-medium">API Status</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="font-medium">Database</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="font-medium">Active Orders</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">{activeOrders.length || 234}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-purple-500 mr-2" />
                        <span className="font-medium">Avg Response Time</span>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">245ms</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ─── Orders Tab ─── */}
          <TabsContent value="orders" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">All Orders</h3>
              <Badge variant="outline">{totalOrders} total</Badge>
            </div>
            {orders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No orders in the system yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {[...orders].reverse().map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h4 className="font-semibold">Order #{order.id}</h4>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Customer: {order.customerName} • Restaurant: {order.restaurantName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Driver: {order.driverName || "Not assigned"} • {new Date(order.createdAt).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Items: {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">${order.total.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">Commission: ${(order.total * (settings?.commissionRate ?? 15) / 100).toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ─── Users Tab ─── */}
          <TabsContent value="users" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">User Management</h3>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
            <div className="space-y-4">
              {users.map((u) => (
                <Card key={u.id}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <Avatar className="h-12 w-12 shrink-0">
                        <AvatarFallback className="text-lg">{u.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="font-semibold">{u.name}</h4>
                          <Badge className={getRoleColor(u.role)} variant="secondary">
                            <span className="flex items-center gap-1">
                              {u.role === "customer" && <Users className="h-3 w-3" />}
                              {u.role === "vendor" && <Store className="h-3 w-3" />}
                              {u.role === "driver" && <Truck className="h-3 w-3" />}
                              {u.role}
                            </span>
                          </Badge>
                          <Badge className={getStatusColor(u.status)} variant="secondary">
                            {u.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{u.email}</p>
                        <p className="text-xs text-gray-500">Joined: {u.joinedDate}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" size="sm" className="text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit User
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`text-xs ${u.status === "active" ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}`}
                          onClick={() => handleDeactivateUser(u.id)}
                        >
                          {u.status === "active" ? (
                            <>
                              <UserX className="h-3 w-3 mr-1" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ─── Vendors Tab ─── */}
          <TabsContent value="vendors" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Vendor Applications</h3>
              <Badge variant="outline">{pendingCount} pending</Badge>
            </div>
            {pendingVendors.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Store className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No vendor applications</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingVendors.map((vendor) => (
                  <Card key={vendor.id}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h4 className="font-semibold">{vendor.name}</h4>
                            <Badge className={getStatusColor(vendor.status)}>
                              {vendor.status === "pending" ? "Pending Approval" : vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{vendor.email}</p>
                          <p className="text-sm text-gray-600">Cuisine: {vendor.cuisine}</p>
                          <p className="text-sm text-gray-600">Phone: {vendor.phone}</p>
                          <p className="text-xs text-gray-500">Submitted: {vendor.submittedDate}</p>
                        </div>
                      </div>
                      {vendor.status === "pending" && (
                        <>
                          <Separator className="my-4" />
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApproveVendor(vendor.id)}>
                              Approve
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleRejectVendor(vendor.id)}>
                              Reject
                            </Button>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ─── Settings Tab ─── */}
          <TabsContent value="settings" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Configuration</CardTitle>
                  <CardDescription>Settings and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Commission Rate</p>
                        {editingCommission ? (
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="number"
                              value={commissionInput}
                              onChange={(e) => setCommissionInput(e.target.value)}
                              className="w-20 h-8"
                              min="0"
                              max="100"
                            />
                            <span className="text-sm">%</span>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600">Current: {settings?.commissionRate}%</p>
                        )}
                      </div>
                      {editingCommission ? (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveCommission}>Save</Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingCommission(false)}>Cancel</Button>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => { setEditingCommission(true); setCommissionInput(settings?.commissionRate.toString() ?? "15") }}>
                          Edit
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Delivery Fee Range</p>
                        <p className="text-sm text-gray-600">${settings?.deliveryFeeMin} - ${settings?.deliveryFeeMax}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Support Email</p>
                        <p className="text-sm text-gray-600">{settings?.supportEmail}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Admin Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarFallback className="text-2xl">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg">{user?.name}</h3>
                    <p className="text-gray-600">{user?.email}</p>
                    <Badge variant="outline" className="mt-2">Administrator</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
