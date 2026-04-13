import { EditorContext } from 'contexts/EditorContext';
import { useContext } from 'react';

const useEditorContext = () => {
    const context = useContext(EditorContext);
    if (!context) throw new Error('Invalid context');
    return context;
};

export default useEditorContext;
