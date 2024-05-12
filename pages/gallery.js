import styled, { css } from 'styled-components';
import { flexCol } from '@/src/css/common';
import Header from '@/src/components/Header';
import Gallery from '@/src/components/gallery/Show';

const ParentBox = styled.div(
  flexCol,
  css`
    align-items: center;
    height: 100vh;
    background: white;
    overflow-x: hidden;

    /* iOS only */
    @supports (-webkit-touch-callout: none) {
      height: -webkit-fill-available;
    }
  `
);

const gallery = () => {
  return (
    <ParentBox>
      <Header></Header>
      <Gallery></Gallery>
    </ParentBox>
  );
};

export default gallery;
