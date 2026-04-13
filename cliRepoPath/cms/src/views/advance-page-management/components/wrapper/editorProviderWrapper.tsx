import EditorProvider from 'contexts/EditorContext';

export const EditorProviderWrapper = (Component) => (props) =>
    (
        <EditorProvider>
            <Component {...props} />
        </EditorProvider>
    );
