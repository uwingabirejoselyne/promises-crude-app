

import type React from "react"

import { useState, useEffect } from "react"
import type { Product, ProductFormData } from "../types/product"
import { productApi } from "../services/api"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Plus, Loader2, Edit, Trash2, Star, ArrowLeft, Search, X, ShoppingCart } from "lucide-react"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [qtyById, setQtyById] = useState<Record<number, number>>({})

  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    price: 0,
    brand: "",
    category: "",
    stock: 0,
  })

  const { user } = useAuth()
  const { addItem } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        title: editingProduct.title || "",
        description: editingProduct.description || "",
        price: editingProduct.price || 0,
        brand: editingProduct.brand || "",
        category: editingProduct.category || "",
        stock: editingProduct.stock || 0,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        price: 0,
        brand: "",
        category: "",
        stock: 0,
      })
    }
  }, [editingProduct])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await productApi.getAllProducts()
      setProducts(data)
      setFilteredProducts(data)
    } catch (error) {
      console.error("Failed to load products:", error)
      alert("Failed to load products. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredProducts(products)
      return
    }

    try {
      const results = await productApi.searchProducts(query)
      setFilteredProducts(results)
    } catch (error) {
      console.error("Failed to search products:", error)
      alert("Failed to search products. Please try again.")
    }
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setFilteredProducts(products)
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    try {
      if (editingProduct) {
        const updated = await productApi.updateProduct(editingProduct.id, formData)
        if (updated) {
          setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? updated : p)))
          setFilteredProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? updated : p)))
          alert("Product updated successfully!")
        }
      } else {
        const newProduct = await productApi.addProduct(formData)
        if (newProduct) {
          setProducts((prev) => [newProduct, ...prev])
          setFilteredProducts((prev) => [newProduct, ...prev])
          alert("Product added successfully!")
        }
      }
      setShowForm(false)
      setEditingProduct(null)
    } catch (error) {
      console.error(`Failed to ${editingProduct ? "update" : "add"} product:`, error)
      alert(`Failed to ${editingProduct ? "update" : "add"} product. Please try again.`)
    } finally {
      setFormLoading(false)
    }
  }

  const handleAddToCart = async (productId: number) => {
    if (!user?.id) return navigate("/login")
    const qty = qtyById[productId] ?? 1
    await addItem(productId, Math.max(1, qty))
  }

  const setQty = (productId: number, value: number) => {
    setQtyById((prev) => ({ ...prev, [productId]: Math.max(1, value || 1) }))
  }

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const success = await productApi.deleteProduct(id)
      if (success) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
        setFilteredProducts((prev) => prev.filter((p) => p.id !== id))
        alert("Product deleted successfully!")
      }
    } catch (error) {
      console.error("Failed to delete product:", error)
      alert("Failed to delete product. Please try again.")
    }
  }

  const handleFormChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchQuery.trim())
  }

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => {
                setShowForm(false)
                setEditingProduct(null)
              }}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
            <h1 className="text-3xl font-bold">{editingProduct ? "Edit Product" : "Add New Product"}</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Product Title *</Label>
                    <Input
                      id="title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleFormChange("title", e.target.value)}
                      placeholder="Enter product title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand *</Label>
                    <Input
                      id="brand"
                      type="text"
                      value={formData.brand}
                      onChange={(e) => handleFormChange("brand", e.target.value)}
                      placeholder="Enter brand name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                    placeholder="Enter product description"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleFormChange("price", Number.parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      type="text"
                      value={formData.category}
                      onChange={(e) => handleFormChange("category", e.target.value)}
                      placeholder="Enter category"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => handleFormChange("stock", Number.parseInt(e.target.value) || 0)}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={formLoading} className="flex-1">
                    {formLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingProduct(null)
                    }}
                    disabled={formLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Products</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
          <Button onClick={handleAddProduct}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search products by name, brand, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <Button type="submit">Search</Button>
        </form>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading products...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {searchQuery ? "No products found matching your search." : "No products available."}
            </p>
            {!searchQuery && (
              <Button onClick={handleAddProduct} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredProducts.map((product) => {
              if (!product) return null

              const {
                id,
                title = "Untitled Product",
                description = "No description available",
                price = 0,
                discountPercentage = 0,
                rating = 0,
                stock = 0,
                brand = "Unknown Brand",
                category = "Uncategorized",
                thumbnail,
              } = product

              const discountedPrice = price - (price * discountPercentage) / 100

              return (
                <Card key={id} className="group h-full flex flex-col overflow-hidden hover:shadow-xl transition-all border-border/60 bg-card/60 backdrop-blur-xl">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={thumbnail || "/placeholder.svg?height=300&width=300&query=product"}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=300&width=300"
                      }}
                    />
                    {discountPercentage > 0 && (
                      <div className="absolute left-3 top-3 rounded-full bg-destructive/90 px-3 py-1 text-xs font-semibold text-destructive-foreground shadow">
                        -{discountPercentage.toFixed(0)}%
                      </div>
                    )}
                  </div>

                  <CardContent className="flex-1 p-4 pb-2">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-lg line-clamp-2 leading-tight">{title}</h3>
                        <Badge variant="secondary" className="shrink-0">
                          {category}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{brand}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold">${discountedPrice.toFixed(2)}</span>
                            {discountPercentage > 0 && (
                              <span className="text-sm text-muted-foreground line-through">${price.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Stock</p>
                          <p className={`text-sm font-medium ${stock > 0 ? "text-green-600" : "text-red-600"}`}>
                            {stock > 0 ? `${stock} left` : "Out of stock"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-3 sm:p-4 pt-0 flex flex-wrap gap-2 border-t bg-background/40">
                    <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)} className="flex-1 sm:flex-none sm:min-w-[90px] hover:shadow"> 
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(id)} className="flex-1 sm:flex-none sm:min-w-[90px] hover:shadow">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                    <div className="flex-1 sm:flex-none flex items-center gap-2 min-w-[150px]">
                      <Input
                        type="number"
                        min={1}
                        value={qtyById[id] ?? 1}
                        onChange={(e) => setQty(id, Number.parseInt(e.target.value))}
                        className="h-9 w-20"
                      />
                      <Button size="sm" onClick={() => handleAddToCart(id)} className="flex-1 hover:shadow bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
