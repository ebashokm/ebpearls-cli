import { Children, cloneElement, ReactElement, useState } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import * as arrayMove from 'array-move';
import styled from 'styled-components';

type Props = {
    children: ReactElement | ReactElement[];
};

const SortableItem = SortableElement<{ value: any }>(({ value }) => {
    return <ItemWrapper>{cloneElement(value)}</ItemWrapper>;
});

const SortableList = SortableContainer<{ items: any }>(({ items }) => {
    return (
        <ListWrapper>
            {Children.map(items, (child, index) => {
                return <SortableItem key={`item-${index}`} index={index} value={child} />;
            })}
        </ListWrapper>
    );
});

const SortableHoc: React.FC<Props> = ({ children }) => {
    const [childList, setChildList] = useState<any>({ items: children });

    const onSortEnd = ({ oldIndex, newIndex }) => {
        setChildList(({ items }) => ({ items: arrayMove.arrayMoveImmutable(items, oldIndex, newIndex) }));
    };

    return <SortableList items={childList.items} onSortEnd={onSortEnd} />;
};

const ListWrapper = styled.div``;
const ItemWrapper = styled.div``;

export default SortableHoc;
