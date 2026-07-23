import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBkPGaALC-WpulKtUh7vrWswqZ0dd79jAM",
  authDomain: "controle-financeiro-847fb.firebaseapp.com",
  projectId: "controle-financeiro-847fb",
  storageBucket: "controle-financeiro-847fb.firebasestorage.app",
  messagingSenderId: "1011783664209",
  appId: "1:1011783664209:web:d735e1b36909fb88eaee70"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

export function loginAnonymous() {
  return signInAnonymously(auth)
}
