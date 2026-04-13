import { useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHTML from 'draftjs-to-html';

const useEditor = () => {
    const [rawHTML, setRawHTML] = useState<string>('');

    const convertToHTML = (editorState: EditorState) => {
        const html = draftToHTML(convertToRaw(editorState.getCurrentContent()));
        setRawHTML(html);
    };

    return { rawHTML, setRawHTML, convertToHTML };
};

export default useEditor;
