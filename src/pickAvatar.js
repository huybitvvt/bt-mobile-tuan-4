import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { isUploadedAvatar } from './studentModel';

export async function pickAvatar() {
  if (Platform.OS !== 'web') {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) throw new Error('avatarPermission');
  }
  // On web, launch directly from the button press to keep browser user activation.
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'], allowsEditing: Platform.OS !== 'web', aspect: [1, 1], quality: 1,
  });
  if (result.canceled) return null;
  const asset = result.assets?.[0];
  if (!asset?.uri || !(asset.width > 0) || !(asset.height > 0)) throw new Error('avatarPickError');

  const context = ImageManipulator.manipulate(asset.uri);
  if (Math.max(asset.width, asset.height) > 256) {
    context.resize(asset.width >= asset.height ? { width: 256 } : { height: 256 });
  }
  const image = await context.renderAsync();
  const compressed = await image.saveAsync({ format: SaveFormat.JPEG, compress: 0.75, base64: true });
  const uri = `data:image/jpeg;base64,${compressed.base64 || ''}`;
  if (!isUploadedAvatar(uri)) throw new Error('avatarPickError');
  return uri;
}
