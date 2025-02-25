<template>
    <p-button-modal :visible="proxyVisible"
                    :header-title="$t('BILLING.COST_MANAGEMENT.DASHBOARD.CUSTOMIZE.FORM.UPDATE_TITLE')"
                    :disabled="false"
                    size="sm"
                    @confirm="handleConfirm"
                    @update:visible="handleUpdateVisible"
    >
        <template #body>
            <cost-dashboard-customize-widget-config v-if="Object.keys(costDashboardPageState.editedSelectedWidget).length"
                                                    is-custom
                                                    :editable-widget-option-list="editableWidgetOptionList"
            />
        </template>
    </p-button-modal>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    reactive, toRefs, watch,
} from 'vue';

import { PButtonModal } from '@spaceone/design-system';

import CostDashboardCustomizeWidgetConfig
    from '@/services/cost-explorer/cost-dashboard/cost-dashboard-customize/modules/CostDashboardCustomizeWidgetConfig.vue';
import type {
    EDITABLE_WIDGET_OPTIONS_TYPE,
} from '@/services/cost-explorer/cost-dashboard/type';
import {
    EDITABLE_WIDGET_OPTIONS,
} from '@/services/cost-explorer/cost-dashboard/type';
import { useCostDashboardPageStore } from '@/services/cost-explorer/store/cost-dashboard-page-store';

interface Props {
    visible: boolean;
    defaultFilter: Record<string, string[]>;
}
export default defineComponent<Props>({
    name: 'CostDashboardUpdateWidgetModal',
    components: {
        PButtonModal,
        CostDashboardCustomizeWidgetConfig,
    },
    model: {
        prop: 'visible',
        event: 'update:visible',
    },
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
        defaultFilter: {
            type: Object,
            default: () => ({}),
        },
    },
    setup(props, { emit }) {
        const costDashboardPageStore = useCostDashboardPageStore();
        const costDashboardPageState = costDashboardPageStore.$state;

        const state = reactive({
            proxyVisible: props.visible,
            editableWidgetOptionList: computed(() => {
                const optionList: EDITABLE_WIDGET_OPTIONS_TYPE[] = [];
                if (costDashboardPageState.editedSelectedWidget?.options?.group_by) optionList.push(EDITABLE_WIDGET_OPTIONS.GROUP_BY);
                if (costDashboardPageState.editedSelectedWidget?.options?.granularity) optionList.push(EDITABLE_WIDGET_OPTIONS.GRANULARITY);
                return optionList;
            }),
        });
        const handleConfirm = () => {
            emit('update:visible', false);
            emit('confirm');
        };
        const handleUpdateVisible = (visible) => {
            state.proxyVisible = visible;
            emit('update:visible', visible);
        };
        watch(() => props.visible, (visible) => {
            if (visible !== state.proxyVisible) state.proxyVisible = visible;
        });
        return {
            ...toRefs(state),
            costDashboardPageState,
            handleConfirm,
            handleUpdateVisible,
        };
    },
});
</script>

<style lang="postcss" scoped>
/* custom design-system component - p-button-modal */
.p-button-modal {
    :deep(.modal-body) {
        overflow: unset;
    }
}
</style>
