import React from "react";
import "../styles/skeletonloader.css"; // Create a new CSS file for skeleton loader styles

const SkeletonUserCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-details">
        <div className="skeleton-name"></div>
        <div className="skeleton-username"></div>
      </div>
    </div>
  );
};

export default SkeletonUserCard;
