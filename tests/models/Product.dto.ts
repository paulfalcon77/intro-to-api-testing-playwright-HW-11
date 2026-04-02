import { z } from 'zod'

export interface IProduct {
  id: number
  name: string
  price: number
  createdAt: string | null
}

export class Product {
  id: number
  name: string
  price: number
  createdAt: string | null

  constructor(data: IProduct) {
    this.id = data.id
    this.name = data.name
    this.price = data.price
    this.createdAt = data.createdAt
  }
  static createNewArray(data: IProduct[]): Product[] {
    const result: Product[] = []
    for (let i: number = 0; i < data.length; i++) {
      const product = new Product(data[i])
      result.push(product)
    }
    return result
  }

  static generateDefault(): Product {
    return new Product({
      id: 0,
      name: 'test lesson 11',
      price: 124523643,
      createdAt: new Date().toISOString(),
    })
  }

  static generateCustom(name: string, price: number): Product {
    return new Product({
      id: 0,
      name,
      price,
      createdAt: new Date().toISOString(),
    })
  }
}

export const ProductSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    createdAt: z.string().nullable(),
  })
  .strict()

export type ProductType = z.infer<typeof ProductSchema>
