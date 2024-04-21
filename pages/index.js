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

export default function Home({ result }) {
  const data = result.data;
  let images = {};

  Object.keys(data).forEach((key) => {
    const value = data[key];
    const item = value['data'];

    let image = '';
    for (let index = 1; index <= 90; index++) {
      const head = `file_data_${index.toString().padStart(2, '0')}`;

      if (item[head] === undefined) {
        break;
      }

      image += item[head];
    }

    images = {
      ...images,
      [key]: {
        row: value['row'],
        data: {
          date: item['date'],
          seq: item['seq'],
          type: item['type'],
          source: item['source'],
          source_url: item['source_url'],
          source_account: item['source_account'],
          image: image,
        },
      },
    };
  });

  return (
    <ParentBox>
      <Header></Header>
      <MainBody images={images}></MainBody>
    </ParentBox>
  );
}

export const getServerSideProps = async () => {
  const response = await fetch(`${process.env.BASE_URL}/api/get`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sheetName: '2024', startIndex: 0, endIndex: 5 }),
  });

  const result = await response.json();

  return { props: { result } };
};
