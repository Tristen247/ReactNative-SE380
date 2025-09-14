import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ScannerStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<ScannerStackParamList, 'QRScanner'>;

export default function QRScanner({ navigation }: Props) {
  // ✅ All hooks at the top, every render
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  // ✅ Define callbacks BEFORE any conditional return, so hook order never changes
  const onScan = useCallback((result: BarcodeScanningResult) => {
    setScanned(true);
    navigation.navigate('ProductDetail', { url: result.data });
  }, [navigation]);

  // UI branches happen AFTER hooks
  if (!permission) {
    return <View style={styles.center}><Text>Requesting permission…</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}   // QR only
        onBarcodeScanned={scanned ? undefined : onScan}
        facing="back"
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
            <Text style={styles.buttonText}>Scan another</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  overlay: { position: 'absolute', bottom: 40, alignSelf: 'center' },
  button: { backgroundColor: '#111827', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10 },
  buttonText: { color: 'white', fontWeight: '600' },
});
