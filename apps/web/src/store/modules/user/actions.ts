import type { JwtPayload } from 'jwt-decode';
import jwtDecode from 'jwt-decode';

import { SpaceConnector } from '@cloudforet/core-lib/space-connector';

import type { ListResponse } from '@/schema/_common/api-verbs/list';
import type { RoleListParameters } from '@/schema/identity/role/api-verbs/list';
import type { RoleModel } from '@/schema/identity/role/model';
import { setI18nLocale } from '@/translations';

// eslint-disable-next-line import/no-cycle
import { useWorkspaceStore } from '@/store/app-context/workspace/workspace-store';

import type {
    UserState, SignInRequest, UpdateUserRequest, UserRole,
} from './type';


const getUserInfo = async (userId: string, domainId: string): Promise<Partial<UserState>> => {
    const response = await SpaceConnector.clientV2.identity.user.get({
        user_id: userId,
        domain_id: domainId,
    });
    // TODO: refactor below code with new response
    return {
        userId: response.user_id,
        userType: response.user_type,
        roleType: response.role_type,
        authType: response.auth_type,
        name: response.name,
        email: response.email,
        language: response.language,
        timezone: response.timezone,
        requiredActions: response.required_actions,
        // email_verified : There is data only when the value is true.
        emailVerified: !!response.email_verified,
        mfa: response.mfa,
    };
};

const updateUser = async (userId: string, userType: string, userRequest: UpdateUserRequest): Promise<void> => {
    const request: any = {};
    request.user_id = userId;

    if (userRequest.name) request.name = userRequest.name;
    if (userRequest.password) request.password = userRequest.password;
    if (userRequest.email) request.email = userRequest.email;
    if (userRequest.language) request.language = userRequest.language;
    if (userRequest.timezone) request.timezone = userRequest.timezone;
    if (userRequest.tags) request.tags = userRequest.tags;

    await SpaceConnector.clientV2.identity.user.update(request);
};

interface JWTPayload extends JwtPayload {
    user_type: string
}
const getUserInfoFromToken = (token: string): string[] => {
    const decodedToken = jwtDecode<JWTPayload>(token);
    return [decodedToken.user_type, decodedToken.aud as string];
};

const getUserRoles = async (domainId): Promise<Array<UserRole>> => {
    try {
        const userRoles: Record<string, UserRole> = {};
        const { results } = await SpaceConnector.clientV2.identity.role.list<RoleListParameters, ListResponse<RoleModel>>({
            domain_id: domainId,
        });

        if (!results) return [];

        // TODO: refactor below logic with new response
        results.forEach((role) => {
            const roleId = role.role_id;
            if (!userRoles[roleId]) {
                userRoles[roleId] = {
                    roleId,
                    name: role.name,
                    roleType: role.role_type,
                    pagePermissions: role.page_permissions,
                };
            }
        });

        return Object.values(userRoles);
    } catch (e) {
        console.error(`RoleBinding Load Error: ${e}`);
        return [];
    }
};

export const signIn = async ({ commit }, signInRequest: SignInRequest): Promise<void> => {
    const domainId = signInRequest.domainId;
    const response = await SpaceConnector.clientV2.identity.token.issue({
        domain_id: domainId,
        auth_type: signInRequest.authType,
        credentials: signInRequest.credentials,
        verify_code: signInRequest.verify_code,
    }, { skipAuthRefresh: true });

    SpaceConnector.setToken(response.access_token, response.refresh_token);

    const [, userId] = getUserInfoFromToken(response.access_token);

    const userInfo = await getUserInfo(userId, domainId);
    commit('setUser', userInfo);

    const userRoles = await getUserRoles(domainId);
    commit('setRoles', userRoles);

    const workspaceStore = useWorkspaceStore();
    await workspaceStore.load(userId);

    commit('setIsSessionExpired', false);
};

export const signOut = (): void => {
    SpaceConnector.flushToken();
};

export const setIsSessionExpired = ({ commit }, isExpired?: boolean): void => {
    commit('setIsSessionExpired', isExpired);
};

export const setUser = async ({ commit, state }, userRequest: UpdateUserRequest): Promise<void> => {
    await updateUser(state.userId, state.userType, userRequest);

    const convertRequestType = (): UserState => ({
        userId: userRequest.user_id || state.userId,
        name: userRequest.name || state.name,
        email: userRequest.email || state.email,
        language: userRequest.language || state.language,
        timezone: userRequest.timezone || state.timezone,
        emailVerified: userRequest.email_verified !== undefined ? userRequest.email_verified : state.emailVerified,
        mfa: userRequest.mfa || state.mfa,
    });

    commit('setUser', { ...state, ...convertRequestType() });
    commit('setTimezone', userRequest.timezone);
    if (userRequest.language) {
        commit('setLanguage', userRequest.language);
        await setI18nLocale(userRequest.language);
    }
};

export const startSignIn = ({ commit }) => {
    commit('setIsSignInLoading', true);
};

export const finishSignIn = ({ commit }) => {
    commit('setIsSignInLoading', false);
};
