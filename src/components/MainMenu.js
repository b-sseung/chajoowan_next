import $ from 'jquery';
import styled, { css } from 'styled-components';
import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Image from 'next/image';
import { CgProfile } from 'react-icons/cg';
import { FaWeibo, FaInstagram, FaRegBuilding } from 'react-icons/fa';
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';
import { flexCol, flexRow } from '../css/common';

const UnderMenu = styled.div(
  flexCol,
  css`
    align-items: center;

    position: absolute;
    background: lightgray;

    border-radius: 20px 20px 0 0;

    width: min(98vw, 600px);
    height: 100%;

    top: calc(100% - 50px);

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
        top: calc(100% - 50px);
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
        top: calc(100% - 55px);
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
        <Image layout="fill" objectFit="cover" src={item['image']} alt="image"></Image>
      </Img>
      <Alt>
        <div>{item['date']}</div>
        <div>{item['source_account']}</div>
      </Alt>
      {isPlay ? <MdOutlineCheckBox style={checkBoxStyle}></MdOutlineCheckBox> : <MdOutlineCheckBoxOutlineBlank style={checkBoxStyle}></MdOutlineCheckBoxOutlineBlank>}
    </Item>
  );
};

const InfoItem = ({ text, link, type }) => {
  const type1 = {
    padding: '10px',
    width: 'calc(100% / 2)',
    aspectRatio: '1 / 1',
  };
  const type2 = {
    padding: '10px',
    width: 'calc(100% / 3)',
    aspectRatio: '1 / 1',
  };
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
          </SwipeBox>
        </SwiperSlide>
        <SwiperSlide>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
              <InfoItem text="인물소개" value="1" link="" type="type1"></InfoItem>
              <InfoItem text="인스타그램" value="2" link="" type="type1"></InfoItem>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
              <InfoItem text="웨이보" value="3" link="" type="type2"></InfoItem>
              <InfoItem text="소속사" value="4" link="" type="type2"></InfoItem>
              <InfoItem text="공식홈페이지" value="5" link="" type="type2"></InfoItem>
            </div>
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
