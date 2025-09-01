import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle, 
  X, 
  User, 
  Download,
  Eye
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface CustomerRecord {
  id: string;
  fileNo: string;
  clientId: string;
  clientName: string;
  accountNo?: string;
  cardNo?: string;
  loanNo?: string;
  outstanding: number;
  bankCollector: string;
  assignedAgent?: string;
  status: 'unassigned' | 'assigned';
  bank: string;
  productType: string;
  contactNumber?: string;
  address?: string;
  allegationDate?: string;
  expiryDate?: string;
  // Additional fields for detailed mapping
  [key: string]: any;
}

interface ColumnMapping {
  [key: string]: string;
}

interface BankTemplate {
  name: string;
  columns: ColumnMapping;
  sampleData: any;
  requiredColumns: string[];
}

interface ExcelUploadProps {
  onDataImported: (data: CustomerRecord[]) => void;
  existingAgents: Array<{ id: string; name: string; email: string; assignedBanks: string[] }>;
}

export function ExcelUpload({ onDataImported, existingAgents }: ExcelUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<CustomerRecord[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [bankType, setBankType] = useState('');
  const [productType, setProductType] = useState('');
  const [templateType, setTemplateType] = useState('');
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [detectedColumns, setDetectedColumns] = useState<string[]>([]);
  const [mappingMode, setMappingMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Bank-specific template configurations
  const bankTemplates: { [key: string]: BankTemplate } = {
    'DBBL-Credit Card': {
      name: 'DBBL Credit Card',
      requiredColumns: ['SI No', 'Card', 'Client ID', 'Name', 'Outstanding'],
      columns: {
        'SI No': 'siNo',
        'Card': 'cardNo',
        'Client ID': 'clientId',
        'Name': 'clientName',
        'CY': 'cy',
        'Credit Limit': 'creditLimit',
        'Outstanding': 'outstanding',
        'Min Due': 'minDue',
        'Overdue Month': 'overdueMonth',
        'DPD': 'dpd',
        'EMP Name': 'empName',
        'Position': 'position',
        'Mobile': 'mobile',
        'RPhone': 'rPhone',
        'Branch/Division': 'branchDivision',
        'Address': 'address',
        'Division': 'division',
        'Allegation Date': 'allegationDate',
        'Expire Date': 'expiryDate',
        'Agent Name': 'assignedAgent',
        'Agent No': 'agentNo',
        'Remarks': 'remarks',
        'Perm. Add. visit': 'permAddVisit',
        'Pres. Add. visit': 'presAddVisit',
        'Month': 'month'
      },
      sampleData: {
        'SI No': '001',
        'Card': '**** **** **** 1234',
        'Client ID': 'CL001234',
        'Name': 'John Doe',
        'CY': '2024',
        'Credit Limit': 100000,
        'Outstanding': 50000,
        'Min Due': 5000,
        'Overdue Month': 2,
        'DPD': 30,
        'EMP Name': 'Sarah Ahmed',
        'Position': 'Manager',
        'Mobile': '+8801234567890',
        'RPhone': '+8801234567891',
        'Branch/Division': 'Dhaka Main',
        'Address': '123 Main Street, Dhaka',
        'Division': 'Dhaka',
        'Allegation Date': '2024-01-15',
        'Expire Date': '2024-12-15',
        'Agent Name': 'Agent Name (Optional)',
        'Agent No': 'AG001',
        'Remarks': 'Sample remark',
        'Perm. Add. visit': 'Yes',
        'Pres. Add. visit': 'No',
        'Month': 'January'
      }
    },
    'DBBL-Write-Off': {
      name: 'DBBL Write-Off',
      requiredColumns: ['SL No', 'Client ID', 'Client Name', 'Write-Off Amount'],
      columns: {
        'SL No': 'slNo',
        'Client ID': 'clientId',
        'Client Name': 'clientName',
        'Card Number': 'cardNo',
        'Write-Off Amount': 'writeOffAmount',
        'Total Recovery': 'totalRecovery',
        'All Payment': 'allPayment',
        'Pending Outstanding': 'pendingOutstanding',
        'Contact Number': 'contactNumber',
        'Write-Off': 'writeOff',
        'EMP Name': 'empName',
        'Position': 'position',
        'Address': 'address',
        'Allegation Date': 'allegationDate',
        'Expiry Date': 'expiryDate',
        'Agent Name': 'assignedAgent',
        'Agent Contact No': 'agentContactNo',
        'Remarks': 'remarks',
        'Perm. Add. visit': 'permAddVisit',
        'Pres. Add. visit': 'presAddVisit',
        'Month': 'month'
      },
      sampleData: {
        'SL No': '001',
        'Client ID': 'CL001234',
        'Client Name': 'John Doe',
        'Card Number': '**** **** **** 1234',
        'Write-Off Amount': 67000,
        'Total Recovery': 12000,
        'All Payment': 8000,
        'Pending Outstanding': 55000,
        'Contact Number': '+8801234567890',
        'Write-Off': 'Yes',
        'EMP Name': 'Fatima Khan',
        'Position': 'Officer',
        'Address': '789 Business District, Sylhet',
        'Allegation Date': '2024-03-05',
        'Expiry Date': '2024-09-05',
        'Agent Name': 'Agent Name (Optional)',
        'Agent Contact No': '+8801234567892',
        'Remarks': 'Write-off case',
        'Perm. Add. visit': 'Pending',
        'Pres. Add. visit': 'Done',
        'Month': 'March'
      }
    },
    'DBBL-Agent Banking': {
      name: 'DBBL Agent Banking',
      requiredColumns: ['SL No', 'Customer Name', 'Account Number', 'Total Outstanding'],
      columns: {
        'SL No': 'slNo',
        'Customer Name': 'customerName',
        'Contact Number': 'contactNumber',
        'CASA': 'casa',
        'Account Number': 'accountNo',
        'Amount Disbursed': 'amountDisbursed',
        'Total Outstanding': 'totalOutstanding',
        'Overdue Amount': 'overdueAmount',
        'Install Arrear': 'installArrear',
        'Loan Status': 'loanStatus',
        'Outlet Name': 'outletName',
        'Outlet Mobile': 'outletMobile',
        'AB Office': 'abOffice',
        'Region Name': 'regionName',
        'Officer Name': 'officerName',
        'Mobile 1': 'mobile1',
        'Mobile 2': 'mobile2',
        'Agent Name': 'assignedAgent',
        'Agent Number': 'agentNo',
        'Hand Over Date': 'handOverDate',
        'Remarks': 'remarks',
        'Allegation Date': 'allegationDate',
        'Expiry Date': 'expiryDate',
        'Rate of Interest': 'rateOfInterest',
        'Branch Name': 'branchName',
        'Perm. Add. visit': 'permAddVisit',
        'Pres. Add. visit': 'presAddVisit',
        'Month': 'month'
      },
      sampleData: {
        'SL No': '001',
        'Customer Name': 'Kavya Singh',
        'Contact Number': '+8801234567893',
        'CASA': 'CA123456',
        'Account Number': '9876543210',
        'Amount Disbursed': 200000,
        'Total Outstanding': 156000,
        'Overdue Amount': 25000,
        'Install Arrear': 8000,
        'Loan Status': 'Active',
        'Outlet Name': 'Rajshahi Outlet',
        'Outlet Mobile': '+8801234567894',
        'AB Office': 'Rajshahi AB',
        'Region Name': 'North Region',
        'Officer Name': 'Mahmud Rahman',
        'Mobile 1': '+8801234567895',
        'Mobile 2': '+8801234567896',
        'Agent Name': 'Agent Name (Optional)',
        'Agent Number': 'AG002',
        'Hand Over Date': '2024-01-20',
        'Remarks': 'Agent banking case',
        'Allegation Date': '2024-01-20',
        'Expiry Date': '2024-10-20',
        'Rate of Interest': 12.5,
        'Branch Name': 'Rajshahi Branch',
        'Perm. Add. visit': 'Scheduled',
        'Pres. Add. visit': 'Not Done',
        'Month': 'January'
      }
    },
    'DBBL-Loan Branch': {
      name: 'DBBL Loan Branch',
      requiredColumns: ['SL No', 'Account Number', 'Customer Name', 'Total Outstanding'],
      columns: {
        'SL No': 'slNo',
        'Product Name': 'productName',
        'Account Number': 'accountNo',
        'Customer Name': 'clientName',
        'CASA': 'casa',
        'Value Date': 'valueDate',
        'Maturity Date': 'maturityDate',
        'Amount Disbursed': 'amountDisbursed',
        'Total Outstanding': 'totalOutstanding',
        'Overdue Amount': 'overdueAmount',
        'Installment Size': 'installmentSize',
        'Install Arrear': 'installArrear',
        'Total Overdue': 'totalOverdue',
        'Loan Status': 'loanStatus',
        'Customer Contact': 'customerContact',
        'Agent Name': 'assignedAgent',
        'Agent Number': 'agentNo',
        'Received Date': 'receivedDate',
        'Remarks': 'remarks',
        'Date of Allocation': 'dateOfAllocation',
        'Work Order Expiry Date': 'workOrderExpiryDate',
        'Branch Name': 'branchName',
        'Rate': 'rate',
        'Perm. Add. visit': 'permAddVisit',
        'Pres. Add. visit': 'presAddVisit',
        'Month': 'month'
      },
      sampleData: {
        'SL No': '001',
        'Product Name': 'Personal Loan',
        'Account Number': 'LN789012',
        'Customer Name': 'Suresh Reddy',
        'CASA': 'CA789012',
        'Value Date': '2024-01-01',
        'Maturity Date': '2025-01-01',
        'Amount Disbursed': 100000,
        'Total Outstanding': 78000,
        'Overdue Amount': 15000,
        'Installment Size': 8500,
        'Install Arrear': 2,
        'Total Overdue': 17000,
        'Loan Status': 'Active',
        'Customer Contact': '+8801234567894',
        'Agent Name': 'Agent Name (Optional)',
        'Agent Number': 'AG003',
        'Received Date': '2024-04-12',
        'Remarks': 'Loan branch case',
        'Date of Allocation': '2024-04-12',
        'Work Order Expiry Date': '2025-01-12',
        'Branch Name': 'Barisal Branch',
        'Rate': 13.5,
        'Perm. Add. visit': 'Done',
        'Pres. Add. visit': 'Scheduled',
        'Month': 'April'
      }
    },
    'One Bank-Credit Card': {
      name: 'One Bank Credit Card',
      requiredColumns: ['SL', 'Client ID', 'Card No', 'Card Holder Name'],
      columns: {
        'SL': 'sl',
        'Client ID': 'clientId',
        'Card No': 'cardNo',
        'Card Holder Name': 'cardHolderName',
        'Status': 'cardStatus',
        'Overdue (Inc. Commission)': 'overdueIncCommission',
        'Outstanding (Inc. Commission)': 'outstandingIncCommission',
        'Dealing Officer': 'dealingOfficer',
        'Agent Name': 'assignedAgent',
        'Agent Number': 'agentNo',
        'Received Date': 'receivedDate',
        'Remarks': 'remarks',
        'Date of Allocation': 'dateOfAllocation',
        'Work Order Expiry Date': 'workOrderExpiryDate',
        'Perm. Add. visit': 'permAddVisit',
        'Pres. Add. visit': 'presAddVisit',
        'Month': 'month'
      },
      sampleData: {
        'SL': '001',
        'Client ID': 'CL001239',
        'Card No': '**** **** **** 9012',
        'Card Holder Name': 'Neha Agarwal',
        'Status': 'Active',
        'Overdue (Inc. Commission)': 45000,
        'Outstanding (Inc. Commission)': 234000,
        'Dealing Officer': 'Rashida Begum',
        'Agent Name': 'Agent Name (Optional)',
        'Agent Number': 'AG004',
        'Received Date': '2023-12-01',
        'Remarks': 'One Bank credit card case',
        'Date of Allocation': '2023-12-01',
        'Work Order Expiry Date': '2024-06-01',
        'Perm. Add. visit': 'Pending',
        'Pres. Add. visit': 'Not Done',
        'Month': 'December'
      }
    },
    'One Bank-Personal Loan': {
      name: 'One Bank Personal Loan',
      requiredColumns: ['SL', 'File No', 'Customer Name', 'Loan Account'],
      columns: {
        'SL': 'sl',
        'File No': 'fileNo',
        'Customer Name': 'clientName',
        'Loan Account': 'loanNo',
        'Product': 'product',
        'Outstanding': 'outstanding',
        'Overdue': 'overdue',
        'Status': 'loanStatus',
        'Collector': 'collector',
        'EMI': 'emi',
        'Previous Agent': 'previousAgent',
        'Current Agent': 'currentAgent',
        'Agent Number': 'agentNo',
        'Received Date': 'receivedDate',
        'Remarks': 'remarks',
        'Date of Allocation': 'dateOfAllocation',
        'Work Order Expiry Date': 'workOrderExpiryDate',
        'CL Saving Amount': 'clSavingAmount',
        'Perm. Add. visit': 'permAddVisit',
        'Pres. Add. visit': 'presAddVisit',
        'Month': 'month'
      },
      sampleData: {
        'SL': '001',
        'File No': 'OL567896',
        'Customer Name': 'Vikram Joshi',
        'Loan Account': 'LN345678',
        'Product': 'Personal Loan',
        'Outstanding': 145000,
        'Overdue': 22000,
        'Status': 'Active',
        'Collector': 'Taslima Khatun',
        'EMI': 12500,
        'Previous Agent': 'Previous Agent Name',
        'Current Agent': 'Agent Name (Optional)',
        'Agent Number': 'AG005',
        'Received Date': '2024-02-28',
        'Remarks': 'One Bank loan case',
        'Date of Allocation': '2024-02-28',
        'Work Order Expiry Date': '2024-11-28',
        'CL Saving Amount': 5000,
        'Perm. Add. visit': 'Done',
        'Pres. Add. visit': 'Partial',
        'Month': 'February'
      }
    }
  };

  const getCurrentTemplate = (): BankTemplate | null => {
    if (!bankType || !productType) return null;
    const key = `${bankType}-${productType}`;
    return bankTemplates[key] || null;
  };

  const getTemplateOptions = () => {
    return Object.keys(bankTemplates).map(key => {
      const template = bankTemplates[key];
      return { value: key, label: template.name };
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setErrors([]);
      setPreviewData([]);
      setShowPreview(false);
      setMappingMode(false);
      setDetectedColumns([]);
      setColumnMapping({});
    }
  };

  const handleTemplateChange = (value: string) => {
    setTemplateType(value);
    const [bank, product] = value.split('-');
    setBankType(bank);
    setProductType(product);
    setErrors([]);
    setMappingMode(false);
  };

  const validateExcelStructure = (data: any[], template: BankTemplate): { isValid: boolean; errors: string[]; detectedColumns: string[] } => {
    const validationErrors: string[] = [];
    
    if (data.length === 0) {
      return { isValid: false, errors: ['Excel file is empty'], detectedColumns: [] };
    }

    const firstRow = data[0];
    const detectedColumns = Object.keys(firstRow);
    
    // Check if any required columns are missing
    const missingColumns = template.requiredColumns.filter(col => 
      !detectedColumns.some(detected => 
        detected.toLowerCase().trim() === col.toLowerCase().trim()
      )
    );

    if (missingColumns.length > 0) {
      validationErrors.push(`Missing required columns: ${missingColumns.join(', ')}`);
      return { isValid: false, errors: validationErrors, detectedColumns };
    }

    return { isValid: true, errors: [], detectedColumns };
  };

  const createColumnMapping = (detectedColumns: string[], template: BankTemplate): ColumnMapping => {
    const mapping: ColumnMapping = {};
    
    detectedColumns.forEach(detected => {
      // Try exact match first
      if (template.columns[detected]) {
        mapping[detected] = template.columns[detected];
        return;
      }
      
      // Try case-insensitive match
      const templateKey = Object.keys(template.columns).find(key => 
        key.toLowerCase().trim() === detected.toLowerCase().trim()
      );
      
      if (templateKey) {
        mapping[detected] = template.columns[templateKey];
      }
    });
    
    return mapping;
  };

  const processExcelDataWithMapping = (data: any[], mapping: ColumnMapping, template: BankTemplate): CustomerRecord[] => {
    return data.map((row, index) => {
      const record: any = {
        id: `import_${Date.now()}_${index}`,
        bank: bankType,
        productType: productType,
        status: 'unassigned'
      };

      // Map columns using the mapping
      Object.entries(row).forEach(([excelColumn, value]) => {
        const mappedField = mapping[excelColumn];
        if (mappedField) {
          // Handle special cases for numeric fields
          if (['outstanding', 'creditLimit', 'minDue', 'overdueMonth', 'dpd', 'writeOffAmount', 'totalRecovery', 'allPayment', 'pendingOutstanding', 'amountDisbursed', 'totalOutstanding', 'overdueAmount', 'installArrear', 'installmentSize', 'totalOverdue', 'overdueIncCommission', 'outstandingIncCommission', 'overdue', 'emi', 'clSavingAmount', 'rateOfInterest', 'rate'].includes(mappedField)) {
            record[mappedField] = parseFloat(String(value)) || 0;
          }
          // Handle assignment status
          else if (mappedField === 'assignedAgent' && value) {
            record.assignedAgent = value;
            record.status = 'assigned';
          }
          // Handle legacy field mapping
          else if (mappedField === 'customerName') {
            record.clientName = value; // Map customerName to clientName for consistency
            record.customerName = value;
          }
          else if (mappedField === 'cardHolderName') {
            record.clientName = value; // Map cardHolderName to clientName for consistency
            record.cardHolderName = value;
          }
          else if (mappedField === 'currentAgent') {
            record.assignedAgent = value;
            record.currentAgent = value;
            if (value) record.status = 'assigned';
          }
          else if (mappedField === 'totalOutstanding') {
            record.outstanding = parseFloat(String(value)) || 0; // Map to legacy outstanding field
            record.totalOutstanding = parseFloat(String(value)) || 0;
          }
          else if (mappedField === 'outstandingIncCommission') {
            record.outstanding = parseFloat(String(value)) || 0; // Map to legacy outstanding field
            record.outstandingIncCommission = parseFloat(String(value)) || 0;
          }
          else {
            record[mappedField] = value;
          }
        }
      });

      // Ensure required fields have default values
      if (!record.fileNo && (record.sl || record.siNo || record.slNo)) {
        record.fileNo = `FL${record.sl || record.siNo || record.slNo}`;
      }
      if (!record.outstanding) record.outstanding = 0;
      if (!record.allegationDate) record.allegationDate = new Date().toISOString().split('T')[0];
      if (!record.expiryDate) record.expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      return record as CustomerRecord;
    });
  };

  const handleFileUpload = async () => {
    if (!file || !templateType) {
      setErrors(['Please select a file and template type']);
      return;
    }

    const template = getCurrentTemplate();
    if (!template) {
      setErrors(['Invalid template selected']);
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);
    setErrors([]);

    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          setUploadProgress(30);
          
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          setUploadProgress(60);

          const validation = validateExcelStructure(jsonData, template);
          if (!validation.isValid) {
            setErrors(validation.errors);
            setIsProcessing(false);
            return;
          }

          setUploadProgress(70);
          setDetectedColumns(validation.detectedColumns);

          // Create column mapping
          const mapping = createColumnMapping(validation.detectedColumns, template);
          setColumnMapping(mapping);

          setUploadProgress(80);

          // Process data with mapping
          const processedData = processExcelDataWithMapping(jsonData, mapping, template);
          setPreviewData(processedData);
          setShowPreview(true);
          setUploadProgress(100);

          setTimeout(() => {
            setIsProcessing(false);
          }, 500);

        } catch (error) {
          setErrors(['Error processing Excel file. Please check the file format and template compatibility.']);
          setIsProcessing(false);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      setErrors(['Error reading file. Please try again.']);
      setIsProcessing(false);
    }
  };

  const handleImportData = () => {
    onDataImported(previewData);
    setFile(null);
    setPreviewData([]);
    setShowPreview(false);
    setUploadProgress(0);
    setTemplateType('');
    setBankType('');
    setProductType('');
    setColumnMapping({});
    setDetectedColumns([]);
    setMappingMode(false);
  };

  const downloadTemplate = () => {
    if (!templateType) {
      setErrors(['Please select a template type first']);
      return;
    }

    const template = getCurrentTemplate();
    if (!template) {
      setErrors(['Invalid template selected']);
      return;
    }

    const ws = XLSX.utils.json_to_sheet([template.sampleData]);
    const wb = XLSX.utils.book_new();
    
    // Auto-size columns
    const colWidths: any[] = [];
    Object.keys(template.sampleData).forEach((key, index) => {
      const cellValue = template.sampleData[key]?.toString() || '';
      const width = Math.max(key.length, cellValue.length) + 2;
      colWidths.push({ wch: Math.min(width, 50) });
    });
    ws['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    
    const fileName = `${template.name.replace(/\s+/g, '_')}_Template.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const downloadAllTemplates = () => {
    const wb = XLSX.utils.book_new();
    
    Object.entries(bankTemplates).forEach(([key, template]) => {
      const ws = XLSX.utils.json_to_sheet([template.sampleData]);
      
      // Auto-size columns
      const colWidths: any[] = [];
      Object.keys(template.sampleData).forEach((colKey) => {
        const cellValue = template.sampleData[colKey]?.toString() || '';
        const width = Math.max(colKey.length, cellValue.length) + 2;
        colWidths.push({ wch: Math.min(width, 30) });
      });
      ws['!cols'] = colWidths;
      
      const sheetName = template.name.substring(0, 31); // Excel sheet name limit
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });
    
    XLSX.writeFile(wb, 'All_Bank_Templates.xlsx');
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Bank Files from Excel
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Select the appropriate template for your bank and product type, then upload your Excel file.
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={downloadTemplate}
            disabled={!templateType}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Selected Template
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={downloadAllTemplates}
          >
            <Download className="h-4 w-4 mr-2" />
            Download All Templates
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Selection and File Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="template-select">Bank & Product Template</Label>
            <Select value={templateType} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Template Type" />
              </SelectTrigger>
              <SelectContent>
                {getTemplateOptions().map(template => (
                  <SelectItem key={template.value} value={template.value}>
                    {template.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {templateType && (
              <p className="text-xs text-gray-600 mt-1">
                Selected: {getCurrentTemplate()?.name}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="file-upload">Excel File</Label>
            <Input
              id="file-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              disabled={isProcessing}
            />
            {file && (
              <p className="text-xs text-gray-600 mt-1">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
        </div>

        {/* Template Information */}
        {templateType && getCurrentTemplate() && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Template Information</h4>
            <div className="text-sm text-blue-800">
              <p><strong>Required columns:</strong> {getCurrentTemplate()!.requiredColumns.join(', ')}</p>
              <p className="mt-1"><strong>Total columns:</strong> {Object.keys(getCurrentTemplate()!.columns).length}</p>
              <p className="mt-1 text-blue-600">Make sure your Excel file contains these exact column headers.</p>
            </div>
          </div>
        )}

        {/* Upload Button */}
        {file && templateType && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
              <div className="flex-1">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB • {getCurrentTemplate()?.name}
                </p>
              </div>
              <Button 
                onClick={handleFileUpload} 
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? 'Processing...' : 'Process File'}
              </Button>
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing Excel file...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        )}

        {/* Errors */}
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Preview Data */}
        {showPreview && previewData.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Preview Import Data</h3>
                <Badge variant="secondary">{previewData.length} records</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Cancel
                </Button>
                <Button onClick={handleImportData} className="bg-blue-600 hover:bg-blue-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Import {previewData.length} Records
                </Button>
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {previewData.filter(r => r.status === 'assigned').length}
                </div>
                <div className="text-sm text-gray-600">Pre-assigned</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {previewData.filter(r => r.status === 'unassigned').length}
                </div>
                <div className="text-sm text-gray-600">Unassigned</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  ৳{previewData.reduce((sum, r) => sum + r.outstanding, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Outstanding</div>
              </div>
            </div>

            {/* Preview Table */}
            <div className="max-h-96 overflow-y-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File No</TableHead>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Outstanding</TableHead>
                    <TableHead>Bank Collector</TableHead>
                    <TableHead>Assigned Agent</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.slice(0, 10).map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-sm">{record.fileNo}</TableCell>
                      <TableCell>{record.clientName}</TableCell>
                      <TableCell className="font-medium text-red-600">
                        ৳{record.outstanding.toLocaleString()}
                      </TableCell>
                      <TableCell>{record.bankCollector}</TableCell>
                      <TableCell>
                        {record.assignedAgent ? (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {record.assignedAgent}
                          </div>
                        ) : (
                          <span className="text-gray-500">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={record.status === 'assigned' ? 'default' : 'secondary'}>
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {previewData.length > 10 && (
              <p className="text-sm text-gray-500 text-center">
                Showing first 10 records. {previewData.length - 10} more records will be imported.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}