import { RequestGetAllInterface } from '../../interfaces/pagination';
import { defaultPaginationSize, dateFields } from './constants';

export const buildPaginatedGetAll = <T, Q>(
    queryParams: Q & RequestGetAllInterface,
    dataDB: { data: T[]; count: number },
): { data: T[]; count: number; limit: number; page: number; totalPages: number } => {
    const page = Number(queryParams.page || 1);
    const limit = Number(queryParams.size || defaultPaginationSize);

    const totalPages = getTotalPages(dataDB.count, limit);

    return {
        ...dataDB,
        limit,
        page,
        totalPages,
    };
};

export const getTotalPages = (count: number, limit: number): number => {
    const numberPages = count / limit;

    if (Number.isInteger(numberPages)) return numberPages;

    return Math.trunc(1 + numberPages);
};

export const buildSortParams = <T>(
    data: T & RequestGetAllInterface,
): Record<string, string> & { sortParam: string; sortOrder: string } => {
    const sortParam = getSortParam(<string>data?.sortParam);
    const sortOrder = getSortOrder(sortParam, <string>data?.sortOrder);

    return { sortParam, sortOrder };
};

export const getSortParam = (sortParam?: string): string => {
    return sortParam || 'created_at';
};

export const getSortOrder = (sortParam: string, sortOrder?: string): string => {
    if (sortOrder) return sortOrder.toUpperCase();

    return dateFields.includes(sortParam) ? 'DESC' : 'ASC';
};

export const getPaginationParams = <T>(
    queryParams: T & RequestGetAllInterface,
): {
    take: number;
    skip: number;
} => {
    const take = getTake(queryParams.size);
    const skip = getSkip(take, queryParams.page);

    return { take, skip };
};

export const getTake = (size?: unknown): number => {
    return Number(size || defaultPaginationSize);
};

export const getSkip = (take: number, page?: unknown): number => {
    return take * (Number(page || 1) - 1);
};
