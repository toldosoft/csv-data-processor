"use client";

import { useState } from "react";
import Papa from "papaparse";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [selectedColumn, setSelectedColumn] = useState(0);
  const [secondColumn, setSecondColumn] = useState(0);
  const [columns, setColumns] = useState([]);
  const [rawData, setRawData] = useState([]); // Stores the raw data

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files) {
      setFile(files[0]);
      setLoading(true);
      Papa.parse(files[0], {
        complete: function(results) {
          setColumns(results.data[0] || []);
          setRawData(results.data.slice(1));
          setLoading(false);
        },
        header: false,
        skipEmptyLines: true
      });
    }
  };

  const handleUpload = () => {
    processColumnData(rawData); // Process data using the selected column
  };

  const processColumnData = (data) => {
    const counts = {};
    const uniqueCheck = new Set(); // To check unique combinations of primary and secondary values
    
    data.forEach((row) => {
      const primaryValue = row[selectedColumn];
      const secondaryValue = row[secondColumn];
      
      const uniqueKey = `${primaryValue}-${secondaryValue}`; // Creates a unique key by combining the two values
  
      if (primaryValue && !uniqueCheck.has(uniqueKey)) {
        counts[primaryValue] = (counts[primaryValue] || 0) + 1;
        uniqueCheck.add(uniqueKey); // Adds the unique combination to the set
      }
    });
    
    setData(counts);
  };
  

  const handleChangePrimaryColumn = (event) => {
    setSelectedColumn(parseInt(event.target.value, 10));
  };

  const handleChangeSecondColumn = (event) => {
    setSecondColumn(parseInt(event.target.value, 10));
  };

  return (
    <div className="max-w-lg mx-auto my-10 p-4 border rounded shadow-lg">
      <h1 className="text-2xl font-semibold text-center mb-4">CSV Data Processor</h1>
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
        />
      </div>
      {columns.length > 0 && (
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-400">Primary Column:</label>
            <select
              onChange={handleChangePrimaryColumn}
              value={selectedColumn}
              className="block w-full p-2 border rounded shadow-sm text-gray-700"
            >
              {columns.map((col, index) => (
                <option key={index} value={index}>{col}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-400">Filter Column (unique):</label>
            <select
              onChange={handleChangeSecondColumn}
              value={secondColumn}
              className="block w-full p-2 border rounded shadow-sm text-gray-700"
            >
              {columns.map((col, index) => (
                <option key={index} value={index}>{col}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={loading || !file || rawData.length === 0}
        className={`w-full p-3 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 ${loading || !file || rawData.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? "Processing..." : "Upload and Process"}
      </button>
      {data && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Results:</h3>
          <ul className="list-disc pl-5">
            {Object.keys(data).map(key => (
              <li key={key} className="text-sm text-gray-400">{key}: {data[key]}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadPage;