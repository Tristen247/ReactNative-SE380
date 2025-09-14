import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { Product, ScannerStackParamList } from '../types/navigation';
import { useFavorites } from '../context/FavoritesContext';

type Props = NativeStackScreenProps<ScannerStackParamList, 'ProductDetail'>;

export default function ProductDetail({ route, navigation }: Props) {
  const { url } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Extract ID if URL is like https://dummyjson.com/products/1
  const productId = useMemo(() => {
    const match = url.match(/products\/(\d+)/);
    return match ? Number(match[1]) : undefined;
  }, [url]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Product',
    });
  }, [navigation]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(productId ? `https://dummyjson.com/products/${productId}` : url);
        const data = (await res.json()) as Product;
        if (alive) setProduct(data);
      } catch (e) {
        Alert.alert('Error', 'Failed to load product.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [productId, url]);

  const onToggleFavorite = useCallback(async () => {
    if (!product) return;
    await toggleFavorite({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] ?? '',
      url: `https://dummyjson.com/products/${product.id}`,
    });
  }, [product, toggleFavorite]);

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;
  if (!product) return <View style={styles.center}><Text>Not found.</Text></View>;

  const fav = isFavorite(product.id);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.imageWrap}>
        {!!product.images?.[0] && (
          <Image source={{ uri: product.images[0] }} style={styles.image} resizeMode="cover" />
        )}
        <TouchableOpacity style={styles.heart} onPress={onToggleFavorite} accessibilityLabel="Toggle favorite">
          <Ionicons name={fav ? 'heart' : 'heart-outline'} size={28} color={fav ? '#ef4444' : '#111827'} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>${product.price}</Text>

      {/* Example fluff to make it portfolio-worthy */}
      <Text style={styles.subtle}>ID: {product.id}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16 },
  imageWrap: { position: 'relative', borderRadius: 16, overflow: 'hidden', backgroundColor: '#e5e7eb' },
  image: { width: '100%', height: 260 },
  heart: { position: 'absolute', right: 12, top: 12, backgroundColor: 'white', borderRadius: 20, padding: 6 },
  title: { marginTop: 16, fontSize: 22, fontWeight: '700', color: '#111827' },
  price: { marginTop: 8, fontSize: 20, fontWeight: '600', color: '#16a34a' },
  subtle: { marginTop: 6, color: '#6b7280' },
});
