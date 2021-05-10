import { ChangeEvent, useState } from 'react';
import './App.css';
import Papa from 'papaparse';
import { api } from './api';

function FileUploader(): JSX.Element {
  const [headers, setHeaders] = useState<string[]>([]); // List of all header names
  const [idCol, setIdCol] = useState<number>(0); // The column index to use as ID.
  const [textCol, setTextCol] = useState<number>(0); // The column index to use as text.
  const [csv, setCsv] = useState<File>(); // The uploaded file.

  const readHeader = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        setCsv(file);
        // Parse just the first line and store in headers.
        Papa.parse<string>(file, {
          step: (result, parser) => {
            setHeaders(result.data);
            parser.abort(); // Stop after the first line.
          },
        });
      }
    }
  };

  const selectIdHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    setIdCol(Number(event.target.value));
  };

  const selectTextHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    setTextCol(Number(event.target.value));
  };

  const sendData = () => {
    const parseCsv = (result: Papa.ParseResult<string[]>) => {
      api.insertTexts(
        result.data
          .slice(1) // Ignore header row.
          .map((x) => ({ group_id: x[idCol], text: x[textCol] }))
      );
    };
    if (csv !== undefined) {
      Papa.parse<string[]>(csv, {
        complete: parseCsv,
        skipEmptyLines: true,
      });
    }
  };

  const headerList = headers.map((h, i) => (
    <option value={i} key={i}>
      {h}
    </option>
  ));

  return (
    <div>
      <input type="file" name="file" accept=".csv" onChange={readHeader} />
      <label>
        Select group ID column.
        <select onChange={selectIdHandler}> {headerList} </select>
      </label>
      <label>
        Select text column.
        <select onChange={selectTextHandler}> {headerList} </select>
      </label>
      <button onClick={sendData}>Send</button>
    </div>
  );
}

export default FileUploader;
