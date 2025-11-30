import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  Animated,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Product } from "../types";
import { useFavorites } from "../context/FavoritesContext";
import { router } from "expo-router";
import { isPrime, calculatePrice, formatCurrency } from "../utils/mathUtils";

// ---------- row component with swipe + fade ----------
type ProductRowProps = {
  item: Product;
  index: number;
  onDelete: (id: number) => void;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (item: Product) => void;
};

const ProductRow = ({
  item,
  index,
  onDelete,
  isFavorite,
  toggleFavorite,
}: ProductRowProps) => {
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const handleDelete = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onDelete(item.id);
    });
  };
  const handleHeartPress = () => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.3,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    toggleFavorite(item);
  };

  const prime = isPrime(index+1);
  const priceNumber = calculatePrice(item.title, item.description);
  const formattedPrice = formatCurrency(priceNumber);

  const renderRightActions = () => (
    <View style={styles.deleteBox}>
      <Text style={styles.deleteText}>Delete</Text>
    </View>
  );

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      onSwipeableOpen={handleDelete}
    >
     <TouchableOpacity
  activeOpacity={0.8}
  onPress={() =>
    // Navigate to detail screen with item data
    // (you’ll import router at the top)
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
  <Animated.View
    style={[styles.card, prime && styles.primeCard, { opacity }]}
  >

        <Image source={{ uri: item.image }} style={styles.image} />
        {prime && <Text style={styles.primeBadge}>👑 Prime Index</Text>}

        <View style={styles.cardContent}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          <View className="cardFooter" style={styles.cardFooter}>
            <Text style={styles.price}>{formattedPrice}</Text>

           <Animated.View style={{ transform: [{ scale }] }}>
  <TouchableOpacity
    style={styles.heartButton}
    onPress={handleHeartPress}
  >
    <Text
      style={[
        styles.heartText,
        isFavorite(item.id) && styles.heartActive,
      ]}
    >
      {isFavorite(item.id) ? "♥" : "♡"}
    </Text>
  </TouchableOpacity>
</Animated.View>

          </View>
        </View>
      </Animated.View>
</TouchableOpacity>
    </Swipeable>
  );
};

// ---------- main screen ----------
export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "https://fakestoreapi.com/products?limit=20"
        );
        const data = await response.json();

        const mapped: Product[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.image,
        }));

        setProducts(mapped);
      } catch (e) {
        console.log(e);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8, color: "white" }}>
          Loading products...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 8, color: "white" }}>{error}</Text>
        <Text style={{ color: "#9ca3af" }}>
          Check your internet and reload the app.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.screenTitle}>Feed</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <ProductRow
            item={item}
            index={index}
            onDelete={handleDelete}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
          />
        )}
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111827",
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    paddingHorizontal: 16,
    color: "#ffffff",
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
    color: "#ffffff",
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
    color: "#ffffff",
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
  deleteBox: {
    width: 80,
    backgroundColor: "#b91c1c",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 6,
    borderRadius: 12,
    marginRight: 12,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
});
