"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { 
  Store, 
  ShoppingCart, 
  Clock, 
  TrendingUp, 
  Star, 
  DollarSign,
  Package,
  LogOut,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react"
import { useAuth } from "../../contexts/auth-context"

export function VendorDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("orders")

  const mockOrders = [
    {
      id: "ORD001",
      customer: "John Doe",
      items: "2x Margherita Pizza, 1x Garlic Bread",
      status: "new",
      total: "$45.99",
      time: "2 mins ago",
      customerPhone: "+1 234-567-8900"
    },
    {
      id: "ORD002", 
      customer: "Jane Smith",
      items: "1x Cheese Burger, 1x Fries, 1x Coke",
      status: "preparing",
      total: "$18.99",
      time: "5 mins ago",
      customerPhone: "+1 234-567-8901"
    },
    {
      id: "ORD003",
      customer: "Mike Johnson",
      items: "1x California Roll, 2x Salmon Nigiri",
      status: "ready",
      total: "$32.50",
      time: "10 mins ago",
      customerPhone: "+1 234-567-8902"
    },
    {
      id: "ORD004",
      customer: "Sarah Wilson",
      items: "3x Tacos, 1x Nachos",
      status: "completed",
      total: "$28.75",
      time: "30 mins ago",
      customerPhone: "+1 234-567-8903"
    }
  ]

  const mockStats = {
    todayRevenue: "$1,234.56",
    todayOrders: 45,
    avgOrderValue: "$27.43",
    rating: 4.5,
    activeOrders: 8,
    completionRate: "98%"
  }

  const mockMenuItems = [
    {
      name: "Margherita Pizza",
      category: "Pizza",
      price: "$12.99",
      status: "available",
      ordersToday: 15
    },
    {
      name: "Cheese Burger",
      category: "Burgers", 
      price: "$8.99",
      status: "available",
      ordersToday: 12
    },
    {
      name: "Caesar Salad",
      category: "Salads",
      price: "$7.99",
      status: "unavailable",
      ordersToday: 0
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-red-100 text-red-800"
      case "preparing": return "bg-yellow-100 text-yellow-800"
      case "ready": return "bg-blue-100 text-blue-800"
      case "completed": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new": return <AlertCircle className="h-4 w-4" />
      case "preparing": return <Clock className="h-4 w-4" />
      case "ready": return <CheckCircle className="h-4 w-4" />
      case "completed": return <CheckCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-orange-500 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-sm text-gray-500">Vendor Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.todayRevenue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today's Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.todayOrders}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{mockStats.avgOrderValue}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{mockStats.rating}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
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

          <TabsContent value="orders" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Active Orders</h3>
              <Badge variant="outline">{mockOrders.filter(o => o.status !== "completed").length} active</Badge>
            </div>
            <div className="space-y-4">
              {mockOrders.map((order) => (
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
                        <p className="text-sm text-gray-600 mb-1">{order.items}</p>
                        <p className="text-sm text-gray-500">
                          Customer: {order.customer} • {order.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">{order.total}</p>
                        <p className="text-sm text-gray-600">{order.customerPhone}</p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex gap-2">
                      {order.status === "new" && (
                        <>
                          <Button size="sm">Accept Order</Button>
                          <Button variant="outline" size="sm">Reject</Button>
                        </>
                      )}
                      {order.status === "preparing" && (
                        <Button size="sm">Mark as Ready</Button>
                      )}
                      {order.status === "ready" && (
                        <Button size="sm">Notify Driver</Button>
                      )}
                      {order.status === "completed" && (
                        <Button variant="outline" size="sm">View Details</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="menu" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Menu Items</h3>
              <Button>Add New Item</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockMenuItems.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.category}</p>
                      </div>
                      <Badge variant={item.status === "available" ? "default" : "secondary"}>
                        {item.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold">{item.price}</p>
                      <p className="text-sm text-gray-600">{item.ordersToday} orders today</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        {item.status === "available" ? "Hide" : "Show"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Last 7 days performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Monday</span>
                      <span className="font-medium">$856.43</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tuesday</span>
                      <span className="font-medium">$1,234.56</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Wednesday</span>
                      <span className="font-medium">$987.21</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Thursday</span>
                      <span className="font-medium">$1,456.78</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Friday</span>
                      <span className="font-medium">$1,789.12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Saturday</span>
                      <span className="font-medium">$2,134.56</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Sunday</span>
                      <span className="font-medium">$1,567.89</span>
                    </div>
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
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Margherita Pizza</span>
                      <span className="text-sm text-gray-600">45 orders</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Cheese Burger</span>
                      <span className="text-sm text-gray-600">38 orders</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Caesar Salad</span>
                      <span className="text-sm text-gray-600">32 orders</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Pasta Carbonara</span>
                      <span className="text-sm text-gray-600">28 orders</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Chicken Wings</span>
                      <span className="text-sm text-gray-600">25 orders</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Store Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarFallback className="text-2xl">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg">{user?.name}</h3>
                    <p className="text-gray-600">{user?.email}</p>
                    <Badge variant="outline" className="mt-2">Vendor</Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Store Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Store Name</label>
                        <p className="mt-1 text-sm text-gray-900">{user?.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Cuisine Type</label>
                        <p className="mt-1 text-sm text-gray-900">Italian, American</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <p className="mt-1 text-sm text-gray-900">+1 234-567-8900</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Address</label>
                        <p className="mt-1 text-sm text-gray-900">123 Restaurant St, NY 10001</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Operating Hours</CardTitle>
                  </CardHeader>
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
