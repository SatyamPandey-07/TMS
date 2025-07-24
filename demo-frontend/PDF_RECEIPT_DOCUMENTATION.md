# PDF Receipt Generation System

## Overview
The TurfMaster application now includes a comprehensive PDF receipt generation system that automatically creates and emails professional receipts when bookings are made.

## Features

### 📄 PDF Receipt Generation
- **Professional Design**: Clean, branded receipts with TurfMaster branding
- **Comprehensive Details**: Includes all booking information, payment details, and turf details
- **Automatic Generation**: Created automatically upon successful booking
- **Email Attachment**: Sent as PDF attachment via email

### 📧 Email Integration
- **Rich HTML Emails**: Beautiful HTML email templates with booking summary
- **PDF Attachment**: Detailed receipt attached as PDF
- **Automatic Sending**: Triggered immediately after successful payment
- **Resend Capability**: Users can resend receipts anytime

### 🔄 Receipt Management
- **Download Receipts**: Users can download PDF receipts anytime
- **Resend Emails**: Resend receipt emails to any email address
- **Booking Verification**: Receipts serve as proof of booking

## Implementation Details

### Core Components

#### 1. Receipt Generation (`lib/generateReceipt.ts`)
```typescript
// Generates PDF receipt using PDFKit
export const generateReceiptPDF = async (receiptData: ReceiptData): Promise<Buffer>

// Generates HTML version for email display
export const generateReceiptHTML = (receiptData: ReceiptData): string
```

#### 2. Email System (`lib/sendEmail.ts`)
```typescript
// Sends booking receipt with PDF attachment
export const sendBookingReceiptEmail = async (receiptData: BookingReceiptData)

// Enhanced general email function with attachment support
export const sendEmail = async ({ to, subject, html, attachments })
```

#### 3. Receipt API (`app/api/receipt/route.ts`)
```typescript
// GET: Download receipt PDF
// POST: Resend receipt email
```

#### 4. Receipt Actions Component (`components/ReceiptActions.tsx`)
```typescript
// React component for download/resend actions
<ReceiptActions bookingId="..." showDownload={true} showResend={true} />
```

### Data Structure

#### ReceiptData Interface
```typescript
interface ReceiptData {
  bookingId: string
  userName: string
  userEmail: string
  turfName: string
  location: string
  date: string
  timeSlot: string
  advancePaid: number
  remainingPayment: number
  totalAmount: number
  bookingDate: string
  sport?: string
}
```

## Usage Examples

### 1. Automatic Receipt Generation (Payment Flow)
```typescript
// In payment route after successful booking
await sendBookingReceiptEmail({
  bookingId: booking._id.toString(),
  userName: user.name,
  userEmail: email,
  turfName: turf.name,
  location: turf.location,
  date: slot.date,
  timeSlot: `${slot.startHour} - ${slot.endHour}`,
  advancePaid: amount,
  remainingPayment: turf.pricePerHour ? (Number(turf.pricePerHour) - amount) : 0,
  totalAmount: turf.pricePerHour ? Number(turf.pricePerHour) : amount,
  bookingDate: new Date().toLocaleDateString(),
  sport: turf.sport || 'Not specified',
})
```

### 2. Download Receipt
```typescript
// Frontend usage
const downloadReceipt = async (bookingId: string) => {
  const response = await fetch(`/api/receipt?bookingId=${bookingId}`)
  const blob = await response.blob()
  // Handle file download
}
```

### 3. Resend Receipt
```typescript
// Frontend usage
const resendReceipt = async (bookingId: string, emailTo?: string) => {
  await fetch('/api/receipt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId, emailTo })
  })
}
```

### 4. Using Receipt Actions Component
```jsx
// In booking list or booking details page
<ReceiptActions 
  bookingId={booking._id}
  showDownload={true}
  showResend={true}
  customEmail="custom@email.com"
/>
```

## Email Template Features

### HTML Email Content
- **Responsive Design**: Works on all devices
- **Branded Header**: TurfMaster branding with gradient
- **Quick Summary Table**: Key booking details at a glance
- **Important Reminders**: Arrival instructions and contact info
- **Call-to-Action**: Links to view bookings

### PDF Receipt Content
- **Professional Layout**: Clean, business-style receipt
- **Complete Information**: All booking and payment details
- **Status Indicators**: Visual status for payment completion
- **Important Notes**: Arrival instructions and policies
- **Branding**: Consistent TurfMaster branding

## Security Features

### Authentication & Authorization
- **User Verification**: Only booking owner or admin can access receipts
- **Session Validation**: Requires valid authentication
- **Booking Ownership**: Validates user owns the booking

### Data Protection
- **Secure Generation**: Server-side PDF generation
- **Protected Endpoints**: Authentication required for all receipt operations
- **Input Validation**: Validates all receipt data

## Configuration

### Environment Variables Required
```env
EMAIL_SENDER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Dependencies Added
```json
{
  "pdfkit": "^0.15.0",
  "@types/pdfkit": "^0.13.4"
}
```

## API Endpoints

### GET /api/receipt
- **Purpose**: Download receipt PDF
- **Query Params**: `bookingId`
- **Returns**: PDF file
- **Auth**: Required

### POST /api/receipt
- **Purpose**: Resend receipt email
- **Body**: `{ bookingId, emailTo? }`
- **Returns**: Success message
- **Auth**: Required

## Integration Points

### 1. Payment Flow
- Automatically triggered after successful payment
- Creates booking and immediately sends receipt

### 2. Booking Management
- Add ReceiptActions component to booking lists
- Enable download/resend from dashboard

### 3. Customer Support
- Admins can resend receipts to customers
- Download receipts for verification

## Future Enhancements

### Potential Improvements
1. **Multiple Languages**: Localized receipts
2. **Custom Templates**: Different receipt styles
3. **Bulk Operations**: Download multiple receipts
4. **Receipt History**: Track all receipt generations
5. **SMS Integration**: Send receipt links via SMS
6. **QR Codes**: Add QR codes for quick verification

### Performance Optimizations
1. **PDF Caching**: Cache generated PDFs
2. **Async Processing**: Queue PDF generation
3. **Template Optimization**: Faster PDF rendering
4. **Email Queuing**: Background email processing

## Troubleshooting

### Common Issues
1. **PDF Generation Fails**: Check PDFKit installation
2. **Email Not Sending**: Verify SMTP credentials
3. **Large File Size**: Optimize PDF generation
4. **Slow Generation**: Consider async processing

### Debug Tips
1. Check console logs for detailed errors
2. Verify all required fields in receiptData
3. Test email configuration separately
4. Validate PDF buffer generation

This system provides a complete, professional receipt solution that enhances the user experience and provides proper documentation for all turf bookings.
