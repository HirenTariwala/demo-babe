import { createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc } from 'firebase/firestore';
import { USERS } from '@/keys/firestoreKeys';
import { db } from '@/credentials/firebase';
import { ProfileHelper } from '@/utility/profileHelper';

const fetchUserData = createAsyncThunk('user/fetchUserData', async (uid: string, thunkAPI) => {
  const docRef = doc(db, USERS, uid);
  try {
    const snapshot = await getDoc(docRef);
    const profile = ProfileHelper.getUserProfile(snapshot);
    return profile;
  } catch (error) {
    return thunkAPI.rejectWithValue(JSON.stringify(error));
  }
});

export default fetchUserData;
