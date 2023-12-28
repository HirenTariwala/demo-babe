import React, { useRef } from 'react';
import { FixedSizeList } from 'react-window';
import { WindowScroller } from 'react-virtualized';

interface IGlobalFixedSizeListProps extends React.ComponentProps<typeof FixedSizeList> {
  component?: any;
}

const ReactWindowListV2 = ({ ...props }: IGlobalFixedSizeListProps) => {
  const rwindowRef = useRef<any>(null);

  const handleListRef = (component: any) => {
    rwindowRef.current = component;
  };

  const handleScroll = (e: any) => {
    rwindowRef?.current?.scrollTo(e);
  };

  return (
    <React.Fragment>
      <WindowScroller onScroll={handleScroll} scrollElement={document.body}>
        {() => <div />}
      </WindowScroller>
      <FixedSizeList ref={handleListRef} {...props}>
        {props.children}
      </FixedSizeList>
    </React.Fragment>
  );
};

export default ReactWindowListV2;
