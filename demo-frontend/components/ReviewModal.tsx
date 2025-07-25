'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  booking: {
    id: string | number
    turf: string
    date: string
    time: string
    location: string
  }
  onReviewSubmitted?: () => void
}

export default function ReviewModal({ 
  isOpen, 
  onClose, 
  booking, 
  onReviewSubmitted 
}: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setRating(0)
    setHoveredRating(0)
    setComment('')
    setIsAnonymous(false)
    setIsSubmitting(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      alert('Please select a rating')
      return
    }
    
    if (comment.trim().length < 10) {
      alert('Please write at least 10 characters in your review')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.id,
          rating,
          comment: comment.trim(),
          isAnonymous
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review')
      }

      alert('Review submitted successfully! Thank you for your feedback.')
      resetForm()
      onClose()
      onReviewSubmitted?.()

    } catch (error: unknown) {
      console.error('Error submitting review:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit review. Please try again.'
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const StarRating = ({ interactive = true }: { interactive?: boolean }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive || isSubmitting}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            className={`p-1 transition-colors ${interactive ? 'hover:scale-110' : ''} ${
              interactive && !isSubmitting ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= (hoveredRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Poor'
      case 2: return 'Fair'
      case 3: return 'Good'
      case 4: return 'Very Good'
      case 5: return 'Excellent'
      default: return 'Select Rating'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Write Review
                </h2>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Booking Info */}
              <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {booking.turf}
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>{booking.date} • {booking.time}</p>
                  <p>{booking.location}</p>
                </div>
              </div>

              {/* Review Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    How was your experience?
                  </label>
                  <div className="flex flex-col items-center space-y-2">
                    <StarRating />
                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                      {getRatingText(hoveredRating || rating)}
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label 
                    htmlFor="comment" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Tell us about your experience
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Share details about the turf quality, facilities, staff, or anything that would help other players..."
                    rows={4}
                    maxLength={1000}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    required
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                      Minimum 10 characters
                    </span>
                    <span className="text-xs text-gray-500">
                      {comment.length}/1000
                    </span>
                  </div>
                </div>

                {/* Anonymous Option */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    disabled={isSubmitting}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label 
                    htmlFor="anonymous" 
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    Post as anonymous
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Review
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
