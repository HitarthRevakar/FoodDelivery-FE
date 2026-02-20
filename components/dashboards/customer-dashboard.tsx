"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { Avatar, AvatarFallback } from "../ui/avatar"
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
  Filter
} from "lucide-react"
import { useAuth } from "../../contexts/auth-context"

export function CustomerDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("orders")

  const mockOrders = [
    {
      id: "ORD001",
      restaurant: "Pizza Palace",
      items: "2x Margherita Pizza, 1x Garlic Bread",
      status: "delivered",
      total: "$45.99",
      date: "2024-01-15",
      rating: 5
    },
    {
      id: "ORD002", 
      restaurant: "Burger Joint",
      items: "1x Cheese Burger, 1x Fries, 1x Coke",
      status: "on-the-way",
      total: "$18.99",
      date: "2024-01-16",
      estimatedTime: "15 mins"
    },
    {
      id: "ORD003",
      restaurant: "Sushi Express",
      items: "1x California Roll, 2x Salmon Nigiri",
      status: "preparing",
      total: "$32.50",
      date: "2024-01-16",
      estimatedTime: "25 mins"
    }
  ]

  const mockRestaurants = [
    {
      name: "Pizza Palace",
      cuisine: "Italian",
      rating: 4.5,
      deliveryTime: "20-30 min",
      deliveryFee: "$2.99"
    },
    {
      name: "Burger Joint", 
      cuisine: "American",
      rating: 4.2,
      deliveryTime: "15-25 min",
      deliveryFee: "$1.99"
    },
    {
      name: "Sushi Express",
      cuisine: "Japanese", 
      rating: 4.8,
      deliveryTime: "30-40 min",
      deliveryFee: "$3.99"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800"
      case "on-the-way": return "bg-blue-100 text-blue-800"
      case "preparing": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-orange-500 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">FoodHub</h1>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-gray-600">What would you like to order today?</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === "browse" ? "default" : "ghost"}
              onClick={() => setActiveTab("browse")}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Browse Restaurants
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

        {/* Content based on active tab */}
        {activeTab === "browse" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Popular Restaurants</h3>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockRestaurants.map((restaurant, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                        <CardDescription>{restaurant.cuisine}</CardDescription>
                      </div>
                      <div className="flex items-center bg-yellow-100 px-2 py-1 rounded">
                        <Star className="h-3 w-3 text-yellow-600 mr-1" />
                        <span className="text-sm font-medium">{restaurant.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {restaurant.deliveryTime}
                      </div>
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-1" />
                        {restaurant.deliveryFee}
                      </div>
                    </div>
                    <Button className="w-full mt-4">Order Now</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Your Orders</h3>
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{order.restaurant}</h4>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.replace("-", " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{order.items}</p>
                        <p className="text-sm text-gray-500">Order #{order.id} • {order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">{order.total}</p>
                        {order.estimatedTime && (
                          <p className="text-sm text-gray-600 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {order.estimatedTime}
                          </p>
                        )}
                      </div>
                    </div>
                    {order.status === "delivered" && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < (order.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">Your rating</span>
                      </div>
                    )}
                    <Separator className="my-4" />
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      {order.status === "delivered" && (
                        <Button variant="outline" size="sm">Reorder</Button>
                      )}
                      {order.status === "on-the-way" && (
                        <Button size="sm">Track Order</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarFallback className="text-2xl">{user?.name?.charAt(0)}</AvatarFallback>
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
                  <Button className="w-full mt-4" variant="outline">Add New Address</Button>
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
                  <Button className="w-full mt-4" variant="outline">Add Payment Method</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
