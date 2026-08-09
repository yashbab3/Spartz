import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'sportz:favorite-team-ids'
const FavoritesContext = createContext(null)

function readInitialFavorites() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState(readInitialFavorites)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds))
    } catch {
      // Storage can fail (private browsing, quota, etc). Favorites simply
      // won't persist across reloads in that case — not worth surfacing.
    }
  }, [favoriteIds])

  const value = useMemo(
    () => ({
      favoriteIds,
      isFavorite: (teamId) => favoriteIds.includes(teamId),
      toggleFavorite: (teamId) =>
        setFavoriteIds((current) =>
          current.includes(teamId)
            ? current.filter((id) => id !== teamId)
            : [...current, teamId],
        ),
    }),
    [favoriteIds],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return ctx
}
