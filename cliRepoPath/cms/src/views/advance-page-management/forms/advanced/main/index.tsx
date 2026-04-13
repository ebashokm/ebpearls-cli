import TinyMCE from '../../../components/editors/TinyMCE';
import { forwardRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PageProps } from '../../../constants/advancedPage';
import { setValues } from 'store/slices/form';
import { genResults } from 'utils/flatten';
import { Actions } from 'views/advance-page-management/types/pages/advancedPage';
import { RootState } from 'store';
import { defaultValue, fields, mainFields, validationSchema } from '../../../constants/basicForm';
import { EditorState } from 'types';
import ReusableForm from '../../../components/form/formV1';
import { PageStatus } from 'views/advance-page-management/types/types';

const BasicForm = forwardRef((props: PageProps, ref) => {
    const editorDefault = props?.data?.content || '<p></p>';
    const dispatch = useDispatch();
    const form = useSelector((state: RootState) => state.form);
    const [editorState, setEditorState] = useState<EditorState>();
    let defaultMainValues = defaultValue;
    if (props?.data) {
        defaultMainValues = {
            main: [
                {
                    id: '',
                    header: [
                        {
                            title: props.data.title,
                            slug: props.data.slug,
                            status: PageStatus[props.data.status],
                            seoTitle: props.data.seoTags.title,
                            seoTags: props.data.seoTags.tags,
                            seoDescription: props.data.seoTags.description
                        }
                    ]
                }
            ],
            sub: []
        };
    }

    const handleSubmit = async (values: any, setSubmitting: (isSubmitting: boolean) => void) => {
        if (!form.errors) {
            const results = genResults(values);
            let bodyData = '';
            if (!editorState) {
                bodyData = editorDefault;
            } else {
                bodyData = editorState?.editor?.getContent();
            }
            const promise = new Promise((resolve: (value: unknown) => void) => {
                return resolve(dispatch(setValues({ type: 'header', values: { ...results.main, body: bodyData } })));
            });
            props.dispatch({ id: '', key: '', action: Actions.PUSH_PROMISE, promise });
        }
        setSubmitting(false);
    };

    return (
        <>
            <ReusableForm<mainFields, never[]>
                {...{
                    defaultValue: defaultMainValues,
                    fields,
                    validationSchema,
                    button: { show: false, label: 'Save Main' },
                    handleSubmit,
                    ref
                }}
            >
                <TinyMCE initialValue={editorDefault} height={250} setEditorState={setEditorState} />
            </ReusableForm>
        </>
    );
});
export default BasicForm;
