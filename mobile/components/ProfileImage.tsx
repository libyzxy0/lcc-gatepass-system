import React, { useState } from "react";
import { View, Button, showToast } from "@/components";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { Alert, ActivityIndicator } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Image } from "expo-image";
import { uploadImage } from "@/api/helper/upload-api";
import { updateVisitor } from "@/api/helper/update-account";
import avatar from '@/assets/images/avatar.png'

export function ProfileImage({ url, id }: { url: string | null; id: string; }) {
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
            aspect: [5, 5],
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
                    id: id,
                    fields: {
                        photo_url: uploadData.url
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
            }
        }
    };

    return (
        <View
            style={{
                position: "relative"
            }}
        >
            <Image
                source={image || url ? { uri: image ?? url } : avatar}
                style={{
                    width: 70,
                    height: 70,
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: colors.primary
                }}
            />
            <Button
                onPress={pickImage}
                variant="icon"
                style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border
                }}
            >
                {loading ? (
                    <ActivityIndicator size={14} color={colors.primary} />
                ) : (
                    <Ionicons
                        name="cloud-upload-outline"
                        size={12}
                        color={colors.text}
                    />
                )}
            </Button>
        </View>
    );
}
