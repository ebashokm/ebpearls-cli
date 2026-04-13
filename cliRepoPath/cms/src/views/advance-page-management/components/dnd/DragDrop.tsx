import { Box, IconButton, Stack } from '@mui/material';
import { Children, cloneElement, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

type Props = {
    children: React.ReactElement[];
    //getNewList?: any;
    route?: any;
    updateMenuArray?: any;
    menuItemArray?: any;
    type?: any;
    parentMenuId?: any;
    
};

const DragDrop = ({ children, route, menuItemArray, updateMenuArray, type,parentMenuId }: Props) => {
    const [childrenArray, setChildrenArray] = useState<any>(children);

    const [dragged, setDragged] = useState<any>(false);

    useEffect(() => {
        if (!dragged) {
            setChildrenArray(children);
        }
    }, [children]);


    const swapValues = (array, v1, v2) => {
        const index1 = array.findIndex((obj) => obj.index === v1);
        const index2 = array.findIndex((obj) => obj.index === v2);

        if (index1 === -1 || index2 === -1) {
            console.error('One or both of the specified ages do not exist in the array.');
            return array;
        }

        // Create a new array for sorting
        const newArray = [...array];
        const [movedElement] = newArray.splice(v1, 1);
        newArray.splice(v2, 0, movedElement); 
        return newArray.map((obj, index) => ({ ...obj, index }));
    };

    const updateObjectWithId =  (array, newObj, id) => {
        for (let i = 0; i < array.length; i++) {
            if (array[i].id === id) {
                array[i] = newObj;
                break;
            }
        }
        return array;
    }
    
    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        if (type == 'main') {
            const updatedMenuItemArray = swapValues(menuItemArray, source.index, destination.index);
            updateMenuArray(updatedMenuItemArray);
        } else if (type == 'child') {
            const parentMenu = menuItemArray.find((item) => item.id == parentMenuId)
            const updatedChildrenMenuItemArray = swapValues(parentMenu.children, source.index, destination.index);
            parentMenu.children = updatedChildrenMenuItemArray;
            const updatedMenuItemArray = updateObjectWithId(menuItemArray, parentMenu, parentMenuId);
            updateMenuArray(updatedMenuItemArray);
        }
    };

    return (
        <Box className="drag-wrapper">
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="list">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {Children.map(childrenArray, (child, index) => (
                                <Draggable key={`list-inner-${index}`} draggableId={`child-${index}`} index={index}>
                                    {(provided) => (
                                        <Stack ref={provided.innerRef} {...provided.draggableProps} className="drag-element">
                                            <Box {...provided.dragHandleProps}>
                                                <IconButton>
                                                    <DragIndicatorIcon />
                                                </IconButton>
                                            </Box>
                                            {cloneElement(child)}
                                        </Stack>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </Box>
    );
};

export default DragDrop;
