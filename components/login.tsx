"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { AlertCircle, User, Store, Truck, Shield } from "lucide-react"

// Dummy credentials for each role
const DUMMY_CREDENTIALS = {
  customer: [
    { id: "customer1", email: "customer@example.com", password: "customer123", name: "John Doe" },
    { id: "customer2", email: "jane@example.com", password: "customer123", name: "Jane Smith" }
  ],
  vendor: [
    { id: "vendor1", email: "vendor@example.com", password: "vendor123", name: "Pizza Palace" },
    { id: "vendor2", email: "restaurant@example.com", password: "vendor123", name: "Burger Joint" }
  ],
  driver: [
    { id: "driver1", email: "driver@example.com", password: "driver123", name: "Mike Johnson" },
    { id: "driver2", email: "delivery@example.com", password: "driver123", name: "Sarah Wilson" }
  ],
  admin: [
    { id: "admin1", email: "admin@example.com", password: "admin123", name: "System Admin" },
    { id: "admin2", email: "superadmin@example.com", password: "admin123", name: "Super Admin" }
  ]
}

interface LoginProps {
  onLogin: (user: any, role: string) => void
}

export function Login({ onLogin }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<string>("customer")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showCredentials, setShowCredentials] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const credentials = DUMMY_CREDENTIALS[selectedRole as keyof typeof DUMMY_CREDENTIALS]
    const user = credentials.find(cred => cred.email === email && cred.password === password)

    if (user) {
      onLogin({ ...user, role: selectedRole }, selectedRole)
    } else {
      setError("Invalid email or password")
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "customer": return <User className="h-4 w-4" />
      case "vendor": return <Store className="h-4 w-4" />
      case "driver": return <Truck className="h-4 w-4" />
      case "admin": return <Shield className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }

  const getCredentialsForRole = () => {
    return DUMMY_CREDENTIALS[selectedRole as keyof typeof DUMMY_CREDENTIALS]
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Food Delivery Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Select your role and login with dummy credentials
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getRoleIcon(selectedRole)}
              {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Login
            </CardTitle>
            <CardDescription>
              Enter your credentials to access the {selectedRole} dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Customer
                      </div>
                    </SelectItem>
                    <SelectItem value="vendor">
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4" />
                        Vendor
                      </div>
                    </SelectItem>
                    <SelectItem value="driver">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Driver
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Admin
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>

            <div className="mt-6">
              <Button
                variant="outline"
                onClick={() => setShowCredentials(!showCredentials)}
                className="w-full"
              >
                {showCredentials ? "Hide" : "Show"} Dummy Credentials
              </Button>

              {showCredentials && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <h4 className="font-semibold mb-2">Dummy Credentials for {selectedRole}:</h4>
                  <div className="space-y-2 text-sm">
                    {getCredentialsForRole().map((cred, index) => (
                      <div key={index} className="p-2 bg-white rounded border">
                        <p><strong>Email:</strong> {cred.email}</p>
                        <p><strong>Password:</strong> {cred.password}</p>
                        <p><strong>Name:</strong> {cred.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
