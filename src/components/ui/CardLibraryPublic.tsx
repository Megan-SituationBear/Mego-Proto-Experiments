import React from 'react';
import '../../styles/copado-ai-theme.css';

interface CardLibraryPublicProps {
  category: string;
  title: string;
  description: string;
  iconUrl?: string;
  onClick?: () => void;
}

const CardLibraryPublic: React.FC<CardLibraryPublicProps> = ({
  category,
  title,
  description,
  iconUrl,
  onClick,
}) => {
  return (
    <div 
      className="card-library-public" 
      onClick={onClick}
    >
      <div className="card-library-content">
        <div className="card-library-row-header">
          <div className="card-library-left">
            <div className="card-library-pill">
              <div className="card-library-pill-text">{category}</div>
            </div>
          </div>
          {iconUrl && (
            <img src={iconUrl} alt="" className="card-library-icon" />
          )}
        </div>
        <div className="card-library-content">
          <div className="card-library-title">{title}</div>
        </div>
      </div>
      <div className="card-library-description">{description}</div>
    </div>
  );
};

export default CardLibraryPublic;

