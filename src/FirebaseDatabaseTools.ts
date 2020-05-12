import axios from "axios";
import { FirebaseConfig, parseError } from "./FirebaseTools";

function toArray(dictData: any) {
  const arrayData = [];
  for (const id in dictData) {
    arrayData.push({ ...dictData[id], id });
  }
  return arrayData;
}

export async function fetchAll(
  endpoint: string,
  firebaseConfig: FirebaseConfig,
  options = { toArray: true }
) {
  const url = `https://${firebaseConfig.projectId}.firebaseio.com/${endpoint}.json`;

  try {
    const response = await axios.get(url);
    return options.toArray ? toArray(response.data) : response.data;
  } catch (error) {
    throw parseError(error);
  }
}

export async function fetchItem(
  endpoint: string,
  id: string,
  firebaseConfig: FirebaseConfig,
  options = {}
) {
  const url = `https://${firebaseConfig.projectId}.firebaseio.com/${endpoint}/${id}.json`;
  try {
    const response = await axios.get(url);
    return { ...response.data, id };
  } catch (error) {
    throw parseError(error);
  }
}
