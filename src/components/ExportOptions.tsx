import type { ScheduleEntry } from '../utils/depreciation';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

type ExportOptionsProps = {
  schedule: ScheduleEntry[];
  assetName: string;
};

export function ExportOptions({ schedule, assetName }: ExportOptionsProps) {
  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Year', 'Depreciation (₦)', 'Accumulated Depreciation (₦)', 'Book Value (₦)'];
    const csvRows = [
      headers.join(','),
      ...schedule.map(entry => 
        [
          entry.year,
          entry.depreciation.toFixed(2),
          entry.accumulated.toFixed(2),
          entry.bookValue.toFixed(2)
        ].join(',')
      )
    ];
    
    const csvContent = csvRows.join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    const filename = `${assetName.replace(/\s+/g, '_')}_depreciation_schedule.csv`;
    
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // @ts-ignore - jsPDF types are not fully compatible with TypeScript
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(`Depreciation Schedule: ${assetName}`, 14, 20);
    
    // Add asset details
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Prepare table data
    const tableColumn = ['Year', 'Depreciation (₦)', 'Accumulated Depreciation (₦)', 'Book Value (₦)'];
    const tableRows = schedule.map(entry => [
      entry.year.toString(),
      entry.depreciation.toFixed(2),
      entry.accumulated.toFixed(2),
      entry.bookValue.toFixed(2)
    ]);
    
    // @ts-ignore - autoTable is added by jspdf-autotable
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] }
    });
    
    // Save the PDF
    const filename = `${assetName.replace(/\s+/g, '_')}_depreciation_schedule.pdf`;
    doc.save(filename);
  };

  return (
    <div className="mt-4 flex justify-end space-x-3">
      <button
        onClick={exportToCSV}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        Export to CSV
      </button>
      
      <button
        onClick={exportToPDF}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
        </svg>
        Export to PDF
      </button>
    </div>
  );
}


