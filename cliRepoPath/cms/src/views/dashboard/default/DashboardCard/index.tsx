import React from 'react'
import Header from './header'
import MainCard from 'ui-component/cards/MainCard'
import List from './tablelist';

type DashboardCardProps = {
  title: string;
  sort?: boolean;
  total?: number | undefined;
  rows?: Array<any>;
  columns?: Array<any>;
  more?: number | undefined;
  linkTo?: string;
}

function DashboardCard({title, sort, total, rows, columns, more, linkTo}: DashboardCardProps) {
  
  return (
      <MainCard sx={{'.MuiCardContent-root': {padding: '24px 16px'}}}>
          <Header title={title} sort={sort} total={total}/>
          {rows && columns && <List rows={rows} columns={columns} more={more} linkTo={linkTo}/>}
      </MainCard>
  );
}

export default DashboardCard