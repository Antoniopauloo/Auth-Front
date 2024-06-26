import { createContext, useContext, useEffect, useState } from "react"

import { api } from "../services/api"

export const AuthContext = createContext({})

function AuthProvider({ children }) {
  const [data, setData] = useState({})

  async function signIn({ email, password }) {
    try {
      const response = await api.post("/sessions", {email, password})
      const {user, token} = response.data

      localStorage.setItem("@Auth:user", JSON.stringify(user))
      localStorage.setItem("@Auth:token", token)

      setData({ user, token })

    } catch(error) {
      if(error.response) {
        return alert(error.response.data.message)
      } else {
        return alert("Não foi possível entrar :(")
      }
    }
  }

  function signOut() {
    localStorage.removeItem("@Auth:user")
    localStorage.removeItem("@Auth:token")

    setData({})
  }

  // signIn useEffect
  useEffect(() => {
    const user = localStorage.getItem("@Auth:user")
    const token = localStorage.getItem("@Auth:token")

    if(user && token) {
      setData({ token, user:JSON.parse(user) })
    }
  }, [])

  return(
    <AuthContext.Provider value={{ signIn, signOut ,user:data.user }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)
  return context
}

export { AuthProvider, useAuth }