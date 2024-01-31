import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import storage from 'redux-persist/es/storage';
// import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import userStateTransform from '../transforms/userStateTransform';

import usersReducer, { UserState } from './usersReducer';
import servicesReducer, { IService } from './serviceReducer';
import audioReducer, { AudioType } from './audioReducer';
import conversationsReducer, { IcurrentConvo } from './conversationReducer';
import babeReducer, { IBabe } from './babeReducer';
import drawerOpenReducer from './drawerOpenReducer';
// import clubAdminReducer, { ClubAdminState } from './club-admin-reducer';
// import audioReducer from './audio-reducer';
// import selectedUserReducer from './selected-user-reducer';
// import selectedConversationReducer from './selected-conversation-reducer';
// import conversationStateTransform from '../transforms/conversations-state-transform';

const userPersistConfig = {
  key: 'user',
  storage: storage,
  stateReconciler: autoMergeLevel1,
  whitelist: ['currentUser'],
  transforms: [userStateTransform],
};
const servicesPersistConfig = {
  key: 'services',
  storage: storage,
  stateReconciler: autoMergeLevel1,
};
const audioPersistConfig = {
  key: 'audio',
  storage: storage,
  stateReconciler: autoMergeLevel1,
};
const conversationsPersistConfig = {
  key: 'conversations',
  storage: storage,
  stateReconciler: autoMergeLevel1,
};
const babePersistConfig = {
  key: 'babe',
  storage: storage,
  stateReconciler: autoMergeLevel1,
};
// const clubAdminPersistConfig = {
// 	key: 'clubAdmin',
// 	storage: storage,
// 	stateReconciler: autoMergeLevel1,
// };

export const combinedReducer = combineReducers({
  user: persistReducer<UserState>(userPersistConfig, usersReducer),
  services: persistReducer<IService>(servicesPersistConfig, servicesReducer),
  audio: persistReducer<AudioType>(audioPersistConfig, audioReducer),
  conversations: persistReducer<IcurrentConvo>(conversationsPersistConfig, conversationsReducer),
  babe: persistReducer<IBabe>(babePersistConfig, babeReducer),

  drawerOpen: drawerOpenReducer,
  // clubAdmin: persistReducer<ClubAdminState>(clubAdminPersistConfig, clubAdminReducer),
  // audio: audioReducer,
  // selectedUser: selectedUserReducer,
  // selectedConversation: selectedConversationReducer,
});
