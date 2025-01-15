import React from 'react'
import DownloadIcon from '@mui/icons-material/Download';
import { Tooltip } from '@mui/material';
import { saveAs } from 'file-saver';
const DownloadInvoice = ({row}) => {
    const handleDownload = (row) => {
        const fileName = `${row.invoice}.txt`;
        const fileContents = `Invoice: ${row.invoice}\nDate: ${row.invoiceDate}\nType: ${row.type}\nPeriod: ${row.period}`;
        
        const blob = new Blob([fileContents], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, fileName);
      };
  return (
<>
<Tooltip title="Download Invoice">
            <DownloadIcon
              sx={{ cursor: 'pointer' }}
              onClick={() => handleDownload(row)}
            />
          </Tooltip>

</>
  )
}

export default DownloadInvoice
