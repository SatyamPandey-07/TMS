'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Mail, Loader2 } from 'lucide-react'

interface ReceiptActionsProps {
  bookingId: string
  className?: string
  showDownload?: boolean
  showResend?: boolean
  customEmail?: string
}

export default function ReceiptActions({ 
  bookingId, 
  className = '',
  showDownload = true,
  showResend = true,
  customEmail 
}: ReceiptActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const downloadReceipt = async () => {
    try {
      setIsDownloading(true)
      
      const response = await fetch(`/api/receipt?bookingId=${bookingId}`)
      
      if (!response.ok) {
        throw new Error('Failed to download receipt')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `TurfMaster_Receipt_${bookingId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      // Show success notification
      alert('Receipt downloaded successfully!')
      
    } catch (error) {
      console.error('Error downloading receipt:', error)
      alert('Failed to download receipt. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const resendReceipt = async () => {
    try {
      setIsResending(true)
      
      const response = await fetch('/api/receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          emailTo: customEmail
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend receipt')
      }

      alert('Receipt sent successfully!')
      
    } catch (error) {
      console.error('Error resending receipt:', error)
      alert('Failed to send receipt. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      {showDownload && (
        <Button
          variant="outline"
          size="sm"
          onClick={downloadReceipt}
          disabled={isDownloading}
          className="flex items-center gap-2"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isDownloading ? 'Downloading...' : 'Download PDF'}
        </Button>
      )}

      {showResend && (
        <Button
          variant="outline"
          size="sm"
          onClick={resendReceipt}
          disabled={isResending}
          className="flex items-center gap-2"
        >
          {isResending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Mail className="w-4 h-4" />
          )}
          {isResending ? 'Sending...' : 'Resend Email'}
        </Button>
      )}
    </div>
  )
}
