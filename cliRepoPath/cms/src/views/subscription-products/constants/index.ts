import { HeadCell1 } from 'types';
import * as Yup from 'yup';
import { BillingCycleEnum, FormInputType, ProductStatus } from '../types';

// table header options
export const headCells: HeadCell1[] = [
    {
        id: 'name',
        numeric: false,
        label: 'Product Name',
        align: 'left',
        sort: true
    },
    {
        id: 'description',
        numeric: false,
        label: 'Description',
        align: 'left',
        sort: false
    },
    {
        id: 'isActive',
        numeric: false,
        label: 'Status',
        align: 'left',
        sort: false
    },
    {
        id: 'createdAt',
        numeric: false,
        label: 'Created At',
        align: 'left',
        sort: true
    },
    {
        id: 'updatedAt',
        numeric: false,
        label: 'Updated At',
        align: 'left',
        sort: true
    }
];

export const validationSchema = Yup.object().shape({
    productName: Yup.string().min(2).max(80).required().label('Product name'),
    description: Yup.string().min(2).max(500).required().label('Description'),
    status: Yup.string(),
    billingCycle: Yup.string(),
    prices: Yup.array().of(
        Yup.object().shape({
            price: Yup.number().min(1).required().label('Price'),
            name: Yup.string().min(2).max(80).required().label('Name'),
            currency: Yup.string(),
            status: Yup.string()
        })
    )
});

export const defaultValue: FormInputType = {
    productName: '',
    description: '',
    status: ProductStatus.Active,
    billingCycle: BillingCycleEnum.MONTHLY,
    prices: [
        {
            price: 0,
            name: '',
            currency: '',
            status: ProductStatus.Active
        }
    ]
};
