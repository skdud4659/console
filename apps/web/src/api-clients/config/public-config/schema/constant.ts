export const PUBLIC_CONFIG_NAMES = {
    BASE_CONFIG: 'console:base-config',
    TASK_LANDING: 'console:task-management:landing',
    TASK_TEMPLATE: 'console:task-management:template',
    EXTRA_MENU: 'console:ext-menu',
    // NOTE: Not used yet. Will be used after migration from domain-config to public-config(console:ext-menu)
    INTEGRATION_MENU: 'console:integration-menu',
    SETTINGS: 'settings', // NOTE: Not used yet. Will be used after migration from domain-config to public-config
} as const;
