import { useDomainStore } from '@/store/domain/domain-store';
import { pinia } from '@/store/pinia';

export const initDomain = async (config): Promise<string> => {
    let domainName;
    if (import.meta.env.MODE !== 'development' && config.get('DOMAIN_NAME_REF') === 'hostname') {
        const { hostname } = window.location;
        domainName = hostname.split('.')[0];
    } else {
        domainName = config.get('DOMAIN_NAME');
    }

    try {
        const domainStore = useDomainStore(pinia);
        await domainStore.initDomainInfo(domainName);
        const domainId = domainStore.state.domainId;
        await config.loadPublicConfig(domainId);
        return domainStore.state.domainId as string;
    } catch (e) {
        console.error(e);
        throw new Error('Failed to load domain.');
    }
};
