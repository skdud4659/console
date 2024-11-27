import { SpaceConnector } from '@cloudforet/core-lib/space-connector';
import TokenAPI from '@cloudforet/core-lib/space-connector/token-api';
import type { DevConfig, MockConfig, AuthConfig } from '@cloudforet/core-lib/space-connector/type';

import type { TokenGrantParameters } from '@/schema/identity/token/api-verbs/grant';
import type { TokenGrantModel } from '@/schema/identity/token/model';

import { useErrorStore } from '@/store/error/error-store';
import { pinia } from '@/store/pinia';
import { useAllReferenceStore } from '@/store/reference/all-reference-store';


const getAfterCallApiMap = () => ({
    '/inventory/cloud-service-type/create': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('cloud_service_type', data);
    },
    '/inventory/cloud-service-type/update': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('cloud_service_type', data);
    },
    '/inventory/collector/create': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('collector', data);
    },
    '/inventory/collector/update': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('collector', data);
    },
    '/repository/plugin/create': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('plugin', data);
    },
    '/repository/plugin/update': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('plugin', data);
    },
    '/identity/project/create': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('project', data);
    },
    '/identity/project/update': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('project', data);
    },
    '/identity/project/delete': () => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.load('project', { force: true });
    },
    '/identity/project/change-project-group': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('project', data);
    },
    '/identity/project/add-users': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('project', data);
    },
    '/identity/project/remove-users': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('project', data);
    },
    '/identity/project-group/create': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('project_group', data);
    },
    '/identity/project-group/update': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('project_group', data);
    },
    '/identity/project-group/delete': () => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.load('project_group', { force: true });
    },
    '/identity/project-group/change-parent-group': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('project_group', data);
    },
    '/identity/project-group/add-users': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('project_group', data);
    },
    '/identity/project-group/remove-users': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('project_group', data);
    },
    '/notification/protocol/create': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('protocol', data);
    },
    '/notification/protocol/update': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('protocol', data);
    },
    '/identity/provider/create': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('provider', data);
    },
    '/identity/provider/update': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('provider', data);
    },
    '/identity/role/create': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('role', data);
    },
    '/identity/role/update': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('role', data);
    },
    '/inventory/region/create': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('region', data);
    },
    '/inventory/region/update': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('region', data);
    },
    '/inventory/namespace/create': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('namespace', data);
    },
    '/inventory/namespace/update': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('namespace', data);
    },
    '/inventory/metric/create': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('metric', data);
    },
    '/inventory/metric/update': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('metric', data);
    },
    '/inventory/metric/delete': () => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.load('metric', { force: true });
    },
    '/secret/secret/create': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('secret', data);
    },
    '/secret/secret/update': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('secret', data);
    },
    '/identity/service-account/create': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('service_account', data);
    },
    '/identity/service-account/update': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('service_account', data);
    },
    '/identity/user/create': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('user', data);
    },
    '/identity/user/update': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('user', data);
    },
    '/monitoring/webhook/create': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('webhook', data);
    },
    '/monitoring/webhook/update': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('webhook', data);
    },
    '/dashboard/public-dashboard/create': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('public_dashboard', data);
    },
    '/dashboard/public-dashboard/update': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('public_dashboard', data);
    },
    '/dashboard/public-dashboard/share': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('public_dashboard', data);
    },
    '/dashboard/public-dashboard/unshare': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('public_dashboard', data);
    },
    '/dashboard/public-folder/create': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('public_folder', data);
    },
    '/dashboard/public-folder/update': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('public_folder', data);
    },
    '/dashboard/public-folder/share': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('public_folder', data);
        allReferenceStore.load('public_dashboard', { force: true });
    },
    '/dashboard/public-folder/unshare': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('public_folder', data);
        allReferenceStore.load('public_dashboard', { force: true });
    },
    '/identity/token/grant': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('role', data);
    },
    '/identity/workspace-group/create': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('workspace_group', data);
    },
    '/identity/workspace-group/update': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('workspace_group', data);
    },
    '/identity/workspace-group/delete': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('workspace_group', data);
    },
    '/identity/workspace/create': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('workspace', data);
    },
    '/identity/workspace/update': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('workspace', data);
    },
    '/identity/workspace/delete': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('workspace', data);
    },
    '/identity/workspace/add-package': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('workspace', data);
    },
    '/identity/workspace/remove-package': (data) => {
        useAllReferenceStore(pinia);
        const allReferenceStore = useAllReferenceStore();
        allReferenceStore.sync('workspace', data);
    },
});

const getSessionTimeoutCallback = (store) => () => {
    // Add session expiration process
    store.dispatch('user/setIsSessionExpired', true);

    const errorStore = useErrorStore(pinia);
    errorStore.showSessionExpiredError();
};
const getApiEndpoints = (config) => {
    const ENDPOINT_V1 = config.get('CONSOLE_API.ENDPOINT');
    const ENDPOINT_V2 = config.get('CONSOLE_API_V2.ENDPOINT');
    if (ENDPOINT_V1 && ENDPOINT_V2) {
        return [ENDPOINT_V1, ENDPOINT_V2];
    }
    if (!ENDPOINT_V1) {
        throw new Error('ApiClient init failed: There are no endpoint v1.');
    } else throw new Error('ApiClient init failed: There are no endpoint v2.');
};
const getMockConfig = (config): MockConfig => ({
    enabled: config.get('DEV.MOCK.ENABLED'),
    endpoints: [config.get('DEV.MOCK.ENDPOINT_V1'), config.get('DEV.MOCK.ENDPOINT_V2')],
    reflection: [config.get('DEV.MOCK.REFLECTION_V1'), config.get('DEV.MOCK.REFLECTION_V2')],
    apiList: [config.get('DEV.MOCK.API_LIST_V1'), config.get('DEV.MOCK.API_LIST_V2')],
});

const getAuthConfig = (config): AuthConfig => ({
    enabled: config.get('DEV.AUTH.ENABLED'),
    skipTokenCheck: config.get('DEV.AUTH.SKIP_TOKEN_CHECK'),
    apiKey: config.get('DEV.AUTH.API_KEY'),
});

export const initApiClient = async (store, config) => {
    const endpoints = getApiEndpoints(config);
    const tokenApi = new TokenAPI(endpoints[1], getSessionTimeoutCallback(store));
    const devConfig: DevConfig = {
        enabled: config.get('DEV.ENABLED'),
        mockConfig: getMockConfig(config),
        authConfig: getAuthConfig(config),
    };
    await SpaceConnector.init(
        endpoints,
        tokenApi,
        devConfig,
        getAfterCallApiMap(),
    );
    const existingRefreshToken = SpaceConnector.getRefreshToken();

    if (!existingRefreshToken) return;

    try {
        const grantRequest: TokenGrantParameters = {
            grant_type: 'REFRESH_TOKEN',
            token: existingRefreshToken,
            scope: 'USER',
        };
        const response = await SpaceConnector.clientV2.identity.token.grant<TokenGrantParameters, TokenGrantModel>(grantRequest);
        SpaceConnector.setToken(response.access_token);
        store.commit('user/setCurrentGrantInfo', { scope: 'USER' });
        store.commit('user/setCurrentRoleInfo', undefined);
    } catch (e) {
        console.error(e);
    }

    // to be deprecated
    // const isTokenAlive = SpaceConnector.isTokenAlive;
    // store.dispatch('user/setIsSessionExpired', !isTokenAlive);
    // store.dispatch('user/setIsSessionExpired', false);
};
