import React, { useCallback } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFavorites } from '../context/FavoritesContext';
import type { RootTabParamList, ScannerStackParamList } from '../types/navigation';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type Nav = BottomTabNavigationProp<RootTabParamList, 'FavoritesTab'>;

export default function FavoritesScreen() {
  const navigation = useNavigation<Nav>();
  const { favorites } = useFavorites();

  const openDetail = useCallback((url: string) => {
    navigation.navigate('ScannerTab', {
      screen: 'ProductDetail',
      params: { url },
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
            data={favorites}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.empty}>No favorites yet.</Text>}
            renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => openDetail(item.url)}>
                <Image source={{ uri: item.image }} style={styles.thumb} />
                <View style={{ flex: 1 }}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.price}>${item.price}</Text>
                </View>
            </TouchableOpacity>
            )}
        />
      </SafeAreaView>  
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: 12 },
  empty: { textAlign: 'center', marginTop: 100, color: '#6b7280' },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'white', padding: 12, borderRadius: 12, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  thumb: { width: 60, height: 60, marginRight: 12, borderRadius: 8, backgroundColor: '#e5e7eb' },
  title: { fontSize: 16, fontWeight: '600', color: '#111827' },
  price: { marginTop: 4, fontWeight: '700', color: '#16a34a' },
});
