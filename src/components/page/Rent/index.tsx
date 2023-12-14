'use client';
import styles from './rent.module.css';
import Box from '@/components/atoms/box';
import React from 'react';
import useRentHook from './useRentHook';
import Typography from '@/components/atoms/typography';
import BabeCard from '@/components/molecules/card/babe';
import { Avatar, Card, CardHeader, CircularProgress, InputAdornment } from '@mui/material';
import Dropdown from '@/components/molecules/dropdown';
import Input from '@/components/atoms/input';
import Button from '@/components/atoms/button';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Item } from '@/props/profileProps';
// import InfiniteScroll from 'react-infinite-scroll-component';
import { useRouter } from 'next/navigation';
import TabChip from './components/favouritechip';
import Badge from '@/components/atoms/badge';
import FiltrerIcon from '@/components/atoms/icons/filterIcon';
import FilterModal from './components/FilterModal';
// import Image from 'next/image';
import SkeletonLine from '@/components/atoms/SkeletonLine';
import SkeletonAvatar from '@/components/atoms/SkeletonAvatar';
import ReactWindow from './components/reactWindow';
import NextImage from '@/components/atoms/image';
// import { SkeletonCardView } from './components/SkeletonCardView';
import ProfileModalComponents from '../Profile/components/profileModalComponents';
// import { SkeletonCardView } from './components/SkeletonCardView';

const imgs = [
  'https://rentbabe.com/assets/banner/newuser.jpg',
  'https://rentbabe.com/assets/banner/doubledates.jpg',
  'https://rentbabe.com/assets/banner/best.jpg',
  'https://rentbabe.com/assets/banner/mlbb.jpg',
  'https://rentbabe.com/assets/banner/premium.jpg',
  'https://rentbabe.com/assets/banner/telegram.jpg',
];

const settings = {
  dots: false,
  slidesToShow: 5,
  slidesToScroll: 3,
  infinite: true,
  swipeToSlide: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};
const customStyles = {
  '.MuiOutlinedInput-input': { padding: '0px !important' },
  '.MuiInputBase-input': {
    padding: '12px 16px !important',
  },
};
interface INextButton {
  image: string;
  onClick: () => void;
}
// interface ITabChip {
//   icon: React.ReactNode;
//   label: string;
//   isActive?: boolean;
//   onClick: () => void;
// }
const NextButton = ({ image, onClick }: INextButton) => {
  const buttonSize = 32;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#00000095"
      borderRadius={99_999_999}
      height={buttonSize}
      width={buttonSize}
      sx={{
        backdropFilter: 'blur(5px)',
        padding: '8px',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <NextImage src={image} height={buttonSize / 2} width={buttonSize / 2} alt=""/>
    </Box>
  );
};

const SearchCard: React.FC<{
  user: Item;
}> = ({ user }) => {
  const router = useRouter();
  const onClick = () => {
    router.push(`/profile/${user?.uid}`);
  };

  return (
    <Card elevation={4} onClick={onClick} sx={{ cursor: 'pointer' }}>
      <CardHeader
        avatar={<Avatar src={user?.urls?.[0] || user?.mobileUrl} variant="circular" />}
        title={`@${user.nickname}`}
        // subheader= {<Typography color="error" variant='caption'>
        //     {`Last seen ${ (Helper.timeSince(user?.time_stamp?.toDate()) ).toLowerCase() } ago`}
        // </Typography>}
      />
    </Card>
  );
};

const Rent = () => {
  const {
    isMobile,
    loading,
    initLoading,
    cardColumnCount,
    Column,
    currentVideoIndex,
    mediaLinks,
    activeTab,
    activeLocation,
    activeRecently,
    activePublic,
    activeGender,
    activeCity,
    goNow,
    locationData,
    recentlySelectionData,
    publicSelectionData,
    genderSelectionData,
    EthnicityData,
    sliderRef,
    items,
    time,
    data,
    reset,
    nickname,
    numberOfProfilesTODAY,
    availableProfileLabel,
    // hasMore,
    open,
    favouritesV2,
    filterIsOpen,
    selectedUid,
    handleTabChange,
    handleSearch,
    handleNext,
    handleApply,
    handlePrev,
    handleLocationChange,
    handleDirectLocationChange,
    handleRecentlyChange,
    handlePublicChange,
    handleGenderChange,
    handleEthnicityChange,
    backVideoHandler,
    handleClose,
    nextVideoHandler,
    fetchMoreData,
    onOpenFilter,
    onCloseFilter,
  } = useRentHook();

  return (
    <Box>
      <Box className={`main ${styles.main}`}>
        <Box className={styles.youtubeVideo}>
          <iframe
            title={`frame-${currentVideoIndex}`}
            src={mediaLinks[currentVideoIndex]}
            width="100%"
            height="100%"
            allowFullScreen
            style={{
              border: 'none',
              overflow: 'hidden',
              borderRadius: '1rem',

              zIndex: 1,
              maxHeight: '454px',
            }}
            allow="autoplay; autoclipboard-write; encrypted-media; picture-in-picture; web-share"
          />

          <Box className={styles.videoBackButton}>
            <NextButton
              image={`https://${process.env.NEXT_PUBLIC_IMAGE_PREFIX}/assets/mui/arrow_back_ios.svg`}
              onClick={backVideoHandler}
            />
          </Box>
          <Box className={styles.videoNextButton}>
            <NextButton
              image={`https://${process.env.NEXT_PUBLIC_IMAGE_PREFIX}/assets/mui/arrow_forward_ios.svg`}
              onClick={nextVideoHandler}
            />
          </Box>

          <Box className={styles.activeVideoCount}>
            <Typography variant="body1" fontWeight={500} color="#fff">
              {currentVideoIndex + 1}/{mediaLinks.length}
            </Typography>
          </Box>
        </Box>
        <Box className={styles.announcementCards}>
          {imgs?.map((item, index) => {
            return (
              <Box key={index} className={styles.announcementBox}>
                <NextImage
                  src={item}
                  alt="Banner"
                  // objectFit="contain-fit"
                  // layout="fill"
                  fill
                  sizes="100%"
                  className={styles.announcementImage}
                />
              </Box>
            );
          })}
        </Box>
      </Box>
      {numberOfProfilesTODAY !== 0 && (
        <Box className={`main ${styles.availableProfile}`}>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            {initLoading ? (
              <SkeletonLine height={30} width={'50%'} />
            ) : (
              <Typography color="#1A1A1A" component="span" variant={isMobile ? 'h4' : 'h2'} whiteSpace={'nowrap'}>
                {/* {numberOfProfilesTODAY} profiles are available TODAY 🔥 */}
                {availableProfileLabel}
              </Typography>
            )}
            {!isMobile && (
              <Box display={'flex'} gap={2} alignItems={'center'}>
                {initLoading ? (
                  <SkeletonAvatar width={26} height={26} />
                ) : (
                  <NextButton
                    image={`https://${process.env.NEXT_PUBLIC_IMAGE_PREFIX}/assets/mui/arrow_back_ios.svg`}
                    onClick={handlePrev}
                  />
                )}

                {initLoading ? (
                  <SkeletonAvatar width={26} height={26} />
                ) : (
                  <NextButton
                    image={`https://${process.env.NEXT_PUBLIC_IMAGE_PREFIX}/assets/mui/arrow_forward_ios.svg`}
                    onClick={handleNext}
                  />
                )}
              </Box>
            )}
          </Box>
          <Slider {...settings} ref={sliderRef}>
            {goNow.map((item, index) => {
              return <BabeCard key={index} babeData={item} isFavourite={true} />;
            })}
          </Slider>
        </Box>
      )}
      <Box className={`main ${styles.filterSection}`}>
        {initLoading ? (
          <SkeletonLine height={30} width={150} />
        ) : (
          <Typography variant={isMobile ? 'h4' : 'h2'} color="#1A1A1A">
            Favourites
          </Typography>
        )}
        <Box
          display={'flex'}
          gap={4}
          sx={{
            width: '100%',
            overflowX: 'auto',
            '::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {favouritesV2?.map((item, index) => {
            return (
              <TabChip
                key={index}
                icon={item?.image}
                label={item?.title}
                isActive={activeTab === index}
                onClick={() => handleTabChange(index)}
              />
            );
          })}
        </Box>

        {isMobile ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Dropdown
              size="small"
              // placeholder="Select Location"
              placeholderText="All countries"
              // sx={customStyles}
              value={activeLocation}
              listData={locationData}
              onChange={handleDirectLocationChange}
            />
            <Badge
              sx={{
                width: '40px',
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #CCC',
                borderRadius: '100px',
                cursor: 'pointer',
              }}
              onClick={onOpenFilter}
            >
              <FiltrerIcon />
            </Badge>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              justifyContent: 'space-between',
              gridTemplateColumns: '1fr 1fr 1fr 0.7fr 1fr 1fr 0.7fr',
              //   gridTemplateColumns: '158px 1fr 200px 158px 160px 158px 160px',
              maxWidth: '1440px',
              gap: '12px',
            }}
          >
            <Dropdown
              size="small"
              // placeholder="Select Location"
              sx={customStyles}
              placeholderText="All countries"
              value={activeLocation}
              listData={locationData}
              onChange={handleLocationChange}
            />
            <Input
              size="small"
              placeholder="Type user name"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {!!time && <CircularProgress color="primary" size={18} />}
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: '100px',
              }}
              inputProps={{ sx: { padding: '12px 24px' } }}
              helperText={!time && !data && nickname ? (reset ? '' : 'Not found') : data && <SearchCard user={data} />}
              onChange={handleSearch}
            />
            <Dropdown
              size="small"
              placeholderText="All profile"
              sx={customStyles}
              value={activeRecently}
              listData={recentlySelectionData}
              onChange={handleRecentlyChange}
            />
            <Dropdown
              size="small"
              placeholderText="All"
              sx={customStyles}
              value={activePublic}
              listData={publicSelectionData}
              onChange={handlePublicChange}
            />
            <Dropdown
              size="small"
              sx={customStyles}
              placeholderText="Gender"
              background
              value={activeGender}
              listData={genderSelectionData}
              onChange={handleGenderChange}
            />
            <Dropdown
              size="small"
              placeholderText="All Type"
              sx={customStyles}
              value={activeCity}
              listData={EthnicityData}
              onChange={handleEthnicityChange}
            />
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleApply}
              loading={loading}
              sx={{
                width: '100%',
                cursor: 'pointer',
              }}
            >
              Apply
            </Button>
          </Box>
        )}
      </Box>
      {/* <Box>
        {loading ? (
          <Box className={`main ${styles.cards}`}>
            {new Array(20)?.fill(null)?.map((_, index) => (
              <SkeletonCardView key={index} />
            ))}
          </Box>
        ) : (
          items?.length && (
            <FixedSizeGrid
              columnCount={cardColumnCount}
              columnWidth={isMobile ? 177 : 276}
              onItemsRendered={() => true}
              height={250}
              rowCount={Math.ceil(items?.length / cardColumnCount)}
              rowHeight={isMobile ? 360 : 420}
              width={isMobile ? 375 : 1440}
              onScroll={(e) => fetchMoreData(e, items?.length)}
              // className={`${styles.cardV2} main`}
              className={styles.cardV3}
              style={{ width: '100%', alignItems: 'center', height: '1000px' }}
              overscanColumnCount={5}
              overscanRowCount={5}
            >
              {Column}
            </FixedSizeGrid>
          )
        )}
      </Box> */}

      {/* Working Code */}
      {/* <FixedSizeGrid
        columnCount={cardColumnCount}
        columnWidth={isMobile ? 177 : 276}
        onItemsRendered={() => true}
        height={250}
        rowCount={Math.ceil(items?.length / cardColumnCount)}
        rowHeight={isMobile ? 360 : 420}
        width={isMobile ? 375 : 1440}
        onScroll={(e) => fetchMoreData(e, items?.length)}
        // className={`${styles.cardV2} main`}
        className={styles.cardV3}
        style={{ width: '100%', alignItems: 'center', height: '1000px' }}
        overscanColumnCount={5}
        overscanRowCount={5}
      >
        {Column}
      </FixedSizeGrid> */}
      {/* React Window Reusable component  */}

      {/* {initLoading ? (
        <Box className={`main ${styles.cards}`}>
          {new Array(20)?.fill(null)?.map((_, index) => (
            <SkeletonCardView key={index} />
          ))}
        </Box>
      ) : ( */}
        <ReactWindow
          columnCount={cardColumnCount}
          columnWidth={isMobile ? 177 : 276}
          onItemsRendered={() => true}
          rowCount={Math.ceil((items?.length || 1) / cardColumnCount)}
          rowHeight={isMobile ? 360 : 420}
          width={isMobile ? 375 : 1440}
          height={window.screenTop}
          onScroll={(e) => fetchMoreData(e, items?.length)}
          className={styles.cardV3}
          overscanColumnCount={5}
          overscanRowCount={5}
          // component={Column}
        >
          {Column}
        </ReactWindow>
      {/* )} */}

      {/* <ReactWindow
        isGrid={true}
        totalColumns={cardColumnCount}
        columnWidth={isMobile ? 177 : 276}
        // onItemsRendered={() => true}
        height={250}
        rowCount={Math.ceil(items?.length / cardColumnCount)}
        rowHeight={isMobile ? 360 : 420}
        width={isMobile ? 375 : 1440}
        handleScroll={(e) => fetchMoreData(e, items?.length)}
        // className={`${styles.cardV2} main`}
        className={styles.cardV3}
        style={{ width: '100%', alignItems: 'center', height: '1000px' }}
        overscanColumnCount={5}
        overscanRowCount={5}
        component={Column}
      /> */}

      {/* <Box>
        {items?.length > 0 && (
          <AutoSizer
            // defaultHeight={250}
            // // defaultWidth={isMobile ? 375 : 1440}
            style={{
              height: '1000px',
              width: "100%",
            }}
          >
            {({ height, width }) => {
              return (
                // <InfiniteLoader
                //   isItemLoaded={(index) => {
                //     console.log('Veer', index);
                //     return index < items?.length || items[index] == null;
                //   }}
                //   // isItemLoaded={isItemLoaded}
                //   // itemCount={Math.ceil(items?.length / cardColumnCount) * cardColumnCount}
                //   itemCount={items?.length}
                //   loadMoreItems={(startIndex, stopIndex) => {
                //     console.log(startIndex, stopIndex);
                //     fetchMoreData();
                //   }}
                // >
                //   {({ onItemsRendered, ref }) => (
                <FixedSizeGrid
                  // ref={ref}
                  columnCount={cardColumnCount}
                  columnWidth={isMobile ? 177 : 276}
                  // onItemsRendered={() => onItemsRendered}
                  height={height || 250}
                  rowCount={Math.ceil(items?.length / cardColumnCount)}
                  rowHeight={isMobile ? 360 : 420}
                  width={width || isMobile ? 375 : 1440}
                  onScroll={(e) => fetchMoreData(e, items?.length, height)}
                  // className={`${styles.cardV2} main`}
                  className={styles.cardV3}
                  style={{ width: '100%', alignItems: 'center', height: `${height || 1000}px` }}
                  overscanRowCount={Math.ceil(items?.length / cardColumnCount)}
                  overscanColumnCount={cardColumnCount}
                >
                  {Column}
                </FixedSizeGrid>
                //   )}
                // </InfiniteLoader>
              );
            }}
          </AutoSizer>
        )}
      </Box> */}
      {/* <AutoSizer
        style={{
          width: '100%',
          maxHeight: '200vh',
          height: '100%',
        }}
      >
        {({ height, width }) => {
          return (
            <InfiniteScroll
              next={() => {}}
              dataLength={items.length}
              // next={fetchMoreData}
              hasMore={hasMore}
              loader={<CircularProgress size={18} />}
            >
              <FixedSizeGrid
                columnCount={cardColumnCount}
                columnWidth={isMobile ? 177 : 276}
                // onItemsRendered={() => onItemsRendered}
                height={250}
                rowCount={Math.ceil(items?.length / cardColumnCount) + 1}
                rowHeight={isMobile ? 360 : 420}
                width={isMobile ? 375 : 1440}
                onScroll={fetchMoreData}
                // className={`${styles.cardV2} main`}
                className={styles.cardV3}
                style={{
                  width: '100%',
                  alignItems: 'center',
                  height: `${Math.ceil(items?.length / cardColumnCount) + 1 * 1000}px'`,
                }}
                overscanRowCount={Math.ceil(items?.length / cardColumnCount) + 1}
                overscanColumnCount={cardColumnCount}
              >
                {Column}
              </FixedSizeGrid>
            </InfiniteScroll>
          );
        }}
      </AutoSizer> */}

      {/* <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<CircularProgress size={18} />}
      >
        <Box className={`main ${styles.cards}`}>
          {loading
            ? new Array(20)?.fill(null)?.map((_, index) => <SkeletonCardView key={index} />)
            : items.map((item: Item, index) => (
                <BabeCard
                  key={index}
                  babeData={item}
                  onClick={() => {
                    setSelectedUid(item?.uid);
                    setOpen(true);
                  }}
                  size={isMobile ? 'small' : 'medium'}
                />
              ))}
        </Box>
      </InfiniteScroll> */}
      <ProfileModalComponents uid={selectedUid} isOpen={open} onClick={handleClose} isMobile= {isMobile} />
      <FilterModal
        filterIsOpen={filterIsOpen}
        onCloseFilter={onCloseFilter}
        time={time}
        data={data}
        nickname={nickname}
        reset={reset}
        handleSearch={handleSearch}
        activeLocation={activeLocation}
        activeRecently={activeRecently}
        activePublic={activePublic}
        activeGender={activeGender}
        activeCity={activeCity}
        locationData={locationData}
        recentlySelectionData={recentlySelectionData}
        publicSelectionData={publicSelectionData}
        genderSelectionData={genderSelectionData}
        EthnicityData={EthnicityData}
        handleLocationChange={handleLocationChange}
        handleRecentlyChange={handleRecentlyChange}
        handlePublicChange={handlePublicChange}
        handleGenderChange={handleGenderChange}
        handleEthnicityChange={handleEthnicityChange}
        handleApply={handleApply}
      />
    </Box>
  );
};

export default Rent;
