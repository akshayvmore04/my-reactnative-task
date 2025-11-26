import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useFavorites } from "../context/FavoritesContext";
import { Product } from "../types";
import { router } from "expo-router";

// ---------- helpers ----------
const isPrime = (n: number): boolean => {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  const limit = Math.floor(Math.sqrt(n));
  for (let i = 3; i <= limit; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
};

const countVowels = (text: string): number =>
  (text.toLowerCase().match(/[aeiou]/g) || []).length;

const calculatePrice = (title: string, description: string): number =>
  title.length * 10 + countVowels(description);

const formatCurrency = (amount: number): string =>
  `$${amount.toFixed(2)}`;

// ---------- main component ----------
export default function Saved() {
  const { favorites, toggleFavorite } = useFavorites();

  if (!favorites.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No saved items</Text>
        <Text style={styles.emptySubtitle}>
          Tap the heart icon on items in the Feed to save them here.
        </Text>
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: Product; index: number }) => {
    const prime = isPrime(index);
    const price = calculatePrice(item.title, item.description);
    const formattedPrice = formatCurrency(price);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: "/detail",
            params: {
              title: item.title,
              description: item.description,
              image: item.image,
            },
          })
        }
      >
        <View style={[styles.card, prime && styles.primeCard]}>
          <Image source={{ uri: item.image }} style={styles.image} />
          {prime && <Text style={styles.primeBadge}>👑 Prime Index</Text>}

          <View style={styles.cardContent}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>

            <View style={styles.cardFooter}>
              <Text style={styles.price}>{formattedPrice}</Text>

              <TouchableOpacity
                style={styles.heartButton}
                onPress={() => toggleFavorite(item)}
              >
                <Text style={[styles.heartText, styles.heartActive]}>
                  ♥
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Saved Items</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}

// ---------- styles ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    paddingTop: 40,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    paddingHorizontal: 16,
    color: "white",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#111827",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  emptySubtitle: {
    color: "#9ca3af",
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    backgroundColor: "#1f2933",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    position: "relative",
  },
  primeCard: {
    borderWidth: 2,
    borderColor: "gold",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  primeBadge: {
    position: "absolute",
    top: 6,
    right: 10,
    fontSize: 12,
    color: "gold",
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  description: {
    marginTop: 4,
    fontSize: 12,
    color: "#9ca3af",
  },
  cardFooter: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
  },
  heartButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  heartText: {
    fontSize: 20,
  },
  heartActive: {
    color: "red",
  },
});
