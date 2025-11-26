// context/FavoritesContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "../types";

const STORAGE_KEY = "@saved_products";

type FavoritesState = {
  favorites: Product[];
  loading: boolean;
};

type FavoritesContextType = {
  favorites: Product[];
  loading: boolean;
  toggleFavorite: (item: Product) => void;
  isFavorite: (id: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

const initialState: FavoritesState = {
  favorites: [],
  loading: true,
};

type Action =
  | { type: "SET_FAVORITES"; payload: Product[] }
  | { type: "TOGGLE_FAVORITE"; payload: Product };

const reducer = (state: FavoritesState, action: Action): FavoritesState => {
  switch (action.type) {
    case "SET_FAVORITES":
      return { ...state, favorites: action.payload, loading: false };
    case "TOGGLE_FAVORITE": {
      const exists = state.favorites.find(
        (item) => item.id === action.payload.id
      );
      let updated: Product[];
      if (exists) {
        updated = state.favorites.filter(
          (item) => item.id !== action.payload.id
        );
      } else {
        updated = [...state.favorites, action.payload];
      }
      return { ...state, favorites: updated };
    }
    default:
      return state;
  }
};

export const FavoritesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load from storage on app start
  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: Product[] = JSON.parse(stored);
          dispatch({ type: "SET_FAVORITES", payload: parsed });
        } else {
          dispatch({ type: "SET_FAVORITES", payload: [] });
        }
      } catch (e) {
        console.warn("Failed to load favorites", e);
        dispatch({ type: "SET_FAVORITES", payload: [] });
      }
    };

    load();
  }, []);

  // Save whenever favorites change
  useEffect(() => {
    if (!state.loading) {
      AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state.favorites)
      ).catch((e) => console.warn("Failed to save favorites", e));
    }
  }, [state.favorites, state.loading]);

  const toggleFavorite = (item: Product) => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: item });
  };

  const isFavorite = (id: number) => {
    return state.favorites.some((item) => item.id === id);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites: state.favorites,
        loading: state.loading,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }
  return ctx;
};
