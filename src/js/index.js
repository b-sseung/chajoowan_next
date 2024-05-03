export const getImages = () => {
  const fetchImages = async () => {
    return new Promise((resolve, reject) => {
      const getData = fetch('http://localhost:3000/api/get', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sheetName: '2024', startIndex: 0, endIndex: 5 }),
      }).then((res) => res.json());

      resolve(getData);
    });
  };

  return fetchImages().then((res) => {
    const data = res.data;
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

    return images;
  });
};
