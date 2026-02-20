"use client"

import { useState } from "react"
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
  AlertCircle,
  TrendingUp,
  Calendar,
  Phone
} from "lucide-react"
import { useAuth } from "../../contexts/auth-context"

export function DriverDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("available")

  const mockOrders = [
    {
      id: "ORD001",
      customer: "John Doe",
      restaurant: "Pizza Palace",
      restaurantAddress: "123 Restaurant St, NY 10001",
      deliveryAddress: "456 Customer Ave, NY 10002",
      items: "2x Margherita Pizza, 1x Garlic Bread",
      status: "available",
      estimatedTime: "25 mins",
      payment: "$45.99",
      customerPhone: "+1 234-567-8900",
      distance: "2.3 km"
    },
    {
      id: "ORD002", 
      customer: "Jane Smith",
      restaurant: "Burger Joint",
      restaurantAddress: "789 Food Blvd, NY 10003",
      deliveryAddress: "321 Delivery St, NY 10004",
      items: "1x Cheese Burger, 1x Fries, 1x Coke",
      status: "accepted",
      estimatedTime: "20 mins",
      payment: "$18.99",
      customerPhone: "+1 234-567-8901",
      distance: "1.8 km"
    },
    {
      id: "ORD003",
      customer: "Mike Johnson",
      restaurant: "Sushi Express",
      restaurantAddress: "555 Sushi Way, NY 10005",
      deliveryAddress: "999 Home Lane, NY 10006",
      items: "1x California Roll, 2x Salmon Nigiri",
      status: "picked-up",
      estimatedTime: "15 mins",
      payment: "$32.50",
      customerPhone: "+1 234-567-8902",
      distance: "3.1 km"
    }
  ]

  const mockStats = {
    todayEarnings: "$156.78",
    todayDeliveries: 12,
    avgDeliveryTime: "22 mins",
    totalDistance: "45.2 km",
    rating: 4.8,
    acceptanceRate: "95%"
  }

  const mockEarnings = [
    { date: "2024-01-15", deliveries: 8, earnings: "$98.45" },
    { date: "2024-01-14", deliveries: 10, earnings: "$123.67" },
    { date: "2024-01-13", deliveries: 7, earnings: "$87.23" },
    { date: "2024-01-12", deliveries: 12, earnings: "$156.78" },
    { date: "2024-01-11", deliveries: 9, earnings: "$112.34" },
    { date: "2024-01-10", deliveries: 11, earnings: "$134.56" },
    { date: "2024-01-09", deliveries: 6, earnings: "$76.89" }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800"
      case "accepted": return "bg-blue-100 text-blue-800"
      case "picked-up": return "bg-yellow-100 text-yellow-800"
      case "delivered": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available": return <Package className="h-4 w-4" />
      case "accepted": return <Clock className="h-4 w-4" />
      case "picked-up": return <Truck className="h-4 w-4" />
      case "delivered": return <CheckCircle className="h-4 w-4" />
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
              <Truck className="h-8 w-8 text-orange-500 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Driver Dashboard</h1>
                <p className="text-sm text-gray-500">Delivery Partner</p>
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
                  <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.todayEarnings}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{mockStats.todayDeliveries}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Time</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.avgDeliveryTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-yellow-500" />
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
            <TabsTrigger value="available" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Available
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Active
            </TabsTrigger>
            <TabsTrigger value="earnings" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Earnings
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Available Orders</h3>
              <Badge variant="outline">{mockOrders.filter(o => o.status === "available").length} available</Badge>
            </div>
            <div className="space-y-4">
              {mockOrders.filter(order => order.status === "available").map((order) => (
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
                        <p className="text-sm text-gray-600 mb-2">{order.items}</p>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            Pickup: {order.restaurant}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            Drop-off: {order.customer}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <Navigation className="h-3 w-3 mr-1" />
                            Distance: {order.distance}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600">{order.payment}</p>
                        <p className="text-sm text-gray-600">{order.estimatedTime}</p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">Accept Order</Button>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Active Deliveries</h3>
              <Badge variant="outline">{mockOrders.filter(o => o.status !== "available" && o.status !== "delivered").length} active</Badge>
            </div>
            <div className="space-y-4">
              {mockOrders.filter(order => order.status !== "available" && order.status !== "delivered").map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">Order #{order.id}</h4>
                          <Badge className={getStatusColor(order.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {order.status.replace("-", " ").charAt(0).toUpperCase() + order.status.slice(1).replace("-", " ")}
                            </span>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{order.items}</p>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {order.status === "accepted" ? `Pickup: ${order.restaurant}` : `Drop-off: ${order.customer}`}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {order.customerPhone}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600">{order.payment}</p>
                        <p className="text-sm text-gray-600">{order.estimatedTime}</p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex gap-2">
                      {order.status === "accepted" && (
                        <>
                          <Button size="sm" className="flex-1">Mark as Picked Up</Button>
                          <Button variant="outline" size="sm">Navigate</Button>
                        </>
                      )}
                      {order.status === "picked-up" && (
                        <>
                          <Button size="sm" className="flex-1">Mark as Delivered</Button>
                          <Button variant="outline" size="sm">Call Customer</Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="earnings" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Earnings</CardTitle>
                  <CardDescription>Last 7 days performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockEarnings.map((earning, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{earning.date}</p>
                          <p className="text-sm text-gray-600">{earning.deliveries} deliveries</p>
                        </div>
                        <p className="font-semibold text-green-600">{earning.earnings}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">$789.92</p>
                      <p className="text-sm text-gray-600">Total Earnings</p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Deliveries</span>
                        <span className="font-medium">63</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg per Delivery</span>
                        <span className="font-medium">$12.54</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Best Day</span>
                        <span className="font-medium">$156.78</span>
                      </div>
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
                      <span className="text-sm font-medium">{mockStats.rating} Rating</span>
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
                        <label className="text-sm font-medium text-gray-700">Acceptance Rate</label>
                        <p className="mt-1 text-sm text-gray-900">{mockStats.acceptanceRate}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Total Distance</label>
                        <p className="mt-1 text-sm text-gray-900">{mockStats.totalDistance}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Avg Delivery Time</label>
                        <p className="mt-1 text-sm text-gray-900">{mockStats.avgDeliveryTime}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Completed Orders</label>
                        <p className="mt-1 text-sm text-gray-900">342</p>
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
