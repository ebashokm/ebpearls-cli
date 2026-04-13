import { useEffect, useMemo } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import { debounce } from 'lodash';
import { plugins } from '../constants/variables';
const toolbar = `bold italic | fontfamily | fontsize | blocks | backcolor | alignleft aligncenter | alignright alignjustify | bullist numlist outdent indent | preview | code | image`;

type PropTypes = {
    initialValue: string;
    height: number;
    setFieldValue: any;
    fieldName: string;
};

const TinyMCE = ({ initialValue, height, setFieldValue, fieldName }: PropTypes) => {
    // Debounce the editor change to prevent too many rapid state updates
    const debounceEditorChange = useMemo(
        () =>
            debounce((value: string, editor: TinyMCEEditor) => {
                setFieldValue(fieldName, value); // Update Formik field value directly
            }, 300),
        [setFieldValue, fieldName]
    );

    // Clean up the debounce on component unmount
    useEffect(() => {
        return () => {
            debounceEditorChange.cancel(); // Clean up debounced function to prevent memory leaks
        };
    }, [debounceEditorChange]);

    return (
        <>
            <Editor
                apiKey={import.meta.env.VITE_APP_TINY_MCE}
                initialValue={initialValue}
                init={{
                    height,
                    menubar: false,
                    plugins,
                    toolbar,
                    content_style: 'body { font-family:Times New Roman,Arial,sans-serif; font-size:16px }'
                }}
                onEditorChange={debounceEditorChange}
            />
        </>
    );
};

export default TinyMCE;
