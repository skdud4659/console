export const SERVICE_FEATURES = {
    DASHBOARDS: 'DASHBOARDS',
    PROJECT: 'PROJECT',
    SERVICE_ACCOUNT: 'SERVICE_ACCOUNT',
    ASSET_INVENTORY: 'ASSET_INVENTORY',
    COST_EXPLORER: 'COST_EXPLORER',
    ALERT_MANAGER: 'ALERT_MANAGER',
    OPS_FLOW: 'OPS_FLOW',
    IAM: 'IAM',
} as const;

// NOTE: The default version for menus without versioning.
export const UNVERSIONED_MENU_DEFAULT = 'V1';
// NOTE: The default version of the open-source 'Alert Manager, Project' is V1.
export const VERSIONED_MENU_DEFAULT = 'V2';

export const DEFAULT_CONFIG = {
    DASHBOARDS: {
        ENABLED: true,
        VERSION: UNVERSIONED_MENU_DEFAULT,
    },
    PROJECT: {
        ENABLED: true,
        VERSION: VERSIONED_MENU_DEFAULT,
    },
    SERVICE_ACCOUNT: {
        ENABLED: true,
        VERSION: UNVERSIONED_MENU_DEFAULT,
    },
    ASSET_INVENTORY: {
        ENABLED: true,
        VERSION: UNVERSIONED_MENU_DEFAULT,
    },
    COST_ANALYSIS: {
        ENABLED: true,
        VERSION: UNVERSIONED_MENU_DEFAULT,
    },
    ALERT_MANAGER: {
        ENABLED: true,
        VERSION: VERSIONED_MENU_DEFAULT,
    },
};
