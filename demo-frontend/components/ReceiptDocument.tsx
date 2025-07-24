// components/pdf/ReceiptDocument.tsx
'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  heading: { fontSize: 18, marginBottom: 10 },
  line: { fontSize: 12 },
});

interface ReceiptProps {
  bookingId: string;
  turfName: string;
  userName: string;
  date: string;
  slot: string;
  price: number;
}

const ReceiptDocument = ({
  bookingId,
  turfName,
  userName,
  date,
  slot,
  price,
}: ReceiptProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>🏟️ Turf Booking Receipt</Text>
        <Text style={styles.line}>Booking ID: {bookingId}</Text>
        <Text style={styles.line}>User: {userName}</Text>
        <Text style={styles.line}>Turf: {turfName}</Text>
        <Text style={styles.line}>Date: {date}</Text>
        <Text style={styles.line}>Slot: {slot}</Text>
        <Text style={styles.line}>Price Paid: ₹{price}</Text>
      </View>
      <Text>✅ Thank you for booking with us!</Text>
    </Page>
  </Document>
);

export default ReceiptDocument;
