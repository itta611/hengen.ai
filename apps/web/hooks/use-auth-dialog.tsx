"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

type AuthDialogContextValue = {
  authCallbackURL: string
  isAuthDialogOpen: boolean
  setAuthDialogOpen: (open: boolean) => void
  openAuthDialog: (options?: { callbackURL?: string }) => void
  closeAuthDialog: () => void
}

const AuthDialogContext = createContext<AuthDialogContextValue | null>(null)

export function AuthDialogProvider({ children }: { children: ReactNode }) {
  const [authCallbackURL, setAuthCallbackURL] = useState("/home")
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false)

  const openAuthDialog = useCallback((options?: { callbackURL?: string }) => {
    setAuthCallbackURL(options?.callbackURL ?? "/home")
    setAuthDialogOpen(true)
  }, [])

  const closeAuthDialog = useCallback(() => {
    setAuthDialogOpen(false)
  }, [])

  const value = useMemo(
    () => ({
      authCallbackURL,
      isAuthDialogOpen,
      setAuthDialogOpen,
      openAuthDialog,
      closeAuthDialog,
    }),
    [authCallbackURL, closeAuthDialog, isAuthDialogOpen, openAuthDialog]
  )

  return (
    <AuthDialogContext.Provider value={value}>
      {children}
    </AuthDialogContext.Provider>
  )
}

export function useAuthDialog() {
  const context = useContext(AuthDialogContext)

  if (!context) {
    throw new Error("useAuthDialog must be used within AuthDialogProvider")
  }

  return context
}
