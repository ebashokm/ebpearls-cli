import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

import useEditorContext from '../../hooks/useEditorContext';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import debounce from 'lodash.debounce';
import { Actions } from '../../types/editor/draftEditor';

type PropTypes = {
    editorRef: React.RefObject<Editor>;
};
const DraftEditor = ({ editorRef }: PropTypes) => {
    const {
        state: { HTMLButton, editorState, rawHTML },
        dispatch
    } = useEditorContext();
    const debouncedSave = useCallback(
        debounce((estate: EditorState) => {
            dispatch({ type: Actions.SET_EDITOR_STATE, editorState: estate });
        }, 500),
        []
    );

    useEffect(() => {
        dispatch({ type: Actions.CONVERT_TO_RAW_HTML, editorState });
    }, [editorState]);

    useEffect(() => {
        /* on true, update the rawHTML */
        if (HTMLButton) {
            dispatch({ type: Actions.CONVERT_TO_RAW_HTML, editorState });
        } else {
            /* on false, update the editorState */
            dispatch({ type: Actions.CONVERT_TO_EDITOR_STATE, text: rawHTML });
        }
    }, [HTMLButton]);

    const onEditorStateChange = (estate: EditorState) => {
        dispatch({ type: Actions.SET_EDITOR_STATE, editorState: estate });
    };

    return (
        <div style={{ display: !HTMLButton ? '' : 'none', overflow: 'auto', padding: '0.25em' }}>
            <Editor
                ref={editorRef}
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
                toolbar={{
                    inline: { inDropdown: true },
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    history: { inDropdown: true }
                }}
            />
        </div>
    );
};

export default DraftEditor;
