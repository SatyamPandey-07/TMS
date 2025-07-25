import { useState, useCallback } from 'react';

interface ReviewData {
  rating: number;
  comment: string;
  isAnonymous: boolean;
}

interface ReviewStatus {
  canReview: boolean;
  hasReview: boolean;
  bookingStatus: string;
  review: any;
}

export const useReview = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkReviewStatus = useCallback(async (bookingId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/reviews/check?bookingId=${bookingId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check review status');
      }
      
      setReviewStatus(data);
      return data;
    } catch (error) {
      console.error('Error checking review status:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitReview = useCallback(async (
    bookingId: string, 
    turfId: string, 
    reviewData: ReviewData
  ) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          turfId,
          ...reviewData
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      // Refresh review status after successful submission
      await checkReviewStatus(bookingId);
      
      return data;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [checkReviewStatus]);

  const updateReview = useCallback(async (
    reviewId: string,
    reviewData: Partial<ReviewData>
  ) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update review');
      }

      return data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const deleteReview = useCallback(async (reviewId: string, bookingId: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete review');
      }

      // Refresh review status after successful deletion
      await checkReviewStatus(bookingId);
      
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [checkReviewStatus]);

  return {
    isSubmitting,
    isLoading,
    reviewStatus,
    checkReviewStatus,
    submitReview,
    updateReview,
    deleteReview
  };
};
