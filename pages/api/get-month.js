import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export const config = {
  api: {
    responseLimit: false,
  },
};

const handler = async (req, res) => {
  try {
    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file']; // 해당 API로 sheets를 손대겠다는 범위 설정입니다.

    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: SCOPES,
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();

    const { body } = req;

    const sheets = doc.sheetsByTitle[body.sheetName];
    const rows = await sheets.getRows();
    const year = body.year;
    const month = body.month;

    // const table = rows.filter((row) => row.get(body.columnId).indexOf(body.word) !== -1);
    const table = rows.sort((r1, r2) => {
      const date1 = r1.get('date').slice(0, 10);
      const date2 = r2.get('date').slice(0, 10);

      if (date1 < date2) {
        return 1;
      } else if (date1 == date2) {
        const seq1 = r1.get('seq');
        const seq2 = r2.get('seq');

        if (seq1 < seq2) {
          return 1;
        } else {
          return -1;
        }
      } else {
        return -1;
      }
    });

    let result = {};
    table.forEach((element, index) => {
      const [currentYear, currentMonth] = element.get('date').slpit('-');
      if (currentYear !== year || currentMonth !== month) return;

      result = { ...result, [index]: { row: element.rowNumber, data: element.toObject() } };
    });

    return res.status(200).json({ data: result });
  } catch (e) {
    console.error('Error: ' + e);
    return res.status(500).json({ message: e });
  }
};

export default handler;
