import type { FC } from "react";
import "./quote-card-skeleton.css";

const QuoteCardSkeleton: FC = () => {
  return (
    <div className="quote-card skeleton">
      <div>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div>
        <p></p>
        <p></p>
        <p></p>
        <div>
          <p>
            <span></span>
            <span></span>
          </p>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default QuoteCardSkeleton;
