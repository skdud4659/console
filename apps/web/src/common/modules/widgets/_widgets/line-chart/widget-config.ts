import type { WidgetConfig } from '@/common/modules/widgets/types/widget-config-type';


const lineChart: WidgetConfig = {
    widgetName: 'lineChart',
    meta: {
        title: 'Line Chart',
        sizes: ['md', 'full'],
    },
    requiredFieldsSchema: {
        granularity: {},
        dateRange: {},
        xAxis: {
            options: {
                dataTarget: 'labels_info',
                defaultMaxCount: 5,
                max: 31,
            },
        },
        tableDataField: {},
    },
    optionalFieldsSchema: {
        legend: {
            options: {
                default: true,
            },
        },
        dateFormat: {
            options: {
                default: 'MMM DD, YYYY',
            },
        },
        numberFormat: {},
        displaySeriesLabel: {},
        missingValue: {},
        displayAnnotation: {},
    },
};


export default lineChart;
