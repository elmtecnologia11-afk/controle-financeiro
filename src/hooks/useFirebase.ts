import { useState, useEffect } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { auth, db, loginAnonymous } from '../firebase'
import type { Expense } from '../types'

const COLLECTION = 'expenses'

export function useFirebase() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, COLLECTION),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsub = onSnapshot(q, (snapshot) => {
      const list: Expense[] = snapshot.docs.map((d) => ({
        ...(d.data() as Omit<Expense, 'id'>),
        id: d.id,
      }))
      setExpenses(list)
    })

    return unsub
  }, [user])

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    if (!user) return
    try {
      await addDoc(collection(db, COLLECTION), expense)
    } catch (e: any) {
      setError(e.message)
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      await deleteDoc(doc(db, COLLECTION, id))
    } catch (e: any) {
      setError(e.message)
    }
  }

  const signIn = async () => {
    try {
      setLoading(true)
      await loginAnonymous()
    } catch (e: any) {
      setError(e.message)
      setLoading(false)
    }
  }

  return { user, loading, expenses, addExpense, deleteExpense, signIn, error }
}
