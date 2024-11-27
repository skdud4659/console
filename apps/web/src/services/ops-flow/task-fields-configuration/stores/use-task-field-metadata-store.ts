import { computed, reactive } from 'vue';

import { defineStore } from 'pinia';

import type { TaskField, TaskFieldType } from '@/schema/opsflow/_types/task-field-type';

import { DEFAULT_FIELD_ID_MAP } from '@/services/ops-flow/task-fields-configuration/constants/default-field-constant';
import type { TaskFieldTypeMetadata } from '@/services/ops-flow/task-fields-configuration/types/task-field-type-metadata-type';

export const useTaskFieldMetadataStore = defineStore('task-field-metadata', () => {
    // TODO: i18n
    const getters = reactive({
        taskFieldTypeMetadataMap: computed<Record<TaskFieldType, TaskFieldTypeMetadata>>(() => ({
            GLOBAL: { type: 'GLOBAL', name: 'Global', icon: 'ic_global' }, // not used yet
            TEXT: { type: 'TEXT', name: 'Short Text', icon: 'ic_short-text' },
            PARAGRAPH: { type: 'PARAGRAPH', name: 'Paragraph', icon: 'ic_paragraph' },
            LABELS: { type: 'LABELS', name: 'Labels', icon: 'ic_label' },
            DROPDOWN: { type: 'DROPDOWN', name: 'Dropdown', icon: 'ic_dropdown' },
            DATE: { type: 'DATE', name: 'Date', icon: 'ic_calendar' },
            USER: { type: 'USER', name: 'User', icon: 'ic_member' },
            ASSET: { type: 'ASSET', name: 'Asset', icon: 'ic_service_asset-inventory' },
            PROJECT: { type: 'PROJECT', name: 'Project', icon: 'ic_service_project' },
        })),
        taskFieldTypeMetadataList: computed<TaskFieldTypeMetadata[]>(() => [
            getters.taskFieldTypeMetadataMap.TEXT,
            getters.taskFieldTypeMetadataMap.PARAGRAPH,
            getters.taskFieldTypeMetadataMap.LABELS,
            getters.taskFieldTypeMetadataMap.DROPDOWN,
            getters.taskFieldTypeMetadataMap.DATE,
            getters.taskFieldTypeMetadataMap.USER,
            getters.taskFieldTypeMetadataMap.ASSET,
            getters.taskFieldTypeMetadataMap.PROJECT,
        ]),
        defaultFields: computed<TaskField[]>(() => [
            {
                field_id: DEFAULT_FIELD_ID_MAP.title,
                name: 'Title', // TODO: i18n
                field_type: 'TEXT',
                is_required: true,
                is_primary: true,
            },
            {
                field_id: DEFAULT_FIELD_ID_MAP.content,
                name: 'Content', // TODO: i18n
                field_type: 'PARAGRAPH',
                is_required: true,
                is_primary: true,
            },
        ]),
    });

    return {
        getters,
    };
});
