'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  brand: string
  price: number
  img: string
  qty: number
}

interface CartCtx {
  isOpen: boolean
  items: CartItem[]
  openCart: () => void
  closeCart: () => void
  addItem: (item: Omit<CartItem, 'qty'>, qty: number) => void
  increment: (id: string) => void
  decrement: (id: string) => void
}

const CartContext = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])

  const openCart  = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const addItem = useCallback((item: Omit<CartItem, 'qty'>, qty: number) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + qty } : i)
      }
      return [...prev, { ...item, qty }]
    })
  }, [])

  const increment = useCallback((id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i))
  }, [])

  const decrement = useCallback((id: string) => {
    setItems(prev =>
      prev
        .map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i)
        .filter(i => i.qty > 0)
    )
  }, [])

  return (
    <CartContext.Provider value={{ isOpen, items, openCart, closeCart, addItem, increment, decrement }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
