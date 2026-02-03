import React, { useState } from "react";
import { Text, View, SafeAreaView, Button, showToast } from "@/components";
import { useColors } from "@/hooks/useColors";
import { Image } from "expo-image";
import { useAuthStore } from "@/utils/auth-store";
import Feather from '@expo/vector-icons/Feather';
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { uploadImage } from "@/api/helper/upload-api";
import { updateVisitor } from "@/api/helper/update-account";

export function ProfileValidId() {
  const { visitor, getSession } = useAuthStore();
  const colors = useColors();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [8, 5],
      quality: 1
    });

    if (!result.canceled) {
      try {
        setLoading(true);
        setImage(result.assets[0].uri);
        const uploadData = await uploadImage(result.assets[0].uri);

        if (!uploadData.url) {
          showToast({
            type: "error",
            text1: "Ohh No! There's an Error!",
            text2: "Maybe the server is busy or sleeping 😅"
          });
          return;
        }

        setImage(uploadData.url);

        const data = await updateVisitor({
          id: visitor.id,
          fields: {
            valid_id_photo_url: uploadData.url
          }
        });

        if (data.error) {
          showToast({
            type: "error",
            text1: "Ohh No! There's an Error!",
            text2: data.error
          });
          return;
        }

        await getSession();
        showToast({
          type: "success",
          text1: "Account Updated",
          text2: data.message
        });
      } catch (error) {
        showToast({
          type: "error",
          text1: "Ohh No! There's an Error!",
          text2: error.response
            ? error.response.data.error
            : error.message
        });
      } finally {
        setLoading(false);
        setImage(null);
      }
    }
  };

  return (
    <View style={{
      flex: 1,
      marginTop: 20
    }}>
      <Text
        type="semibold"
        style={{
          fontSize: 18,
          marginBottom: 12
        }}
      >
        Valid ID
      </Text>
      {visitor.valid_id_photo_url || image ? (
        <View style={{
          position: 'relative'
        }}>
          <Image
            style={{
              width: 320,
              height: 200,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: colors.border,
            }}
            contentFit="contain"
            source={{
              uri: visitor.valid_id_photo_url || image
            }}
          />
          <Button onPress={!loading && pickImage} variant={'icon'} style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 5
          }}>
            {loading ? (
              <ActivityIndicator size={18} color={colors.gray} />
            ) : (
              <Feather name="edit" size={18} color={colors.text} />
            )}
          </Button>
        </View>
      ) : (
        <TouchableOpacity
          onPress={pickImage}
          activeOpacity={0.7}
          style={{
            width: 320,
            height: 200,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.border,
            justifyContent: 'center',
            alignItems: 'center',
            borderStyle: 'dotted',
            gap: 5
          }}>
          <Ionicons
            name="cloud-upload-outline"
            size={30}
            color={colors.textSecondary}
          />
          <Text type="secondary">Click here to upload your valid ID</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}