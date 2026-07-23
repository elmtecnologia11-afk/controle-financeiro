import { useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
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
import { auth, db } from '../firebase'
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

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError('')
      await signInWithEmailAndPassword(auth, email, password)
    } catch (e: any) {
      setLoading(false)
      if (e.code === 'auth/invalid-credential') {
        setError('Email ou senha incorretos')
      } else {
        setError(e.message)
      }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError('')
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (e: any) {
      setLoading(false)
      if (e.code === 'auth/email-already-in-use') {
        setError('Este email já está cadastrado')
      } else if (e.code === 'auth/weak-password') {
        setError('Senha muito fraca (mínimo 6 caracteres)')
      } else {
        setError(e.message)
      }
    }
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  return { user, loading, expenses, addExpense, deleteExpense, login, signUp, signOut, error }
}
