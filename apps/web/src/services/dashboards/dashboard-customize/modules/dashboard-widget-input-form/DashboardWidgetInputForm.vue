<template>
    <div class="dashboard-widget-input-form">
        <p-field-group :label="$t('DASHBOARDS.CUSTOMIZE.ADD_WIDGET.LABEL_NAME')"
                       :invalid="isTitleInvalid"
                       :invalid-text="titleInvalidText"
                       required
        >
            <p-text-input :value="title"
                          :is-focused.sync="isFocused"
                          :invalid="isTitleInvalid"
                          :placeholder="$t('DASHBOARDS.CUSTOMIZE.ADD_WIDGET.NAME_PLACEHOLDER')"
                          class="input"
                          @update:value="updateTitle"
            />
        </p-field-group>
        <div v-if="widgetConfig?.description?.translation_id"
             class="description-text"
        >
            {{ $t(widgetConfig.description.translation_id) }}
        </div>
        <p-data-loader :loading="referenceStoreState.loading"
                       class="widget-options-form-wrapper"
        >
            <p-json-schema-form v-if="widgetOptionsJsonSchema.properties"
                                :schema="widgetOptionsJsonSchema"
                                :form-data.sync="schemaFormData"
                                :custom-error-map="inheritOptionsErrorMap"
                                :validation-mode="widgetKey ? 'all' : 'input'"
                                use-fixed-menu-style
                                :reference-handler="referenceHandler"
                                class="widget-options-form"
                                @validate="handleFormValidate"
            >
                <template #label-extra="{ propertyName }">
                    <div class="inherit-toggle-button">
                        <span class="text"
                              :class="{inherit: inheritableProperties.includes(propertyName)}"
                        >{{ $t('DASHBOARDS.CUSTOMIZE.ADD_WIDGET.INHERIT') }}</span>
                        <p-toggle-button :value="inheritableProperties.includes(propertyName)"
                                         :disabled="widgetOptionsJsonSchema.properties?.[propertyName]?.disabled"
                                         @change-toggle="handleChangeInheritToggle(propertyName, $event)"
                        />
                    </div>
                </template>
                <template #input-extra="{ propertyName }">
                    <p-icon-button v-if="!fixedProperties.includes(propertyName)"
                                   class="delete-button"
                                   shape="square"
                                   style-type="negative-secondary"
                                   name="ic_delete"
                                   @click="handleDeleteProperty(propertyName)"
                    />
                </template>
                <template #dropdown-extra="{ propertyName, selectedItem }">
                    <div v-if="isSelected(selectedItem) && inheritableProperties.includes(propertyName)">
                        <span>{{ selectedItem.label }}</span>
                        <span class="suffix-text">{{ $t('DASHBOARDS.CUSTOMIZE.ADD_WIDGET.FROM_DASHBOARD') }}</span>
                    </div>
                </template>
            </p-json-schema-form>
        </p-data-loader>
        <dashboard-widget-more-options class="more-option-container"
                                       :widget-config-id="widgetConfigId"
                                       :selected-properties="widgetFormState.schemaProperties"
                                       @update:selected-properties="handleUpdateSchemaProperties"
        />
    </div>
</template>
<script lang="ts">
import {
    computed, defineComponent, reactive, toRefs, watch,
} from 'vue';

import {
    PFieldGroup, PTextInput, PJsonSchemaForm, PToggleButton, PDataLoader, PIconButton,
} from '@spaceone/design-system';
import type { FilterableDropdownMenuItem } from '@spaceone/design-system/types/inputs/dropdown/filterable-dropdown/type';
import type { SelectDropdownMenu } from '@spaceone/design-system/types/inputs/dropdown/select-dropdown/type';
import type { JsonSchema } from '@spaceone/design-system/types/inputs/forms/json-schema-form/type';
import { cloneDeep, isEmpty, union } from 'lodash';

import {
    useReferenceStore,
} from '@/services/dashboards/dashboard-customize/modules/dashboard-widget-input-form/composables/use-reference-store';
import {
    useWidgetTitleInput,
} from '@/services/dashboards/dashboard-customize/modules/dashboard-widget-input-form/composables/use-widget-title-input';
import DashboardWidgetMoreOptions
    from '@/services/dashboards/dashboard-customize/modules/dashboard-widget-input-form/DashboardWidgetMoreOptions.vue';
import {
    getReferenceHandler,
} from '@/services/dashboards/dashboard-customize/modules/dashboard-widget-input-form/reference-handler-helpers';
import {
    getRefinedWidgetInheritOptions,
    getRefinedWidgetOptionsSchema, getWidgetOptionSchema,
} from '@/services/dashboards/dashboard-customize/modules/dashboard-widget-input-form/schema-helpers';
import { useDashboardDetailInfoStore } from '@/services/dashboards/store/dashboard-detail-info';
import { useWidgetFormStore } from '@/services/dashboards/store/widget-form';
import type {
    DashboardLayoutWidgetInfo, WidgetConfig,
    WidgetFiltersMap,
    WidgetOptionsSchema,
    InheritOptions,
} from '@/services/dashboards/widgets/_configs/config';
import { getWidgetConfig } from '@/services/dashboards/widgets/_helpers/widget-helper';
import type {
    InheritOptionsErrorMap,
} from '@/services/dashboards/widgets/_helpers/widget-validation-helper';
import {
    getWidgetInheritOptionsErrorMap,
} from '@/services/dashboards/widgets/_helpers/widget-validation-helper';


interface Props {
    widgetConfigId?: string;
    widgetKey?: string;
}

export default defineComponent<Props>({
    name: 'DashboardWidgetInputForm',
    components: {
        DashboardWidgetMoreOptions,
        PTextInput,
        PFieldGroup,
        PJsonSchemaForm,
        PToggleButton,
        PDataLoader,
        PIconButton,
    },
    props: {
        widgetConfigId: {
            type: String,
            default: undefined,
        },
        widgetKey: {
            type: String,
            default: undefined,
        },
    },
    setup(props) {
        const dashboardDetailStore = useDashboardDetailInfoStore();
        const dashboardDetailState = dashboardDetailStore.$state;
        const widgetFormStore = useWidgetFormStore();
        const widgetFormState = widgetFormStore.$state;

        const state = reactive({
            widgetConfig: computed<WidgetConfig|undefined>(() => (props.widgetConfigId ? getWidgetConfig(props.widgetConfigId) : undefined)),
            widgetOptionsJsonSchema: {} as JsonSchema,
            schemaFormData: {},
            //
            fixedProperties: computed<string[]>(() => state.widgetConfig.options_schema?.fixed_properties ?? []),
            inheritableProperties: computed(() => Object.entries<InheritOptions[string]>(widgetFormState.inheritOptions ?? {})
                .filter(([, inheritOption]) => !!inheritOption.enabled)
                .map(([propertyName]) => propertyName)),
            inheritOptionsErrorMap: computed<InheritOptionsErrorMap>(() => getWidgetInheritOptionsErrorMap(
                widgetFormState.inheritOptions,
                state.widgetConfig?.options_schema?.schema,
                dashboardDetailState.variablesSchema,
            )),
            // validation
            isSchemaFormValid: undefined,
            isAllValid: computed(() => state.isSchemaFormValid && isTitleValid.value),

            isFocused: false,
        });

        const referenceHandler = getReferenceHandler();

        /* title form validation */
        const {
            title, resetTitle, updateTitle, isTitleValid, isTitleInvalid, titleInvalidText,
        } = useWidgetTitleInput();

        /* reference store */
        const { referenceStoreState } = useReferenceStore();

        /* more options */
        const handleUpdateSchemaProperties = (properties: string[]) => {
            widgetFormStore.$patch((_state) => {
                _state.schemaProperties = properties;
            });

            // update inherit options
            const inheritOptions = {};
            const origin = widgetFormState.inheritOptions ?? {};
            Object.keys(origin).forEach((name) => {
                if (properties.includes(name)) inheritOptions[name] = origin[name];
                else inheritOptions[name] = { enabled: false };
            });
            widgetFormStore.$patch((_state) => {
                _state.inheritOptions = inheritOptions;
            });

            // update schema
            state.widgetOptionsJsonSchema = getRefinedWidgetOptionsSchema(
                referenceStoreState,
                state.widgetConfig?.options_schema ?? {},
                dashboardDetailState.variablesSchema,
                widgetFormState.inheritOptions ?? {},
                properties,
                dashboardDetailState.projectId,
            );
        };
        const handleDeleteProperty = (property: string) => {
            const _properties = widgetFormState.schemaProperties?.filter((d) => d !== property) ?? [];
            handleUpdateSchemaProperties(_properties);
        };

        /* utils */
        const isSelected = (selectedItem: SelectDropdownMenu | FilterableDropdownMenuItem[]): boolean => {
            if (Array.isArray(selectedItem)) return !!selectedItem.length;
            return selectedItem && !isEmpty(selectedItem);
        };

        const getFormDataFromWidgetInfo = (widgetInfo: DashboardLayoutWidgetInfo) => {
            const { widget_options, inherit_options } = widgetInfo;
            const formData = {};

            // set schema keywords
            Object.entries(widget_options).forEach(([optionKey, optionValue]) => {
                if (optionKey === 'filters') {
                    Object.entries((optionValue ?? {}) as WidgetFiltersMap).forEach(([key, value]) => {
                        if (Array.isArray(value)) {
                            formData[`filters.${key}`] = value.map((filter) => filter.v).flat();
                        }
                    });
                } else {
                    formData[optionKey] = cloneDeep(optionValue);
                }
            });

            // override if inherit is enabled
            Object.entries(inherit_options).forEach(([optionKey, optionValue]) => {
                if (optionValue?.enabled) formData[optionKey] = optionValue?.variable_info?.key;
            });
            return formData;
        };
        const getSchemaPropertiesFromWidgetInfo = (widgetInfo: DashboardLayoutWidgetInfo) => {
            if (!widgetInfo.schema_properties) {
                return getRefinedSchemaProperties(state.widgetConfig?.options_schema ?? {});
            }
            return widgetInfo.schema_properties ?? [];
        };


        /* inherit */
        const handleChangeInheritToggle = (propertyName: string, value) => {
            widgetFormStore.$patch((_state) => {
                _state.inheritOptions = { ..._state.inheritOptions, [propertyName]: { enabled: value } };
            });

            // update widget option schema
            const originPropertySchema = state.widgetConfig?.options_schema?.schema?.properties?.[propertyName] ?? {};
            state.widgetOptionsJsonSchema = {
                ...state.widgetOptionsJsonSchema,
                properties: {
                    ...state.widgetOptionsJsonSchema.properties,
                    [propertyName]: getWidgetOptionSchema(propertyName, originPropertySchema, dashboardDetailState.variablesSchema, referenceStoreState, value),
                },
            };

            // update form data
            state.schemaFormData = { ...state.schemaFormData, [propertyName]: undefined };
        };

        /* schema refining helpers */
        const getRefinedSchemaProperties = (widgetOptionsSchema: WidgetOptionsSchema): string[] => {
            const fixedProperties: string[] = widgetOptionsSchema.fixed_properties ?? [];
            const defaultProperties: string[] = widgetOptionsSchema.default_properties ?? [];
            const allProperties = union(fixedProperties, defaultProperties);

            const fixedIdxMap: Record<string, number> = {};
            fixedProperties.forEach((name, idx) => { fixedIdxMap[name] = idx; });
            const defaultIdxMap = {};
            defaultProperties.forEach((name, idx) => { defaultIdxMap[name] = idx; });

            return allProperties.sort((a, b) => {
                if (fixedIdxMap[a] !== undefined) {
                    // if both are fixed, follow required index order
                    if (fixedIdxMap[b] !== undefined) return fixedIdxMap[a] > fixedIdxMap[b] ? 1 : -1;
                    // otherwise, fixed item comes before
                    return -1;
                }
                // if one is default and one is fixed, fixed one comes before
                if (fixedIdxMap[b] !== undefined) return 1;

                // if both are default, follow default index order
                return defaultIdxMap[a] > defaultIdxMap[b] ? 1 : -1;
            });
        };

        /* states settings */
        const resetStates = () => {
            // reset widget form store states
            widgetFormStore.$reset();
            widgetFormStore.$patch((_state) => {
                _state.schemaProperties = [];
                _state.inheritOptions = {};
            });
            // reset states
            state.widgetOptionsJsonSchema = {
                type: 'object',
                properties: {},
                required: [],
                order: [],
            };
            state.schemaFormData = {};
            resetTitle();
        };
        const initStatesByWidgetConfig = (widgetConfigId: string) => {
            state.schemaFormData = {};
            const widgetOptionsSchema: WidgetOptionsSchema = state.widgetConfig?.options_schema ?? {};
            // init widget form store states
            widgetFormStore.$patch((_state) => {
                _state.widgetConfigId = widgetConfigId;
                _state.schemaProperties = getRefinedSchemaProperties(widgetOptionsSchema);
                _state.inheritOptions = {};
            });
            if (!props.widgetKey) {
                let _inheritOptions = widgetFormState.inheritOptions;
                widgetFormState.schemaProperties?.filter((d) => !state.fixedProperties.includes(d)).forEach((propertyName) => {
                    state.schemaFormData[propertyName] = propertyName.replace('filters.', '');
                    _inheritOptions = {
                        ..._inheritOptions,
                        [propertyName]: { enabled: true },
                    };
                });
                widgetFormStore.$patch((_state) => {
                    _state.inheritOptions = _inheritOptions;
                });
            }
            // init states
            state.widgetOptionsJsonSchema = getRefinedWidgetOptionsSchema(
                referenceStoreState,
                widgetOptionsSchema,
                dashboardDetailState.variablesSchema,
                widgetFormState.inheritOptions ?? {},
                widgetFormState.schemaProperties ?? [],
                dashboardDetailState.projectId,
            );
        };
        const setStatesForEditMode = (widgetKey: string) => {
            const widgetOptionsSchema = state.widgetConfig?.options_schema ?? {};

            // set widget form store states
            const widgetInfo = widgetFormStore.initWidgetForm(widgetKey);
            if (!widgetInfo) return;

            // init title
            updateTitle(widgetInfo.title);
            // init widget form store states
            widgetFormStore.$patch((_state) => {
                _state.inheritOptions = getRefinedWidgetInheritOptions(widgetInfo, dashboardDetailState.projectId);
                _state.schemaProperties = getSchemaPropertiesFromWidgetInfo(widgetInfo);
            });
            // init options schema
            state.widgetOptionsJsonSchema = getRefinedWidgetOptionsSchema(
                referenceStoreState,
                widgetOptionsSchema,
                dashboardDetailState.variablesSchema,
                widgetFormState.inheritOptions ?? {},
                widgetFormState.schemaProperties ?? [],
                dashboardDetailState.projectId,
            );
            // init form data
            state.schemaFormData = getFormDataFromWidgetInfo(widgetInfo);
        };
        watch([() => props.widgetConfigId, () => props.widgetKey, () => referenceStoreState.loading], ([widgetConfigId, widgetKey, loading]) => {
            // do nothing if still loading
            if (loading) return;

            // reset all states if required props are not given
            if (!widgetConfigId) {
                resetStates();
                return;
            }

            // initiate states by widget config
            initStatesByWidgetConfig(widgetConfigId);

            // set states if widget key exists. this is for updating widget case.
            if (widgetKey) setStatesForEditMode(widgetKey);

            // set focus on text input
            if (widgetConfigId) {
                state.isFocused = true;
            }
        });

        /* validation */
        const handleFormValidate = (isValid) => {
            state.isSchemaFormValid = isValid;
        };

        /* sync to widget form store */
        watch(() => state.schemaFormData, (schemaFormData) => {
            widgetFormStore.setFormData(schemaFormData);
        }, { immediate: true });
        watch(() => state.isAllValid, (_isAllValid) => {
            widgetFormStore.$patch({ isValid: _isAllValid });
        }, { immediate: true });

        return {
            widgetFormState,
            ...toRefs(state),
            referenceHandler,
            /* widget title input */
            title,
            updateTitle,
            isTitleInvalid,
            titleInvalidText,
            /* reference store */
            referenceStoreState,
            /* more options */
            handleUpdateSchemaProperties,
            handleDeleteProperty,
            /* inherit */
            handleChangeInheritToggle,
            //
            isSelected,
            handleFormValidate,
        };
    },
});
</script>

<style lang="postcss" scoped>
.dashboard-widget-input-form {
    @apply flex flex-col overflow-hidden;
    height: 100%;
    gap: 1rem;
    overflow-y: auto;
    .p-field-group {
        margin: 0;
        .input {
            width: 100%;
        }
    }
    .description-text {
        @apply bg-gray-100 text-gray-600 rounded-md;
        font-size: 0.875rem;
        font-weight: 400;
        padding: 0.75rem;
    }

    .widget-options-form-wrapper {
        height: 100%;
        min-height: 15rem;
        .delete-button {
            margin-left: 0.25rem;
        }
    }

    /* custom design-system component - p-field-group */
    :deep(.widget-options-form) {
        .field-title-box {
            pointer-events: none;
        }
        .form-label {
            display: -webkit-box;
            width: 100%;
            justify-content: space-between;
            align-content: center;
        }
        .input-form {
            width: 100%;
        }
    }
    .suffix-text {
        @apply text-gray-500;
        padding-left: 0.25rem;
    }
    .inherit-toggle-button {
        @apply flex bg-gray-100 rounded;
        line-height: 1.25;
        padding: 0.25rem 0.5rem;
        pointer-events: initial;
        .text {
            @apply text-gray-300;
            font-weight: 400;
            font-size: 0.75rem;
            letter-spacing: 0.02em;
            padding-right: 0.375rem;
            &.inherit {
                @apply text-gray-600;
            }
        }
    }

    .more-option-container {
        z-index: 2;
    }
}
</style>
