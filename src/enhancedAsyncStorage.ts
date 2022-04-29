import AsyncStorage from "@react-native-async-storage/async-storage";

async function getItem<T>(
  key: string,
  fallbackValue?: T,
  validator: (value: any) => boolean = () => true
) {
  let json: any = undefined;

  try {
    const raw = await AsyncStorage.getItem(key);

    if (raw !== null) {
      json = JSON.parse(raw);
    }
  } catch (_) {}

  if (typeof json !== undefined && validator(json)) {
    return json as T;
  }

  return fallbackValue;
}

function setItem(key: string, value: any) {
  return AsyncStorage.setItem(key, JSON.stringify(value));
}

function removeItem(key: string) {
  return AsyncStorage.removeItem(key);
}

const enhancedAsyncStorage = { getItem, setItem, removeItem };

export default enhancedAsyncStorage;
