import { useState, useEffect, useRef } from 'react';
import { BiPause, BiSkipPrevious, BiSkipNext, BiSolidHeartCircle, BiSolidHeart, BiX } from 'react-icons/bi';
import styled, { css } from 'styled-components';
import { flexCol, flexRow, LoadingStyle } from '../css/common';
import MainMenu from './MainMenu';
import Image from 'next/image';
import { getImages } from '../js';

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

const IconBox = styled.div(
  flexRow,
  css`
    align-items: center;
    margin-bottom: 20px;
  `
);

const Pause = styled(BiPause)`
  border: 2px solid black;
  border-radius: 50px;
  width: 2.5em;
  height: 2.5em;

  margin: 0 30px;
`;

const PlayBox = styled.div(
  flexRow,
  css`
    width: min(500px, 90vw);

    align-items: center;

    p {
      margin: 0;
    }
  `
);

const PlayBar = styled.div(
  css`
    height: 3px;
    background: black;
    border-radius: 100px;
    margin: 0 10px;
  `
);

const PlayCircle = styled(BiSolidHeartCircle)`
  width: 25px;
  height: 25px;
  background: white;
  top: -11px;
  left: 25%;
  color: red;
  position: absolute;
`;

const playImageStyle = {
  aspectRatio: '1 / 1',
  flexGrow: '1',
  border: '1px solid gray',
  position: 'relative',
};

const playImageLoadingStyle = {
  ...playImageStyle,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const PlayImageBox = () => {};

const MainBody = () => {
  const [playList, setPlayList] = useState({});
  const [playListImage, setPlayListImage] = useState();
  const [playIndex, setPlayIndex] = useState(0);

  useEffect(() => {
    const images = async () => {
      const result = await getImages();
      setPlayList(result);
    };
    images();
  }, []);

  useEffect(() => {
    const changeImage = () => {
      if (Object.keys(playList).length == 0) return;
      const row = playList[playIndex]['data'];
      setPlayListImage(row['image']);
    };
    changeImage();
  }, [playList, playIndex]);

  return (
    <ColumnBox style={{ flexGrow: '1', width: '100%', position: 'relative', overflowY: 'hidden', color: 'black' }}>
      <div style={playListImage == null ? playImageLoadingStyle : playImageStyle}>
        {playListImage == null ? <LoadingStyle></LoadingStyle> : <Image fill style={{ objectFit: 'contain' }} src={playListImage} alt="image"></Image>}
      </div>
      <ColumnBox style={{ height: '150px', marginBottom: '70px' }}>
        <IconBox>
          <BiSkipPrevious style={{ width: '2.5em', height: '2.5em' }}></BiSkipPrevious>
          <Pause></Pause>
          <BiSkipNext style={{ width: '2.5em', height: '2.5em' }}></BiSkipNext>
        </IconBox>
        <PlayBox>
          <p>05:06</p>
          <div style={{ flexGrow: 1, position: 'relative' }}>
            <PlayBar></PlayBar>
            <PlayCircle></PlayCircle>
          </div>
          <p>19:99</p>
        </PlayBox>
      </ColumnBox>
      <MainMenu rows={playList} onClickEvent={setPlayIndex}></MainMenu>
    </ColumnBox>
  );
};

export default MainBody;
