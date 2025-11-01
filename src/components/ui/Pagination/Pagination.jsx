import styles from "./styles.module.scss";
import classNames from "classnames";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const { pagination, activePage } = styles;

  if (totalPages <= 1) return null;

  return (
    <div className={pagination}>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          className={classNames({ [activePage]: currentPage === index + 1 })}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
