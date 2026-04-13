import { useEffect, useMemo, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import { debounce } from 'lodash';
import { EditorState } from 'types';

const plugins = ['image', 'preview', 'code', 'fullscreen', 'table', 'wordcount'];
const toolbar = `bold italic  | fontfamily | fontsize | blocks | backcolor | alignleft aligncenter | alignright alignjustify | bullist numlist outdent indent | preview | code | image`;

type PropTypes = {
    initialValue: string;
    height: number;
    setEditorState: React.Dispatch<React.SetStateAction<EditorState | undefined>>;
};

const TinyMCE = ({ initialValue, height, setEditorState }: PropTypes) => {
    const handleEditorChange = (value: string, editor: TinyMCEEditor) => {
        setEditorState({ rawHTML: value, editor });
    };

    const debounceEditorChange = useMemo(() => {
        return debounce(handleEditorChange, 300);
    }, []);

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
