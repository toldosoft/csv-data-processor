import type { NextApiRequest, NextApiResponse } from "next";
import { Formidable } from "formidable";
import fs from "fs";
import Papa from "papaparse";

interface Count {
  [key: string]: number;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// Name the function directly after the HTTP method it supports
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const form = new Formidable();
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "File upload error" });
    }
    const fileArray = files.file instanceof Array ? files.file : [files.file];
    if (fileArray.length === 0 || !fileArray[0]) {
      return res.status(400).json({ error: "No files were uploaded" });
    }
    const file = fileArray[0];
    fs.readFile(file.filepath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Error reading file" });
      }
      Papa.parse(data, {
        complete: (results) => {
          const counts: Count = {};
          results.data.forEach((row: string[]) => {
            const value = row[0];
            counts[value] = (counts[value] || 0) + 1;
          });
          res.status(200).json(counts);
        },
        header: true,
      });
    });
  });
}
