import { useState } from 'react';
import { Directory, File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export function useSaveImage() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveGatepass = async (uri: string) => {
    try {
      setSaving(true);
      setError(null);

      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        throw new Error('Media library permission denied');
      }

      const asset = await MediaLibrary.createAssetAsync(uri);

      const albumName = 'LCC Gatepass QR';
      await MediaLibrary.createAlbumAsync(albumName, asset, false);

      return true;
    } catch (err) {
      setError(err.message ?? 'Failed to save image');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    saveGatepass,
    saving,
    error,
  };
}
