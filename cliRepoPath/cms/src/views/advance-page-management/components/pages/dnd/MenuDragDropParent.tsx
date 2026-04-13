/* eslint @typescript-eslint/no-shadow: 0 */
/* eslint no-useless-return: 0 */

import { Grid, IconButton } from '@mui/material';
import { Children, cloneElement, useCallback, useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import * as arrayMove from 'array-move';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useDispatch } from 'react-redux';

type Props = {
    children: [];
    getNewList?: any;
    route?: any;
};

const DragDropParent = ({ children, getNewList, route }: Props) => {
    const dispatch = useDispatch();

    const [childrenArray, setChildrenArray] = useState<any>([]);

    const [dragged, setDragged] = useState<any>(false);
    // const [dragged, setDragged] = useState<any>(false);

    useEffect(() => {
        if (getNewList) getNewList({ children, fromDrag: false });
        if (!dragged) {
            setChildrenArray(children);
        }
        if (childrenArray.length !== children.length && dragged) {
            setChildrenArray(children);
            dispatch({ type: 'UPDATE_WHOLE_ARRAY', payload: childrenArray });
        }
    }, [children]);

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;
        const updatedList = arrayMove.arrayMoveImmutable(children, source.index, destination.index);
        if (getNewList) getNewList({ children: updatedList, fromDrag: true });
        setChildrenArray(updatedList);
        dispatch({ type: 'UPDATE_WHOLE_ARRAY', payload: childrenArray });
    };

    return (
        <Wrapper>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="list">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {Children.map(children, (child, index) => {
                                return (
                                    <Draggable key={`list-inner-${index}`} draggableId={`child-${index}`} index={index}>
                                        {(provided) => (
                                            <InnerWrapper ref={provided.innerRef} {...provided.draggableProps}>
                                                <ButtonWrapper item {...provided.dragHandleProps}>
                                                    <IconButton>
                                                        <DragIndicatorIcon />
                                                    </IconButton>
                                                </ButtonWrapper>
                                                {cloneElement(child)}
                                            </InnerWrapper>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </Wrapper>
    );
};

const ButtonWrapper = styled(({ ...otherProps }) => <Grid {...otherProps} />)`
    position: absolute;
    left: 100%;
`;

const InnerWrapper = styled.div`
    padding: 0.5rem 0;
    position: relative;
`;

const Wrapper = styled.div`
    width: 100%;
    padding: 1rem 2rem;
    box-sizing: border-box;
`;

export default DragDropParent;
