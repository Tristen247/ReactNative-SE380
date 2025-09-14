import { NavigatorScreenParams } from "@react-navigation/native";


export type RootTabParamList = {
  ScannerTab: NavigatorScreenParams<ScannerStackParamList>;
  FavoritesTab: undefined;
};

export type ScannerStackParamList = {
  QRScanner: undefined;
  ProductDetail: { url: string };
};

// Product from dummyjson.com/products/:id (subset we need)
export type Product = {
  id: number;
  title: string;
  price: number;
  images: string[];
};

// What we save in favorites
export type FavoriteItem = {
  id: number;
  title: string;
  price: number;
  image: string;   // first image
  url: string;     // original product URL (dummyjson.com/products/:id)
};
