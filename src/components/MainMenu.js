import $ from 'jquery';
import styled, { css } from 'styled-components';
import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Image from 'next/image';
import { CgProfile } from 'react-icons/cg';
import { FaWeibo, FaInstagram, FaRegBuilding, FaGlobe } from 'react-icons/fa';
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';
import { LoadingStyle, flexCol, flexRow } from '../css/common';
import Link from 'next/link';

const UnderMenu = styled.div(
  flexCol,
  css`
    align-items: center;

    position: absolute;
    background: lightgray;

    border-radius: 20px 20px 0 0;

    width: min(98vw, 600px);
    height: 100%;
    color: black;

    top: calc(100% - 60px);

    &.open {
      animation: open-animation 0.2s linear;
      animation-fill-mode: forwards;
    }

    &.close {
      animation: close-animation 0.2s linear;
      animation-fill-mode: forwards;
    }

    @keyframes open-animation {
      from {
        top: calc(100% - 60px);
      }
      to {
        top: 0;
      }
    }

    @keyframes close-animation {
      from {
        top: 0;
      }
      to {
        top: calc(100% - 60px);
      }
    }
  `
);

const MenuHeader = styled.div(
  flexRow,
  css`
    width: 100%;
    text-align: center;

    font-weight: bold;
    font-size: 15px;
    color: black;

    margin: 20px 0;
    div {
      cursor: pointer;
      flex-basis: 1px;
      flex-grow: 1;
    }
  `
);

const SwipeBox = styled.div(
  css`
    width: 100%;
    height: 100%;

    overflow-y: scroll;

    /* ( 크롬, 사파리, 오페라, 엣지 ) 동작 */
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none; /* 인터넷 익스플로러 */
    scrollbar-width: none; /* 파이어폭스 */
  `
);
const Item = styled.div(
  flexRow,
  css`
    width: 100%;
    height: max(calc(100% / 6), 55px);

    padding: 10px 20px;
    box-sizing: border-box;

    gap: 10px;
    align-items: center;

    cursor: pointer;

    & + div {
      border-top: 1px dotted gray;
    }
  `
);

const Img = styled.div(
  css`
    height: 100%;
    aspect-ratio: 1 / 1;

    position: relative;
  `
);

const Alt = styled.div(
  flexCol,
  css`
    flex-grow: 1;

    & > div:nth-child(1) {
      font-weight: bold;
    }
    & > div:nth-child(2) {
      font-size: 12px;
    }
  `
);

const NextContentItem = ({ row, isPlay, index, onClickItem }) => {
  const checkBoxStyle = {
    width: '18px',
    height: '18px',
  };

  const item = row['data'];
  return (
    <Item onClick={() => onClickItem(index)}>
      <Img>
        <Image fill style={{ objectFit: 'contain' }} src={item['image']} alt="image"></Image>
      </Img>
      <Alt>
        <div>{item['date']}</div>
        <div>{item['source_account']}</div>
      </Alt>
      {isPlay ? <MdOutlineCheckBox style={checkBoxStyle}></MdOutlineCheckBox> : <MdOutlineCheckBoxOutlineBlank style={checkBoxStyle}></MdOutlineCheckBoxOutlineBlank>}
    </Item>
  );
};

const InfoStyle = styled.div(
  css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    font-size: 10px;
    margin: 10px;
    aspect-ratio: 1 / 1;
    justify-content: center;

    border: 1px dashed white;
    border-radius: 10px;

    cursor: pointer;

    @media screen and (max-width: 400px) {
      p {
        display: none;
      }
    }
  `
);

const InfoItem = ({ icon, text, link }) => {
  return (
    <Link href={link} style={{ width: '20%' }}>
      <InfoStyle>
        {icon}
        <p>{text}</p>
      </InfoStyle>
    </Link>
  );
};

const MainMenu = ({ rows, onClickEvent }) => {
  const swiperRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [menuIndex, setMenuIndex] = useState('');
  const [playIndex, setPlayIndex] = useState(0);

  const onSlideChange = (index, e) => {
    $(e)
      .parent()
      .find('div')
      .each((i, item) => {
        $(item).css('color', 'black');
      });

    if (!menuOpen) {
      setMenuOpen(!menuOpen);
      setMenuIndex(index);

      $(e).css('color', 'white');
      swiperRef.current.swiper.slideTo(index);
    } else {
      if (menuIndex === index) {
        setMenuOpen(!menuOpen);
      } else {
        setMenuIndex(index);
        $(e).css('color', 'white');
        swiperRef.current.swiper.slideTo(index);
      }
    }
  };

  const clickNextcontent = (index) => {
    $('#menu0').css('color', 'black');
    setMenuOpen(false);
    setPlayIndex(index);
    onClickEvent(index);
  };

  return (
    <UnderMenu className={menuOpen === null ? '' : menuOpen ? 'open' : 'close'}>
      <div style={{ width: 'min(30vw, 150px)', height: '5px', borderRadius: '10px', background: 'gray', marginTop: '3px' }}></div>
      <MenuHeader>
        <div id="menu0" onClick={(e) => onSlideChange(0, e.target)}>
          다음 컨텐츠
        </div>
        <div id="menu1" onClick={(e) => onSlideChange(1, e.target)}>
          정보
        </div>
        <div id="menu2" onClick={(e) => onSlideChange(2, e.target)}>
          관련 컨텐츠
        </div>
      </MenuHeader>
      <Swiper
        style={{ width: '100%', height: '100%', marginTop: '5px' }}
        onSlideChange={(swiper) => onSlideChange(swiper.activeIndex, $('#menu' + swiper.activeIndex))}
        ref={swiperRef}
        spaceBetween={1}
        slidesPerView={1}
      >
        <SwiperSlide>
          <SwipeBox>
            <div style={{ fontSize: '12px', padding: '10px', textAlign: 'right', cursor: 'pointer', borderBottom: '1px dotted gray' }}>더보기 ＞</div>
            {Object.values(rows).map((item, index) => {
              return <NextContentItem key={`nexContent${index}`} row={item} isPlay={playIndex === index} index={index} onClickItem={clickNextcontent}></NextContentItem>;
            })}
            {rows.length === undefined ? (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LoadingStyle></LoadingStyle>
              </div>
            ) : (
              ''
            )}
          </SwipeBox>
        </SwiperSlide>
        <SwiperSlide style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <InfoItem icon={<CgProfile style={{ width: '30px', height: '30px' }} />} text="인물소개" link="https://namu.wiki/w/%EC%B0%A8%EC%A3%BC%EC%99%84"></InfoItem>
            <InfoItem icon={<FaInstagram style={{ width: '30px', height: '30px' }} />} text="인스타그램" link="https://www.instagram.com/chajoowan"></InfoItem>
            <InfoItem
              icon={<FaWeibo style={{ width: '30px', height: '30px' }} />}
              text="웨이보"
              link="https://m.weibo.cn/p/index?extparam=车柱完ChaJooWan&containerid=10080811d1ebc98c8169ee313fcc77d25a2bdb&luicode=10000011&lfid=100103type%3D1%26q%3D차주완"
            ></InfoItem>
            <InfoItem icon={<FaGlobe style={{ width: '30px', height: '30px' }} />} text="공식홈페이지" link="https://post.naver.com/helloworldent"></InfoItem>
            <InfoItem icon={<FaRegBuilding style={{ width: '30px', height: '30px' }} />} text="소속사" link="https://www.instagram.com/official.helloworldent/"></InfoItem>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div style={{ width: '100%', height: '100%', background: 'yellow' }}></div>
        </SwiperSlide>
      </Swiper>
    </UnderMenu>
  );
};

export default MainMenu;
