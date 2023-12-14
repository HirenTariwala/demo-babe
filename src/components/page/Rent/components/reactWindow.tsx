import React, { useRef } from 'react';
import {
  FixedSizeGrid,
} from 'react-window';
import { WindowScroller } from "react-virtualized";

interface IGlobalFixedSizeGridProps extends React.ComponentProps<typeof FixedSizeGrid> {
component?: any;
}

const ReactWindow = ({
  ...props
}: IGlobalFixedSizeGridProps) => {

  const rwindowRef = useRef<any>(null);

  const handleListRef = (component: any) =>  { 
    rwindowRef.current = component
  }
  
  const handleScroll = (e: any) => {
    rwindowRef?.current?.scrollTo(e)
  }

  return (
    <React.Fragment>
      <WindowScroller onScroll={handleScroll} scrollElement={document.body}>
          {() => <div />}
      </WindowScroller>
    <FixedSizeGrid
      ref={handleListRef}
      {...props}
    >
    {props.children}
  </FixedSizeGrid>
  </React.Fragment>
  );
};

export default ReactWindow;
