import DatePicker from 'react-datepicker';
import styled, { css } from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';
import $ from 'jquery';
import { useState, forwardRef, useEffect, useReducer, useContext } from 'react';
import { getLocalJson } from '@/pages/api/api';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import { flexRow, flexCol } from '@/src/css/common';

// css
const ParentStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',

  height: '100vh',
  background: 'white',
  padding: '15px',

  position: 'relative',
};

const CustomDatePicker = styled.div(
  css`
    .custom-day {
      width: 28px;
      height: 28px;
      text-align: center;
    }
    .gray-day {
      color: #aba8b9;
    }
    .selected-day {
      background: #1ddb16;
      border-radius: 50%;
      font-weight: 700;
    }
  `
);

const DateInput = {
  width: '240px',
  padding: '10px 0px',
  background: 'white',
  border: '1px solid gray',
  borderRadius: '10px',
};

const ImageBox = styled.div(
  flexRow,
  css`
    width: 100%;
    overflow-x: scroll;
    padding: 10px;

    border: 1px dashed black;

    :last-child {
      margin-right: 0px;
    }

    img {
      margin-right: 10px;
    }
  `
);

// tag
const RadioButton = ({ value, name, text, onChange }) => {
  return (
    <>
      <input type="radio" value={value} name={name} id={value} onChange={() => onChange(name, value)}></input>
      <label htmlFor={value} style={{ marginLeft: '5px', marginRight: '10px' }}>
        {text}
      </label>
    </>
  );
};

const DatePickerInput = forwardRef(({ value, onClick }, ref) => {
  return (
    <button style={DateInput} onClick={onClick} ref={ref}>
      {value}
    </button>
  );
});

DatePickerInput.displayName = 'DatePickerInput';

const SelectBox = ({ name, onChange }) => {
  const [list, setList] = useState({});

  useEffect(() => {
    const getList = async () => {
      const result = await getLocalJson('/localJson.json', 'source');
      setList(result);
    };
    getList();
  }, []);

  const onChangeValue = (e) => {
    onChange('source', $(`select[name=${name}] option:selected`).val());
  };

  return (
    <select name={name} style={{ border: '1px solid black' }} onChange={(e) => onChangeValue(e)}>
      <option key="none" value="">
        선택하기
      </option>
      {Object.keys(list).map((key) => {
        const item = list[key];
        return (
          <option key={item['content']} value={item['content']}>
            {item['title']}
          </option>
        );
      })}
    </select>
  );
};

const ImageView = ({ data }) => {
  return <Image width={200} height={200} layout="fill" style={{ objectFit: 'contain' }} alt="" src={data}></Image>;
};

// event
const uploadFileForm = (state, action) => {
  state = { ...state, [action.type]: action.value };
  return state;
};

const UploadGallery = () => {
  const [initState, dispatch] = useReducer(uploadFileForm, {
    date: new Date(),
    file_data: '',
    source: '',
    source_url: '',
    source_account: '',
    type: '',
  });

  const [selectDate, setSelectDate] = useState(new Date());
  const [month, setMonth] = useState(new Date().getMonth());
  const [images, setImages] = useState([]);

  const handleMonthChange = (date) => {
    setMonth(date.getMonth());
  };

  const changeState = (type, value) => {
    dispatch({ type: type, value: value });
  };

  const onChangeEvent = (e, target) => {
    changeState(target, e.target.value);
  };
  const onLoadFile = async (e) => {
    const extensions = [];
    const thumnails = [];

    let fileList = e.target.files;

    for (let i = 0; i < fileList.length; i++) {
      let file = fileList[i];
      extensions.push(file['type']);

      const newFile = await imageCompression(fileList[i], {
        maxSizeMB: 4.5,
        maxWidthOrHeight: 3840,
      });

      const resizingFile = new File([newFile], file['type'], { type: file['type'] });

      let fileReader = new FileReader();
      fileReader.onload = () => {
        const result = fileReader.result;

        thumnails.push(result);
        changeState('file_data', [...thumnails]);
        setImages(thumnails);
      };

      fileReader.readAsDataURL(resizingFile);
    }

    changeState('file_extension', extensions);
  };

  const onSubmit = async () => {
    $('#load').css('display', 'block');
    const date = initState['date'];
    const bodyYear = date.getFullYear();
    const bodyDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    const response = await fetch('/api/sheet-filter', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sheetName: bodyYear, columnId: 'date', word: bodyDate, resColumn: ['seq'] }),
    });

    const sheets = await response.json();

    let maxSeq = 0;
    if (Object.keys(sheets['data']).length > 0) {
      Object.values(sheets.data).forEach((value) => (maxSeq = maxSeq < Number.parseInt(value['seq']) ? Number.parseInt(value['seq']) : maxSeq));
    }

    const images = initState['file_data'];
    for (let index = 0; index < images.length; index++) {
      const imgArr = images[index].toString().match(new RegExp(`.{1,${49999}}`, 'g'));
      let fileData = {};
      imgArr.forEach((str, i) => (fileData = { ...fileData, [`file_data_${(i + 1).toString().padStart(2, '0')}`]: `'${str}` }));

      const res_row = {
        ...fileData,
        date: bodyDate,
        seq: Number.parseInt(maxSeq) + index + 1,
        type: initState['type'],
        source: initState['source'],
        source_url: initState['source_url'],
        source_account: initState['source_account'],
        file_extension: initState['file_extension'][index],
      };

      const insertResponse = await fetch('/api/insert', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          row: res_row,
          title: bodyYear,
        }),
      });
    }
    $('#load').css('display', 'none');
    $('#source_account').val('');
    $('#source_url').val('');

    setImages([]);
    changeState('file_data', '');
    changeState('source_url', '');
    changeState('cource_account', '');
  };

  return (
    <>
      <div style={ParentStyle}>
        <div>
          <p>업로드 일자</p>
          <CustomDatePicker>
            <DatePicker
              selected={selectDate}
              onChange={(date) => {
                changeState('date', date);
                setSelectDate(date);
              }}
              dateFormat="yyyy-MM-dd"
              customInput={<DatePickerInput />}
              onMonthChange={handleMonthChange}
              dayClassName={(d) =>
                d.getMonth() === month
                  ? d.getDate() === selectDate.getDate() && d.getMonth() === selectDate.getMonth()
                    ? 'custom-day selected-day'
                    : 'custom-day'
                  : 'custom-day gray-day'
              }
            ></DatePicker>
          </CustomDatePicker>
        </div>
        <div>
          <p>종류</p>
          <RadioButton value="image" name="type" text="이미지" onChange={changeState}></RadioButton>
          <RadioButton value="video" name="type" text="영상" onChange={changeState}></RadioButton>
        </div>
        <div>
          <p>출처</p>
          <SelectBox onChange={changeState} name="source"></SelectBox>
        </div>
        {initState['source'] !== '' && (
          <div>
            <p>출처 계정</p>
            <input id="source_account" style={{ width: '50%', border: '1px solid black' }} onChange={(e) => onChangeEvent(e, 'source_account')}></input>
          </div>
        )}
        {initState['source'] !== '' && (
          <div>
            <p>출처 URL</p>
            <input id="source_url" style={{ width: '100%', border: '1px solid black' }} onChange={(e) => onChangeEvent(e, 'source_url')}></input>
          </div>
        )}
        {initState['type'] !== '' && (
          <div>
            <p style={{ display: 'inline', marginRight: '15px' }}>{initState['type'] === 'image' ? '이미지' : '썸네일'}</p>
            <label style={{ cursor: 'pointer', padding: '0px 15px', border: '1px dotted gray', borderRadius: '50px' }} htmlFor="fileImage">
              선택하기
            </label>
            <input id="fileImage" style={{ display: 'none' }} type="file" onChange={onLoadFile} multiple></input>
          </div>
        )}
        {images.length > 0 && (
          <ImageBox>
            {images.length > 0 &&
              images.map((data, index) => {
                return <ImageView key={index} data={data}></ImageView>;
              })}
          </ImageBox>
        )}
        <button
          style={{ margin: '5px auto', display: 'inline', padding: '10px 30px', borderRadius: '100px', background: 'limegreen', color: 'white', fontWeight: 'bold' }}
          onClick={onSubmit}
        >
          등록하기
        </button>
      </div>
      <div
        id="load"
        style={{
          display: 'none',
          width: '100%',
          height: '100%',
          position: 'absolute',
          textAlign: 'center',
          background: '#55555588',
          fontSize: '30px',
          fontWeight: 'bold',
        }}
      >
        loading...
      </div>
    </>
  );
};

export default UploadGallery;
