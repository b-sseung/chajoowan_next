import { css } from 'styled-components';

export const font = css`
  @font-face {
    font-family: 'BlackHanSans';
    src: url('./fonts/BlackHanSans-Regular.ttf') format('truetype');
  }
`;

export const flexRow = css`
  display: flex;
  flex-direction: row;
`;

export const flexCol = css`
  display: flex;
  flex-direction: column;
`;

export const inputStyle = css`
  border: 1px solid gray;
  border-radius: 50px;
`;
