import React from "react";

interface HTMLTemplateProps {
  zones: any; // Array of data you want to display
  itemName: string; // The value selected from the dropdown for naming
}

const PrintReportFormat: React.FC<HTMLTemplateProps> = ({ zones, itemName }) => {
  return (
    <html>
      <head>
        <title>Stock Ledger Report</title>
        <style>
          {`
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              width: 210mm; /* A4 size width */
              height: 297mm; /* A4 size height */
              background-color: #f4f4f9;
            }

            /* Header Styling */
            .header {
              background-color: #2a3d66;
              color: #ffffff;
              text-align: center;
              padding: 15px;
            }

            .header h1 {
              margin: 0;
              font-size: 30px;
              font-weight: bold;
            }

            .header p {
              margin: 0;
              font-size: 14px;
              font-weight: lighter;
            }

            /* Heading with Flexbox for itemName and title */
            .heading {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 20px;
              margin-bottom: 20px;
              padding: 0 25mm;
              font-size: 16px;
              font-weight: lighter;
            }

            .heading h2 {
              font-size: 24px;
              font-weight: bold;
              color: #333;
            }

            /* Content Area Styling */
            .content {
              padding: 20mm;
              background-color: #ffffff;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
              border-radius: 10px;
            }

            /* Table Styling */
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
            }

            th, td {
              border: 1px solid #ccc;
              padding: 12px;
              text-align: left;
            }

            th {
              background-color: #0056b3;
              color: #ffffff;
              font-weight: bold;
              text-align: center;
            }

            td {
              text-align: right;
            }

            td:first-child, th:first-child {
              text-align: left;
              width: 25%; /* Make text-based columns wider */
            }

            td:nth-child(2), td:nth-child(3), td:nth-child(4), td:nth-child(5), td:nth-child(6), td:nth-child(7), td:nth-child(8) {
              text-align: right; /* Right-align number-based columns */
              width: 12%; /* Smaller width for numeric columns */
            }

            /* Alternating row colors */
            tr:nth-child(odd) {
              background-color: #f9f9f9;
            }

            tr:nth-child(even) {
              background-color: #f1f1f1;
            }

            /* Footer Styling */
            .footer {
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
              background-color: #2a3d66;
              color: white;
              text-align: center;
              padding: 8px 0;
              font-size: 12px;
            }

            /* Print Styling */
            @media print {
              @page {
                size: A4;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
              }
              .content {
                padding: 10mm;
                box-shadow: none;
                border-radius: 0;
              }
              .footer {
                position: fixed;
                bottom: 5mm;
                font-size: 10px;
              }
            }
          `}
        </style>
      </head>
      <body>
        <div className="header">
          <h1>Stock Ledger Report</h1>
        </div>

        <div className="heading">
          <h2>Stock Ledger Details</h2>
          <h2>{itemName}</h2>
        </div>

        <div className="content">
          <table>
            <thead>
              <tr>
                <th>Serial No.</th>
                <th>Title Name</th>
                <th>In Quantity</th>
                <th>Out Quantity</th>
                <th>Rate</th>
                <th>Total In Amount</th>
                <th>Total Out Amount</th>
                <th>Balance Quantity</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((zone: any, index: number) => (
                <tr key={zone.id}>
                  <td>{index + 1}</td>
                  <td>{zone.titleName}</td>
                  <td>{zone.inQty}</td>
                  <td>{zone.outQty}</td>
                  <td>{zone.rate}</td>
                  <td>{zone.totalInAmount}</td>
                  <td>{zone.totalOutAmount}</td>
                  <td>{zone.balQty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="footer">
          <p>Generated on: {new Date().toLocaleDateString()}</p>
        </div>
      </body>
    </html>
  );
};

export default PrintReportFormat;
