import { FC, useEffect, useState } from 'react';
import { submitReview, getVendorReviews } from '../../services/reviewsService';
import './StarRating.css';

interface StarRatingProps {
  vendorId: string;
  interactive: boolean;
  token?: string;
}

interface ReviewsSummary {
  average: number;
  total: number;
}

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

const buildStarFill = (value: number, index: number): number => {
  const fill = clamp((value - index) * 100, 0, 100);
  return fill;
};

const StarRating: FC<StarRatingProps> = ({ vendorId, interactive = false, token }: StarRatingProps) => {
  const [reviews, setReviews] = useState<ReviewsSummary>({ average: 0, total: 0 });
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!vendorId) {
      return;
    }

    const loadReviews = async () => {
      try {
        const data = await getVendorReviews(vendorId);
        setReviews({
          average: typeof data.average === 'number' ? data.average : 0,
          total: typeof data.total === 'number' ? data.total : 0,
        });
      } catch (err: any) {
        setError(err.message || 'No fue posible cargar las reseñas.');
      }
    };

    loadReviews();
  }, [vendorId, submitted]);

  if (!vendorId) {
    return null;
  }

  const showInteractive = interactive && !submitted;
  const activeValue = hoverRating || selectedRating;

  const handleStarClick = (value: number) => {
    setSelectedRating(value);
    setError('');
    setFeedback('');
  };

  const handleSubmit = async () => {
    if (!selectedRating) {
      setError('Debes elegir una calificación entre 1 y 5 estrellas.');
      return;
    }

    try {
      setError('');
      setSubmitting(true);
      await submitReview(vendorId, selectedRating, reviewText, token);
      setFeedback('¡Gracias! Tu reseña se envió correctamente.');
      setSubmitted(true);
      setReviewText('');
    } catch (err: any) {
      setError(err.message || 'Error al enviar la reseña.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="star-rating-container">
      <div className="star-rating-summary">
        <div className="star-row" aria-label="Valoración del vendedor">
          {Array.from({ length: 5 }, (_, index) => {
            const fillWidth = showInteractive
              ? index < activeValue
                ? 100
                : 0
              : buildStarFill(reviews.average, index);

            return (
              <button
                key={`star-${index}`}
                type="button"
                className="star-button"
                onClick={() => showInteractive && handleStarClick(index + 1)}
                onMouseEnter={() => showInteractive && setHoverRating(index + 1)}
                onMouseLeave={() => showInteractive && setHoverRating(0)}
                aria-label={`${index + 1} estrella${index === 0 ? '' : 's'}`}
              >
                <span className="star-wrapper">
                  <span className="star-base">★</span>
                  <span className="star-fill" style={{ width: `${fillWidth}%` }}>
                    <span>★</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {showInteractive ? (
          <p className="star-message">Selecciona tu calificación y deja un comentario opcional.</p>
        ) : (
          <p className="star-message">
            {reviews.average.toFixed(1)} ★ ({reviews.total} reseña{reviews.total === 1 ? '' : 's'})
          </p>
        )}
      </div>

      {showInteractive && (
        <div className="mt-4">
          <textarea
            className="star-input"
            placeholder="Escribe un comentario opcional..."
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
            rows={4}
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              className="star-submit"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Enviando...' : 'Enviar reseña'}
            </button>
            {feedback && <span className="star-feedback">{feedback}</span>}
            {error && <span className="star-error">{error}</span>}
          </div>
        </div>
      )}

      {!showInteractive && feedback && <p className="star-feedback mt-3">{feedback}</p>}
      {!showInteractive && error && <p className="star-error mt-3">{error}</p>}
    </div>
  );
};

export default StarRating;
