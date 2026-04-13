import { Component } from 'views/advance-page-management/constants/advancedPage';

export const getComponent = (target: string) => {
    return Component[target];
};
