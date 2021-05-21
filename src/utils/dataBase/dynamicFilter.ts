import { Raw } from 'typeorm';

import { RequestGetAllInterface } from '../../interfaces/pagination';

export const dynamicFilter = <T>(
    data: T & RequestGetAllInterface,
    user_id?: string,
): Record<string, unknown> => {
    const queryParams = data;

    if (queryParams.page) delete queryParams.page;
    if (queryParams.size) delete queryParams.size;
    if (queryParams.sortParam) delete queryParams.sortParam;
    if (queryParams.sortOrder) delete queryParams.sortOrder;

    const queryDataEntries = Object.entries(data);

    let query: Record<string, unknown> = {};

    for (const [key, value] of queryDataEntries) {
        query = {
            ...query,
            [key]: Raw(alias => `CAST(${alias} AS VARCHAR) ILIKE '%${value}%'`),
        };
    }

    if (user_id) query.user_id = user_id;

    return query;
};
