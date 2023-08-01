import React from "react";
import "../styles/taskSkeleton.css";

const SkeletonTaskCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-avatar"></div>
      <div className="skeleton-details">
        <div className="skeleton-name"></div>
        <div className="skeleton-username"></div>
      </div>
    </div>
  );
};

export default SkeletonTaskCard;
