import Item, { IItem } from './Item';

const SideBarItem = ({ ...props }: IItem) => {
  return (
    <>
      <Item {...props} />
    </>
  );
};

export default SideBarItem;
