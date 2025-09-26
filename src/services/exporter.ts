import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { EXPORT_FILE_PREFIX } from '../utils/constants';
import { RootState } from '../store/rootReducer';

export const exportStateToJson = async (state: RootState): Promise<string> => {
  const payload = {
    goal: state.goal.goal,
    entries: state.entries.entries,
    settings: state.settings.settings,
  };
  const json = JSON.stringify(payload, null, 2);
  const filename = `${EXPORT_FILE_PREFIX}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.json`;
  const uri = `${FileSystem.cacheDirectory}${filename}`;
  await FileSystem.writeAsStringAsync(uri, json, { encoding: FileSystem.EncodingType.UTF8 });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { mimeType: 'application/json' });
  }
  return uri;
};
