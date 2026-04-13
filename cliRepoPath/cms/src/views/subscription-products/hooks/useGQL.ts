import { useMutation, useQuery } from '@apollo/client';
import {
    CREATE_SUBSCRIPTION_PRODUCT as CREATE,
    REMOVE_SUBSCRIPTION_PRODUCT as REMOVE,
    UPDATE_SUBSCRIPTION_PRODUCT as UPDATE,
    GET_SUBSCRIPTION_PRODUCTS,
    GET_SUBSCRIPTION_PRODUCT 
} from '../graphql';
import { BasePaginationDto, MessageResponse } from 'types/pagination';
import { CreateProductDto, SubscriptionProductsResponse, UpdateProductDto } from '../types';

const useGQL = () => {
    const CREATE_PRODUCT = () => useMutation<SubscriptionProductsResponse, { input: CreateProductDto }>(CREATE);
    const UPDATE_PRODUCT = () => useMutation<SubscriptionProductsResponse, { input: UpdateProductDto }>(UPDATE);
    const REMOVE_SUBSCRIPTION_PRODUCT = () => useMutation<MessageResponse, { id: string }>(REMOVE);

    const SUBSCRIPTION_PRODUCT_LIST = (input: BasePaginationDto) =>
        useQuery<SubscriptionProductsResponse, { input: BasePaginationDto }>(GET_SUBSCRIPTION_PRODUCTS, {
            variables: { input },
            notifyOnNetworkStatusChange: true
        });

    const SUBSCRIPTION_PRODUCT = (id: String) => useQuery(GET_SUBSCRIPTION_PRODUCT, { variables: { id } });

    return { SUBSCRIPTION_PRODUCT, SUBSCRIPTION_PRODUCT_LIST, REMOVE_SUBSCRIPTION_PRODUCT, CREATE_PRODUCT, UPDATE_PRODUCT };
};

export default useGQL;
