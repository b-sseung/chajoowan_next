import styled, { css } from 'styled-components';

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

export const LoadingStyle = styled.div(
  css`
    width: 40px;
    height: 40px;
    border: 5px solid #3498db;
    border-top: 5px solid transparent;
    border-radius: 50%;
    animation: rotate 1s linear infinite;

    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `
);
