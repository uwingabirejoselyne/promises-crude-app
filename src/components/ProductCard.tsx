
import type { Product } from "../types/product"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Edit, Trash2, Star } from "lucide-react"

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  if (!product) {
    return null
  }

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
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <div className="aspect-square overflow-hidden rounded-t-lg">
        <img
          src={thumbnail || "/placeholder.svg?height=300&width=300&query=product"}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder.svg?height=300&width=300"
          }}
        />
      </div>

      <CardContent className="flex-1 p-4">
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
              {discountPercentage > 0 && (
                <Badge variant="destructive" className="text-xs">
                  -{discountPercentage.toFixed(0)}%
                </Badge>
              )}
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

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(product)} className="flex-1">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(id)} className="flex-1">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
