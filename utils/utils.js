import AsyncStorage from "@react-native-async-storage/async-storage";
import * as EncryptedStorage from "expo-secure-store";

export async function getAsyncStorageValue(label) {
  try {
    const session = await AsyncStorage.getItem("General");
    if (label in JSON.parse(session)) {
      return JSON.parse(session)[label];
    } else {
      return null;
    }
  } catch {
    return null;
  }
}

export async function setAsyncStorageValue(value) {
  const session = await AsyncStorage.getItem("General");
  await AsyncStorage.setItem(
    "General",
    JSON.stringify({
      ...JSON.parse(session),
      ...value,
    })
  );
}

export async function getEncryptedStorageValue(label) {
  try {
    const session = await EncryptedStorage.getItem("General");
    if (label in JSON.parse(session)) {
      return JSON.parse(session)[label];
    } else {
      return null;
    }
  } catch {
    try {
      const session = await AsyncStorage.getItem("GeneralBackup");
      if (label in JSON.parse(session)) {
        return JSON.parse(session)[label];
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }
}

export async function setEncryptedStorageValue(value) {
  try {
    const session = await EncryptedStorage.getItem("General");
    await EncryptedStorage.setItem(
      "General",
      JSON.stringify({
        ...JSON.parse(session),
        ...value,
      })
    );
  } catch {
    const session = await AsyncStorage.getItem("GeneralBackup");
    await AsyncStorage.setItem(
      "GeneralBackup",
      JSON.stringify({
        ...JSON.parse(session),
        ...value,
      })
    );
  }
}