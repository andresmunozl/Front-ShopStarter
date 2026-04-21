import { FC, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { submitReview, getVendorReviews, updateReview } from '../../services/reviewsService';
import './StarRating.css';

interface StarRatingProps {
  vendorId: string;
  interactive: boolean;
  token?: string;
  username?: string;
}

interface UserReview {
  id: string;
  client: string;
  rating: number;
  review_text?: string;
  created_at: string;
}

interface ReviewsSummary {
  average: number;
  total: number;
}

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

const buildStarFill = (value: number, index: number): number => {
  return clamp((value - index) * 100, 0, 100);
};

const StarRating: FC<StarRatingProps> = ({ vendorId, interactive = false, token, username }) => {
  const [reviews, setReviews] = useState<ReviewsSummary>({ average: 0, total: 0 });
  const [userReview, setUserReview] = useState<UserReview | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [allReviews, setAllReviews] = useState<UserReview[]>([]);

  const loadReviews = async () => {
    try {
      const data = await getVendorReviews(vendorId);
      setReviews({
        average: typeof data.average === 'number' ? data.average : 0,
        total: typeof data.total === 'number' ? data.total : 0,
      });
      if (data.reviews) {
        setAllReviews(data.reviews as UserReview[]);
      }
      if (username && data.reviews) {
        const found = data.reviews.find((r) => r.client === username);
        if (found) {
          setUserReview(found as UserReview);
          setSubmitted(true);
        }
      }
    } catch (err: any) {
      setError(err.message || 'No fue posible cargar las reseñas.');
    }
  };

  useEffect(() => {
    if (!vendorId) return;
    loadReviews();
  }, [vendorId]);

  if (!vendorId) return null;

  const showInteractive = interactive && !submitted && !editMode;
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
      await loadReviews();
    } catch (err: any) {
      setError(err.message || 'Error al enviar la reseña.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditOpen = () => {
    if (userReview) {
      setSelectedRating(userReview.rating);
      setReviewText(userReview.review_text || '');
      setEditMode(true);
      setFeedback('');
      setError('');
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedRating) {
      setError('Debes elegir una calificación entre 1 y 5 estrellas.');
      return;
    }
    if (!userReview) return;
    try {
      setError('');
      setSubmitting(true);
      await updateReview(userReview.id, selectedRating, reviewText, token);
      setFeedback('¡Reseña actualizada correctamente!');
      setEditMode(false);
      await loadReviews();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la reseña.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="star-rating-container">
      {/* Resumen promedio */}
      <div className="star-rating-summary">
        <div className="star-row" aria-label="Valoración del vendedor">
          {Array.from({ length: 5 }, (_, index) => {
            const fillWidth = showInteractive || editMode
              ? index < activeValue ? 100 : 0
              : buildStarFill(reviews.average, index);
            return (
              <button
                key={`star-${index}`}
                type="button"
                className="star-button"
                onClick={() => (showInteractive || editMode) && handleStarClick(index + 1)}
                onMouseEnter={() => (showInteractive || editMode) && setHoverRating(index + 1)}
                onMouseLeave={() => (showInteractive || editMode) && setHoverRating(0)}
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

      {/* Formulario nuevo */}
      {showInteractive && (
        <div className="mt-4">
          <textarea
            className="star-input"
            placeholder="Escribe un comentario opcional..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className="star-submit" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Enviando...' : 'Enviar reseña'}
            </button>
            {feedback && <span className="star-feedback">{feedback}</span>}
            {error && <span className="star-error">{error}</span>}
          </div>
        </div>
      )}
{/* Lista de reseñas de otros usuarios - estilo Play Store */}
{reviews.total > 0 && (
  <div className="reviews-list mt-4">
    <h4 className="reviews-list-title">Reseñas</h4>
    {allReviews
      .filter((r) => r.client !== username)
      .map((r) => (
        <div key={r.id} className="review-card">
          <div className="review-avatar">
            {r.client.charAt(0).toUpperCase()}
          </div>
          <div className="review-content">
            <div className="review-header">
              <span className="review-username">{r.client}</span>
              <span className="review-date">
                {new Date(r.created_at).toLocaleDateString('es-CO', {
                  year: 'numeric', month: 'short', day: 'numeric'
                })}
              </span>
            </div>
            <div className="review-stars">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={i < r.rating ? 'star-filled' : 'star-empty'}>★</span>
              ))}
            </div>
            {r.review_text && <p className="review-text">{r.review_text}</p>}
          </div>
        </div>
      ))}
  </div>
)}
      {/* Reseña del usuario con botón editar */}
      {userReview && !editMode && (
        <div className="user-review-box mt-4">
          <div className="user-review-stars">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={i < userReview.rating ? 'star-filled' : 'star-empty'}>★</span>
            ))}
          </div>
          <div className="user-review-body">
            <p className="user-review-text">{userReview.review_text || 'Sin comentario.'}</p>
            {interactive && (
              <button
                type="button"
                className="edit-review-btn"
                onClick={handleEditOpen}
                aria-label="Editar reseña"
              >
                <Icon icon="solar:pen-bold" height={16} />
              </button>
            )}
          </div>
          {feedback && <p className="star-feedback mt-2">{feedback}</p>}
        </div>
      )}

      {/* Formulario de edición */}
      {editMode && (
        <div className="mt-4">
          <textarea
            className="star-input"
            placeholder="Edita tu comentario..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className="star-submit" onClick={handleEditSubmit} disabled={submitting}>
              {submitting ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button type="button" className="star-cancel" onClick={() => { setEditMode(false); setError(''); }}>
              Cancelar
            </button>
            {error && <span className="star-error">{error}</span>}
          </div>
        </div>
      )}

      {!showInteractive && !editMode && !userReview && error && (
        <p className="star-error mt-3">{error}</p>
      )}
    </div>
  );
};

export default StarRating;