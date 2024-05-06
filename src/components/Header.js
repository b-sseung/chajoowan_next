import styled, { css } from 'styled-components';
import { flexCol } from '../css/common';

const ColumnBox = styled.div(
  flexCol,
  css`
    align-items: center;

    font-family: 'Gothic A1', sans-serif;
    font-style: normal;

    justify-content: center;

    p {
      margin: 0;
    }
  `
);

const Header = () => {
  const today = new Date();
  const debut = new Date('2021-11-24');
  let diff = Math.abs(today.getTime() - debut.getTime());
  diff = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return (
    <ColumnBox style={{ height: '100px', color: 'black' }}>
      <p style={{ fontFamily: 'Black Han Sans', fontSize: '25px' }}>{diff}일 째 사랑하는 중</p>
      <p style={{ fontSize: '13px' }}>차주완 ♥ 찻잔</p>
    </ColumnBox>
  );
};

export default Header;
