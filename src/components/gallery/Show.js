import { useState, useReducer } from 'react';
import styled, { css } from 'styled-components';
import { BiTable, BiCalendar } from 'react-icons/bi';
import $ from 'jquery';
import { flexCol, flexRow } from '@/src/css/common';

const ParentGallery = styled.div(flexCol);
const HeadGallery = styled.div(flexRow);
const BodyGallery = styled.div();

const Gallery = () => {
  const [mode, setMode] = useState('calendar');
  const [commonChk, setCommonChk] = useState(false);
  const [joowanChk, setJoowanChk] = useState(false);
  const [taebinChk, setTaebinChk] = useState(false);

  const CheckBox = ({ value, text, checked, onClick }) => {
    return (
      <>
        <input type="checkbox" value={value} id={value} onChange={onClick} checked={checked}></input>
        <label htmlFor={value}>{text}</label>
      </>
    );
  };

  const iconStyle = {
    cursor: 'pointer',
    padding: '5px',
  };

  const targetClick = (e) => {
    switch (e.target.value) {
      case 'common':
        setCommonChk(!commonChk);
        if (!commonChk) {
          setJoowanChk(true);
          setTaebinChk(true);
        } else {
          setJoowanChk(false);
          setTaebinChk(false);
        }

        break;
      case 'joowan':
        setJoowanChk(!joowanChk);
        if (!joowanChk && taebinChk) {
          setCommonChk(true);
        } else {
          setCommonChk(false);
        }
        break;
      case 'taebin':
        setTaebinChk(!taebinChk);
        if (!taebinChk && joowanChk) {
          setCommonChk(true);
        } else {
          setCommonChk(false);
        }
        break;
    }
  };

  return (
    <ParentGallery>
      <HeadGallery>
        <div>
          <CheckBox value="common" text="전체" checked={commonChk} onClick={targetClick}></CheckBox>
          <CheckBox value="joowan" text="차주완" checked={joowanChk} onClick={targetClick}></CheckBox>
          <CheckBox value="taebin" text="이태빈" checked={taebinChk} onClick={targetClick}></CheckBox>
        </div>
        <div>
          <p>상세검색</p>
        </div>
        <div>
          <BiCalendar style={iconStyle} enableBackground="black" size="25" color={mode === 'calendar' ? 'black' : 'lightgray'} onClick={() => setMode('calendar')}></BiCalendar>
          <BiTable style={iconStyle} size="25" color={mode === 'table' ? 'black' : 'lightgray'} onClick={() => setMode('table')}></BiTable>
        </div>
      </HeadGallery>
      <BodyGallery></BodyGallery>
    </ParentGallery>
  );
};

export default Gallery;
