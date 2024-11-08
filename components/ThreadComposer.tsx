import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "expo-router";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Colors } from "@/constants/Colors";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ImagePickerAsset, ImagePickerOptions } from "expo-image-picker";
import * as ImagePicker from "expo-image-picker";

type ThreadComposerProps = {
  isPreview?: boolean;
  isReply?: boolean;
  threadId?: Id<"messages">;
};

const ThreadComposer: React.FC<ThreadComposerProps> = ({
  isPreview,
  isReply,
  threadId,
}) => {
  const router = useRouter();
  const [Content, setContent] = useState("");
  const { userProfile } = useUserProfile();
  const addThread = useMutation(api.messages.addThread);
  const [mediaFiles, setMediaFiles] = useState<ImagePickerAsset[]>([]);
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);

  const handleSubmit = async () => {
    const mediaStorageIds = await Promise.all(
      mediaFiles.map((file) => uploadMediaFile(file))
    );
    // console.log("Media Ids: ", mediaStorageIds);
    addThread({ threadId, content: Content, mediaFiles: mediaStorageIds });
    setContent("");
    setMediaFiles([]);
    router.dismiss();
  };

  const handleCancel = () => {
    setContent("");
    Alert.alert("Discard thread?", "", [
      {
        text: "Discard",
        onPress: () => router.dismiss(),
        style: "destructive",
      },
      {
        text: "Save Draft",
        style: "cancel",
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const removeThread = () => {
    setContent("");
    setMediaFiles([]);
  };

  const selectImage = async (type: "camera" | "library") => {
    const options: ImagePickerOptions = {
      allowsEditing: true,
      aspect: [4, 3],
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    };

    let result;

    if (type === "camera") {
      //   const permission = await ImagePicker.requestCameraPermissionsAsync();

      result = await ImagePicker.launchCameraAsync(options);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled) {
      setMediaFiles([result.assets[0], ...mediaFiles]);
    }
  };

  const removeImage = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  const uploadMediaFile = async (image: ImagePickerAsset) => {
    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();

    // Convert URI to blob
    const response = await fetch(image!.uri);
    const blob = await response.blob();

    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": image!.mimeType! },
      body: blob,
    });
    const { storageId } = await result.json();
    return storageId;
  };

  return (
    <TouchableOpacity
      onPress={() => {
        router.push("/(auth)/(modal)/create");
      }}
      style={
        isPreview && {
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 100,
          pointerEvents: "box-only",
        }
      }
    >
      <View style={styles.topRow}>
        {userProfile?.imageUrl && (
          <Image
            source={{ uri: userProfile?.imageUrl as string }}
            style={styles.avatar}
          />
        )}
        <View style={styles.centerContainer}>
          <Text style={styles.name}>
            {userProfile?.first_name} {userProfile?.last_name}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={isReply ? "Reply to thread" : "What's new?"}
            value={Content}
            onChangeText={setContent}
            multiline
            autoFocus={!isPreview}
          />
          {mediaFiles.length > 0 && (
            <ScrollView horizontal>
              {mediaFiles.map((file, index) => (
                <View key={index} style={styles.mediaContainer}>
                  <Image source={{ uri: file.uri }} style={styles.mediaImage} />
                  <TouchableOpacity
                    style={styles.deleteIconContainer}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
          <View style={styles.iconRow}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => selectImage("library")}
            >
              <Ionicons name="images-outline" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => selectImage("camera")}
            >
              <Ionicons name="camera-outline" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="gif" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="mic-outline" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome6 name="hashtag" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons
                name="stats-chart-outline"
                size={24}
                color={Colors.border}
              />
            </TouchableOpacity>
          </View>

          {!isPreview && (
            <View style={[styles.keyboardAccessory]}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Post</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  {
                    backgroundColor: "#fff",
                    borderColor: "#000",
                    borderWidth: 1,
                  },
                ]}
                onPress={handleCancel}
              >
                <Text style={[styles.submitButtonText, { color: "#000" }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={removeThread}
          style={[styles.cancelButton, { opacity: isPreview ? 0 : 1 }]}
        >
          <Ionicons name="close" size={24} color={Colors.border} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  centerContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    fontSize: 16,
    maxHeight: 100,
  },
  cancelButton: {
    marginLeft: 12,
    alignSelf: "flex-start",
  },
  iconRow: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  iconButton: {
    marginRight: 16,
  },
  keyboardAccessory: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 12,
    // paddingLeft: 64,
    gap: 12,
  },
  keyboardAccessoryText: {
    flex: 1,
    color: Colors.border,
  },
  submitButton: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  mediaContainer: {
    position: "relative",
    marginRight: 10,
    marginTop: 10,
  },
  deleteIconContainer: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 4,
  },
  mediaImage: {
    width: 100,
    height: 200,
    borderRadius: 6,
    marginRight: 10,
    marginTop: 10,
  },
});

export default ThreadComposer;
