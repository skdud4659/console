import type { _FORMAT_RULE_TYPE, ADVANCED_FORMAT_RULE_TYPE } from '@/common/modules/widgets/_constants/widget-field-constant';
import type { FieldDataTargetType } from '@/common/modules/widgets/types/widget-field-type';

export interface AdvancedFormatRulesValue {
    field?: string;
    value: FormatRulesValue[];
    baseColor?: string;
}

export type AdvancedFormatRulesType = typeof ADVANCED_FORMAT_RULE_TYPE[keyof typeof ADVANCED_FORMAT_RULE_TYPE];

export interface AdvancedFormatRulesOptions {
    useField?: boolean;
    formatRulesType: AdvancedFormatRulesType;
    description?: string;
    baseColor?: string;
    default?: FormatRulesValue[];
}

export interface ThresholdValue {
    text?: string;
    number?: number;
    color: string;
}

export interface FormatRulesValue {
    field?: string;
    rules: ThresholdValue[];
    baseColor?: string;
}

export interface FormatRulesOptions {
    useField?: boolean;
    dataTarget?: FieldDataTargetType;
    formatRulesType: FormatRulesType;
    description?: string;
    baseColor?: string;
    default?: ThresholdValue[];
}

export type FormatRulesType = typeof _FORMAT_RULE_TYPE[keyof typeof _FORMAT_RULE_TYPE];
