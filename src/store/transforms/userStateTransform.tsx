import { createTransform } from 'redux-persist';
import { User } from 'firebase/auth';
import { UserState } from '../reducers/usersReducer';
import { UserProps } from '../../props/userProps';
import { RBACEnum } from '../../enum/myEnum';
import { RBACType } from '../../props/types/rbacType';

type PersistedUserProps = Omit<UserProps, 'userRBAC'> & { userRBAC: string };
type UserPersistedState = {
  currentUser: PersistedUserProps | undefined;
  firebaseUser: User | null;
  loading?: boolean;
  error?: any;
};
const userStateTransform = createTransform<UserState, UserPersistedState>(
  // transform state on its way to being serialized and persisted.
  (inboundState: UserState) =>
    ({
      ...inboundState,
      currentUser: {
        ...inboundState.currentUser,
        userRBAC: inboundState.currentUser?.userRBAC?.valueOf() || 'user',
      },
    } as UserPersistedState),
  // transform state being rehydrated
  (outboundState: UserPersistedState) =>
    ({
      ...outboundState,
      currentUser: {
        ...outboundState.currentUser,
        userRBAC: RBACEnum[(outboundState.currentUser?.userRBAC as RBACType) ?? RBACEnum.user],
      },
    } as UserState),
  // define which reducers this transform gets called for.
  { whitelist: ['user'] }
);

export default userStateTransform;
