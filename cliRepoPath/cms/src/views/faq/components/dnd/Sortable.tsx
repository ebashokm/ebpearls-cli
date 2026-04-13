/* eslint-disable-next-line */

import React, { Children, cloneElement, FC, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';

const Sortable: FC<{ children: React.ReactElement | React.ReactElement[] }> = ({ children }) => {
    const [childList, setChildList] = useState<any>(Children.toArray(children));

    return (
        <ReactSortable list={childList} setList={setChildList}>
            {childList}
        </ReactSortable>
    );
};

export default Sortable;
