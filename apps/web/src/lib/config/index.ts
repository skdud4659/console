import { createClient } from '@vercel/edge-config';
import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { get } from 'lodash';

import { SpaceConnector } from '@cloudforet/core-lib/space-connector';

import type { PublicConfigGetParameters } from '@/api-clients/config/public-config/schema/api-verbs/get';
import { PUBLIC_CONFIG_NAMES } from '@/api-clients/config/public-config/schema/constant';
import type { PublicConfigModel } from '@/api-clients/config/public-config/schema/model';

class Config {
    config: any;

    axiosInstance: AxiosInstance = null as unknown as AxiosInstance;

    constructor() {
        this.config = null;
    }

    createAxiosInstance() {
        const axiosConfig = {
            baseURL: '/config',
            headers: {
                'Cache-Control': 'no-cache',
            },
        };

        this.axiosInstance = axios.create(axiosConfig);
    }

    async loadLocalConfig(url) {
        try {
            const response = await this.axiosInstance.get(url);
            this.config = { ...this.config, ...response.data };
        } catch (e) {}
    }

    async loadPublicConfig(domainId?: string) {
        try {
            const response = await SpaceConnector.clientV2.config.publicConfig.get<PublicConfigGetParameters, PublicConfigModel>({
                name: PUBLIC_CONFIG_NAMES.BASE_CONFIG,
                domain_id: domainId || '*',
            });
            this.config = { ...this.config, ...response.data };
        } catch (e) {}
    }

    async init() {
        if (!this.config) {
            this.createAxiosInstance();
            this.config = {};
            await this.loadLocalConfig(`/${import.meta.env.MODE}.json`);
            if (import.meta.env?.VITE_VERCEL_EDGE_CONFIG) {
                const edgeConfigClient = createClient(import.meta.env.VITE_VERCEL_EDGE_CONFIG);
                const edgeConfig = await edgeConfigClient.getAll();
                console.debug('edgeConfig', edgeConfig);
                this.config = { ...this.config, ...edgeConfig };
            }
        }
    }

    get(key) {
        if (key) {
            return get(this.config, key);
        }
        return this.config;
    }
}

export default new Config();
