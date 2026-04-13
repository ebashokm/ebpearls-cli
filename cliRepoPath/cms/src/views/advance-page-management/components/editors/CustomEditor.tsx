import { useRef } from 'react';
import { Box, FormControlLabel, Switch } from '@mui/material';
import { Editor } from 'react-draft-wysiwyg';

import useEditorContext from './useEditorContext';
import DraftEditor from './DraftEditor';

import { Actions } from '../../types/editor/draftEditor';
import { EditorWrap, TextArea } from './editors.styles';

const CustomEditor = () => {
    const editorRef = useRef<Editor>(null);
    const { state, dispatch } = useEditorContext();

    const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch({ type: Actions.SET_RAW_HTML, text: event.target.value });
    };

    return (
        <Box sx={{ marginTop: '2em' }}>
            <FormControlLabel
                sx={{ px: '4px' }}
                control={<Switch size="small" onClick={() => dispatch({ type: Actions.TOGGLE })} />}
                label="Show HTML"
            />
            <EditorWrap onClick={() => editorRef.current?.focusEditor()}>
                <DraftEditor editorRef={editorRef} />
                <TextArea rows={5} show={state.HTMLButton} value={state.rawHTML} onChange={(event) => handleTextAreaChange(event)} />
            </EditorWrap>
        </Box>
    );
};

export default CustomEditor;
