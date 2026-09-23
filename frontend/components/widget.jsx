export default function Widget({ title, accent = "#6ea8fe", onRemove, children }) {
  return (
    <div className="widget">
      {/* className="widget__header" is the drag handle for react-grid-layout */}
      <div className="widget__header">
        <span className="widget__title">
          <span className="widget__dot" style={{ background: accent, color: accent }} />
          {title}
        </span>
        {onRemove && (
          <div className="widget__actions">
            <button className="widget__btn" onClick={onRemove} title="Remove" aria-label="Remove">
              ✕
            </button>
          </div>
        )}
      </div>
      <div className="widget__body">{children}</div>
    </div>
  );
}   