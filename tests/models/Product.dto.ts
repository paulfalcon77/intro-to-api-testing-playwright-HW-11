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
}
