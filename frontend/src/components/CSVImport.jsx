import React, { useRef, useState } from 'react';
import { FormErrorSummary, SuccessMessage } from './FormHelpers';

// CSV Import Component
export const CSVImport = ({ 
  title, 
  templateType = 'recipients', 
  columns, 
  onImport, 
  onClose
}) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // CSV templates for download
  const TEMPLATES = {
    recipients: [
      { name: 'Hope Shelter', type: 'shelter', address: '123 Main St', phone: '555-0101', email: 'hope@shelter.org', people_served: '150' },
      { name: 'Food Bank', type: 'food_bank', address: '456 Oak Ave', phone: '555-0102', email: 'info@foodbank.org', people_served: '5000' }
    ],
    foodItems: [
      { name: 'Mixed Vegetables', category: 'vegetables', quantity: '50', unit: 'kg', description: 'Fresh vegetables' },
      { name: 'Bread', category: 'bakery', quantity: '20', unit: 'loaves', description: 'Day-old bread' }
    ]
  };

  const downloadTemplate = () => {
    const template = TEMPLATES[templateType] || TEMPLATES.recipients;
    const headers = Object.keys(template[0]);
    const csv = [
      headers.join(','),
      ...template.map(row => headers.map(h => `"${row[h]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateType}_template.csv`;
    a.click();
  };

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const rows = [];
    const parseErrors = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;

      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row = {};

      headers.forEach((header, idx) => {
        row[header] = values[idx] || '';
      });

      // Basic validation
      if (templateType === 'recipients') {
        if (!row.name) parseErrors.push(`Row ${i}: Organization name is required`);
        if (!row.type) parseErrors.push(`Row ${i}: Type is required`);
      } else if (templateType === 'foodItems') {
        if (!row.name) parseErrors.push(`Row ${i}: Food name is required`);
        if (!row.quantity || isNaN(row.quantity)) parseErrors.push(`Row ${i}: Invalid quantity`);
      }

      rows.push(row);
    }

    return { rows, errors: parseErrors };
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        const { rows, errors: parseErrors } = parseCSV(text);
        setFile(selectedFile);
        setPreview(rows.slice(0, 5)); // Show first 5 rows
        setErrors(parseErrors);
        setSuccess(null);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleImport = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          const { rows } = parseCSV(text);
          
          // Call the import function
          await onImport(rows);
          
          setSuccess(`✅ Successfully imported ${rows.length} records!`);
          setTimeout(() => {
            onCancel();
          }, 2000);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      setErrors([`Failed to import: ${err.message}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-bold">{title} - CSV Import 📊</h2>
          <button 
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {success && (
            <SuccessMessage 
              message={success}
              onDismiss={() => setSuccess(null)}
            />
          )}

          {errors.length > 0 && (
            <FormErrorSummary errors={{ csvErrors: errors.join('; ') }} />
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">📋 How to use:</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Download the CSV template below</li>
              <li>Fill in your data in Excel or Google Sheets</li>
              <li>Save as CSV format</li>
              <li>Upload the file here</li>
            </ol>
          </div>

          {/* Download Template */}
          <div>
            <button
              onClick={downloadTemplate}
              className="w-full px-4 py-3 border-2 border-dashed border-green-400 rounded-lg hover:bg-green-50 transition text-green-700 font-medium"
            >
              ⬇️ Download CSV Template
            </button>
            <p className="text-xs text-gray-500 mt-2">Opens a sample CSV with the correct column format</p>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Upload CSV File</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 cursor-pointer transition"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="text-3xl mb-2">📁</div>
              <p className="font-medium text-gray-700">Click to upload CSV file</p>
              <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
              {file && (
                <p className="text-xs text-green-600 mt-2 font-medium">✅ {file.name}</p>
              )}
            </div>
          </div>

          {/* Preview */}
          {preview.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Preview (first {preview.length} rows)</h3>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      {Object.keys(preview[0]).map(col => (
                        <th key={col} className="px-4 py-2 text-left font-medium text-gray-700">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {Object.values(row).map((val, cidx) => (
                          <td key={cidx} className="px-4 py-2 text-gray-700">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Total rows to import: {preview.length}+
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={!file || errors.length > 0 || isProcessing}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {isProcessing ? 'Uploading...' : 'Import Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVImport;
