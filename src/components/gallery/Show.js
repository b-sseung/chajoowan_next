import { useState, useEffect, useReducer } from 'react';
import styled, { css } from 'styled-components';
import { BiTable, BiCalendar } from 'react-icons/bi';
import $ from 'jquery';
import { flexCol, flexRow } from '@/src/css/common';
import { getLocalJson } from '@/pages/api/api';
import { getGridItems } from '@/src/js';
import Image from 'next/image';

const ParentGallery = styled.div(
  flexCol,
  css`
    flex-grow: 1;
    width: 100%;

    @media (min-width: 720px) {
      width: 75vw;
      margin: 0px auto;
    }
  `
);
const HeadGallery = styled.div(
  flexRow,
  css`
    gap: 5px;

    select {
      margin-left: 10px;
      border: 1px solid lightgray;
      border-radius: 10px;

      font-size: 15px;
      font-family: 'Gothic A1';
      text-align: center;

      width: 200px;
    }
  `
);
const GridGallery = styled.div(
  css`
    display: grid;
    grid-gap: 10px;

    --grid-width: calc((75vw - 10px * (--grid-count - 1)) / --grid-count)
    --grid-count: 3

    @media (min-width: 720px) {
      --grid-count: 4;
      grid-template-columns: repeat(var(--grid-count), var(--grid-width));
      grid-auto-rows: var(--grid-width);
    }

    // @media (min-width: 1024px) {
    //   grid-template-columns: repeat(6, 1fr);
    //   grid-auto-rows: 200px;
    // }
  `
);

const SelectBox = ({ onChange }) => {
  const [list, setList] = useState({});

  useEffect(() => {
    const getList = async () => {
      const result = await getLocalJson('/localJson.json', 'source');
      setList(result);
    };
    getList();
  }, []);

  const onChangeValue = (e) => {};

  return (
    <select onChange={(e) => onChangeValue(e)}>
      <option key="none" value="">
        전체
      </option>
      {Object.keys(list).map((key) => {
        const item = list[key];
        return (
          <option key={item['content']} value={key}>
            {item['title']}
          </option>
        );
      })}
    </select>
  );
};

const Gallery = () => {
  const [mode, setMode] = useState('grid');
  const [calendarItems, setCalendarItems] = useState({});
  const [gridItems, setGridItems] = useState({});

  useEffect(() => {
    if (mode === 'grid') {
      const images = async () => {
        const result = await getGridItems(Object.keys(gridItems).length);
        console.log(result);
        setGridItems(Object.assign(gridItems, result));
      };
      images();
    }
  }, [mode]);

  const iconStyle = {
    cursor: 'pointer',
    padding: '5px',
  };

  const sourceChange = () => {};

  return (
    <ParentGallery>
      <HeadGallery>
        <BiTable style={iconStyle} size="30" color={mode === 'grid' ? 'black' : 'lightgray'} onClick={() => setMode('grid')}></BiTable>
        <BiCalendar style={iconStyle} enableBackground="black" size="30" color={mode === 'calendar' ? 'black' : 'lightgray'} onClick={() => setMode('calendar')}></BiCalendar>
        <SelectBox onChange={sourceChange}></SelectBox>
      </HeadGallery>
      <GridGallery>
        {Object.values(gridItems).map((item, index) => {
          console.log(item);
          console.log(item.data);
          console.log(item['data']);
          console.log(item.get('data'));
          const data = item['data'];
          return <Image key={`gridItems[${index}]`} fill style={{ objectFit: 'contain' }} src={data['image']} alt="image"></Image>;
        })}
      </GridGallery>
    </ParentGallery>
  );
};

export default Gallery;
