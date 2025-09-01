# Excel Upload Template Documentation

## Required Columns for Bank Files Upload

The Excel file must contain the following columns (case-sensitive):

### Required Columns:
- **File No**: Unique file number (e.g., FL001234)
- **Client ID**: Customer ID (e.g., CL001234) 
- **Client Name**: Full customer name
- **Outstanding**: Outstanding amount (numeric value)
- **Bank Collector**: Name of the bank collector handling the case

### Optional Columns:
- **Account No**: Bank account number
- **Card No**: Credit card number (can be masked)
- **Loan No**: Loan number
- **Assigned Agent**: Pre-assigned agent name (if any)
- **Contact Number**: Customer phone number
- **Address**: Customer address
- **Allegation Date**: Date in YYYY-MM-DD format
- **Expiry Date**: Expiry date in YYYY-MM-DD format

## Sample Data Format:

| File No | Client ID | Client Name | Account No | Outstanding | Bank Collector | Assigned Agent | Contact Number | Address |
|---------|-----------|-------------|------------|-------------|----------------|---------------|----------------|---------|
| FL001234 | CL001234 | John Doe | 1234567890 | 50000 | Jane Smith | Agent Name | +8801234567890 | 123 Main St |

## Upload Process:

1. **Admin Access Required**: Only administrators can upload files
2. **Select Bank**: Choose the bank (DBBL or One Bank)
3. **Select Product Type**: Choose product type (Credit Card, Personal Loan, etc.)
4. **Upload Excel File**: Select and upload your .xlsx or .xls file
5. **Preview Data**: Review the imported data before confirming
6. **Import**: Confirm import to add files to the system

## Assignment Features:

- **Auto-Assignment**: Files with "Assigned Agent" column will be automatically assigned
- **Manual Assignment**: Unassigned files can be manually assigned to agents
- **Bulk Operations**: Select multiple files for bulk assignment/unassignment
- **Bank Filtering**: Agents only see files for their assigned banks

## Notes:

- Duplicate file numbers will be handled by the system
- Invalid data rows will be flagged during upload
- All monetary amounts should be in numeric format without currency symbols
- Dates should be in YYYY-MM-DD format