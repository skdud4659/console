import { getTextHighlightRegex } from '@spaceone/design-system';

import { SpaceConnector } from '@cloudforet/core-lib/space-connector';
import { getCancellableFetcher } from '@cloudforet/core-lib/space-connector/cancallable-fetcher';
import { ApiQueryHelper } from '@cloudforet/core-lib/space-connector/helper';

import type {
    ListQuery, ListResponse, VariableModelLabel, IBaseVariableModel,
} from '@/lib/variable-models/_base/types';
import { getRefinedDependencyOptions } from '@/lib/variable-models/_helpers/dependency-helper';

import ErrorHandler from '@/common/composables/error/errorHandler';


const apiQueryHelper = new ApiQueryHelper();
export default class CostDataKeyVariableModel implements IBaseVariableModel {
    key = 'cost_data_key';

    name = 'Data Key (Cost)';

    labels: VariableModelLabel[] = ['cost'];

    dependencies = {
        cost_data_source: 'data_source_id',
    };

    #response: ListResponse = { results: [] };

    #fetcher?: ReturnType<typeof getCancellableFetcher<{
        results: { keys: string[] }[];
    }>>;

    async list(query: ListQuery = {}): Promise<ListResponse> {
        try {
            const dependencyOptions = getRefinedDependencyOptions(this.dependencies, query.options);

            if (!this.#fetcher) this.#fetcher = getCancellableFetcher(SpaceConnector.clientV2.costAnalysis.dataSource.list);

            apiQueryHelper.setOnly('cost_data_keys')
                .setFilters([{
                    k: 'cost_data_keys',
                    v: null,
                    o: '!=',
                }]);
            const { status, response } = await this.#fetcher({
                ...dependencyOptions,
                query: apiQueryHelper.data,
            });
            if (status === 'succeed' && response.results?.length) {
                const target = response.results[0]?.keys ?? [];
                let results = target.map((d) => ({ key: d, name: d }));
                if (query.search) {
                    const regex = getTextHighlightRegex(query.search);
                    results = results.filter((item) => regex.test(item.name));
                }
                this.#response = { results };
            }
            return this.#response;
        } catch (e) {
            ErrorHandler.handleError(e);
            return this.#response;
        }
    }
}
