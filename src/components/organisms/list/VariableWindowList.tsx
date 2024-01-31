import React, { createContext, useCallback, useRef, useEffect, useMemo } from 'react';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { VariableSizeList, ListChildComponentProps } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { Size, useWindowSize } from '@/hooks/useWindowSize';

interface IVariableWindowList {
  height: string | number;
  width: string | number;
  hasNextPage: boolean;
  data: QueryDocumentSnapshot<DocumentData>[] | null;
  loadNextPage: () => void | Promise<void>;
  component: ({ index, style, data }: ListChildComponentProps<any>) => JSX.Element | null;
  overScan?: number;
  style?: React.CSSProperties;
  scrollReversed?: boolean;
}

export const VariableWindowListContext = createContext<{
  size: Size | undefined;
  setSize: ((index: number, size: number) => void) | undefined;
}>({ size: undefined, setSize: undefined });

const VariableWindowList = ({
  height,
  width,
  hasNextPage,
  data,
  overScan = 3,
  scrollReversed = false,
  style,
  loadNextPage,
  component,
}: IVariableWindowList) => {
  const listRef = useRef<VariableSizeList<any> | null>(null);
  const [size] = useWindowSize();
  const sizeMap = useRef<{ [index: number]: number }>({});

  const itemCount = hasNextPage ? (data?.length as number) + 1 : (data?.length as number);

  const isItemLoaded = (index: number) => !hasNextPage || index < (data?.length as number) 

  // const setSize = useCallback((index: number, _size: number) => {
  //   sizeMap.current = { ...sizeMap.current, [index]: _size };
  //   listRef.current?.resetAfterIndex(index);
  // }, []);
  const setSize = (index: number, PSize: number) => {
    sizeMap.current = { ...sizeMap.current, [index]: PSize };
    listRef.current?.resetAfterIndex(index);
  };

  const getSize = useCallback((index: number) => {
    const currentSize = sizeMap.current[index] || 50;

    return currentSize;
  }, []);

  const ref = useRef<HTMLDivElement>();

  const invertedWheelEvent = useCallback((e: WheelEvent) => {
    if (ref.current) {
      ref.current.scrollTop += -e.deltaY;
      e.preventDefault();
    }
  }, []);

  useEffect(
    () => () => {
      if (ref.current) {
        ref.current.removeEventListener('wheel', invertedWheelEvent);
      }
    },
    []
  );

  const useInvertScrollDirection = (incomingRef: HTMLDivElement | null) => {
    if (!incomingRef) {
      return;
    }

    ref.current = incomingRef;

    if (ref.current) {
      ref.current.addEventListener('wheel', invertedWheelEvent);
    }
  };

  const value = useMemo(() => ({ size, setSize }), []);

  return (
    <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadNextPage}>
      {({ onItemsRendered, ref: infiniteLoaderRef }) => (
        <VariableWindowListContext.Provider value={value}>
          <VariableSizeList
            className="infinite-scroll-chatview"
            itemData={data}
            style={style}
            height={height ?? 0}
            itemCount={itemCount}
            overscanCount={overScan}
            onItemsRendered={onItemsRendered}
            outerRef={scrollReversed ? useInvertScrollDirection : undefined}
            ref={(variableSizeList) => {
              listRef.current = variableSizeList;
              return infiniteLoaderRef;
            }}
            width={width}
            itemSize={getSize}
          >
            {component}
          </VariableSizeList>
        </VariableWindowListContext.Provider>
      )}
    </InfiniteLoader>
  );
};

export default VariableWindowList;
