// import { useEffect, useState } from 'react';
// import { Button, Grid, IconButton } from '@mui/material';
// import { Formik } from 'formik';
// import { v4 as uuid } from 'uuid';

// import MainCard from 'ui-component/cards/MainCard';
// import CustomFieldArray from 'components/formik/CustomFieldArray';
// import CollapsibleContent from 'components/collapsible';
// import ExpandMoreComponent from 'components/collapsible/iconButton';

// import { useCollapsible } from 'hooks/faq/useCollapsible';
// import CollapsibleProvider from 'contexts/CollapsibleContext';

// import AddIcon from '@mui/icons-material/Add';
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import { GridContainer } from './HomePage.styles';
// import { defaultValue, fields, validationSchema } from '../../../constants/pages/homePage';
// import DragDrop from 'components/dnd/DragDrop';
// import Sortable from 'components/dnd/Sortable';
// import SortableHoc from 'components/dnd/SortableHoc';

// type WrapperProps = {
//     expand: string;
//     children: React.ReactElement;
// };

// const CollapsibleContentWrapper = ({ expand, children }: WrapperProps) => {
//     const { setExpanded } = useCollapsible();
//     useEffect(() => {
//         setExpanded(JSON.parse(expand));
//     }, []);

//     return <CollapsibleContent>{children}</CollapsibleContent>;
// };

// const HomeBanner = () => {
//     const [initialState, setInitialState] = useState<typeof defaultValue>(defaultValue);

//     const handleSubmit = (values: any, setSubmitting: (isSubmitting: boolean) => void) => {
//         console.log(values);
//         const updatedValues = values.fieldArray.map((value) => {
//             const [id, ...others] = Object.values(value);
//             const inputFlatten = others.reduce((acc: Array<any>, current) => acc.concat(current), []);
//             const readyInputs = inputFlatten.reduce((acc, current) => ({ ...acc, ...current }));
//             return [{ id, ...readyInputs }];
//         });

//         console.log(updatedValues);
//         setSubmitting(false);
//     };

//     const pushFieldArray = (values) => {
//         setInitialState(() => ({
//             fieldArray: [
//                 ...values.fieldArray,
//                 { id: uuid(), image: [{ image: '', alt: '' }], content: [{ heading: '' }], button: [{ label: '', url: '' }] }
//             ]
//         }));
//     };

//     const removeFieldArray = (id, values) => {
//         console.log(values);
//         const filteredList = values.fieldArray.filter((_) => _.id !== id);
//         setInitialState({ fieldArray: filteredList });
//     };

//     return (
//         <MainCard title="Home Page">
//             <Formik
//                 enableReinitialize
//                 initialValues={initialState}
//                 validationSchema={validationSchema}
//                 onSubmit={(values, { setSubmitting }) => {
//                     handleSubmit(values, setSubmitting);
//                 }}
//             >
//                 {(props) => (
//                     <form onSubmit={props.handleSubmit}>
//                         <>
//                             <Grid container maxWidth="100%" spacing={3} sx={{ margin: 'auto' }}>
//                                 <DragDrop>
//                                     {initialState.fieldArray.map((_, index) => (
//                                         <CollapsibleProvider key={`container-${index}`}>
//                                             <Grid item xs={12}>
//                                                 <MainCard title="Home Page A-Frame" sx={{ position: 'relative' }}>
//                                                     <GridContainer container>
//                                                         <Grid item xs={4} sm={3} md={2.1} lg={2} xl={1.2}>
//                                                             <IconButton onClick={() => pushFieldArray(props.values)}>
//                                                                 <AddIcon />
//                                                             </IconButton>
//                                                             <IconButton
//                                                                 onClick={() => {
//                                                                     removeFieldArray(_.id, props.values);
//                                                                 }}
//                                                                 disabled={initialState.fieldArray.length === 1}
//                                                             >
//                                                                 <DeleteOutlineIcon />
//                                                             </IconButton>
//                                                         </Grid>
//                                                         <Grid item>
//                                                             <ExpandMoreComponent />
//                                                         </Grid>
//                                                     </GridContainer>

//                                                     <CollapsibleContentWrapper expand={index === 0 ? 'true' : 'false'}>
//                                                         <Grid container maxWidth="50%">
//                                                             <CustomFieldArray
//                                                                 formFields={fields}
//                                                                 formikProps={props}
//                                                                 controlIndex={index}
//                                                             />
//                                                         </Grid>
//                                                     </CollapsibleContentWrapper>
//                                                 </MainCard>
//                                             </Grid>
//                                         </CollapsibleProvider>
//                                     ))}
//                                 </DragDrop>

//                                 <Grid item xs={12} textAlign="center">
//                                     <Button type="submit" variant="contained">
//                                         Save Page
//                                     </Button>
//                                 </Grid>
//                             </Grid>
//                         </>
//                     </form>
//                 )}
//             </Formik>
//         </MainCard>
//     );
// };

// export default HomeBanner;

const HomeBanner = () => {
    return <h1>home banner</h1>;
};

export default HomeBanner;
