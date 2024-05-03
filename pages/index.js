import Header from '@/src/components/Header';
import MainBody from '@/src/components/MainBody';
import styled, { css } from 'styled-components';
import { flexCol } from '@/src/css/common';
const ParentBox = styled.div(
  flexCol,
  css`
    align-items: center;
    height: 100vh;
    background: white;
    overflow-x: hidden;
  `
);

const index = () => {
  return (
    <ParentBox>
      <Header></Header>
      <MainBody></MainBody>
    </ParentBox>
  );
};

export default index;
