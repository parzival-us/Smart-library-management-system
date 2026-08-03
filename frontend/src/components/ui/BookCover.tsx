import React, { useMemo, useState } from 'react';

interface BookCoverProps {
  title: string;
  author?: string;
  coverUrl?: string;
  className?: string;
  compact?: boolean;
}

const coverThemes = [
  { background: 'linear-gradient(145deg, #0f766e 0%, #164e63 52%, #0f172a 100%)', accent: '#5eead4' },
  { background: 'linear-gradient(145deg, #7c2d12 0%, #9a3412 48%, #3f1d2e 100%)', accent: '#fdba74' },
  { background: 'linear-gradient(145deg, #4c1d95 0%, #4338ca 52%, #172554 100%)', accent: '#c4b5fd' },
  { background: 'linear-gradient(145deg, #9f1239 0%, #be123c 45%, #3f1d2e 100%)', accent: '#fda4af' },
  { background: 'linear-gradient(145deg, #854d0e 0%, #a16207 52%, #292524 100%)', accent: '#fde68a' },
  { background: 'linear-gradient(145deg, #1e3a8a 0%, #0369a1 50%, #0f172a 100%)', accent: '#7dd3fc' },
];

const getTheme = (value: string) => {
  const checksum = [...value].reduce((total, character) => total + character.charCodeAt(0), 0);
  return coverThemes[checksum % coverThemes.length];
};

const BookCover: React.FC<BookCoverProps> = ({ title, author, coverUrl, className = '', compact = false }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const theme = useMemo(() => getTheme(title), [title]);
  const hasImage = Boolean(coverUrl && !imageFailed);
  const initial = title.trim().charAt(0).toUpperCase() || 'B';

  return (
    <div
      className={`book-cover ${className}`}
      style={!hasImage ? { background: theme.background } : undefined}
      aria-label={`${title} cover`}
    >
      {hasImage ? (
        <img
          src={coverUrl}
          alt={`Cover of ${title}`}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <>
          <span className="book-cover__orb" style={{ backgroundColor: theme.accent }} aria-hidden="true" />
          <span className="book-cover__line book-cover__line--one" aria-hidden="true" />
          <span className="book-cover__line book-cover__line--two" aria-hidden="true" />
          <span className="book-cover__initial" style={{ color: theme.accent }} aria-hidden="true">{initial}</span>
          {!compact && (
            <div className="book-cover__copy">
              <span className="book-cover__eyebrow">Smart Library edition</span>
              <p>{title}</p>
              {author && <span>{author}</span>}
            </div>
          )}
        </>
      )}
      <span className="book-cover__gloss" aria-hidden="true" />
    </div>
  );
};

export default BookCover;
