import './ConfirmModal.css';

function ConfirmModal({ isVisible, title, message, onConfirm, onCancel, confirmText = "Confirmar", cancelText = "Cancelar", isLoading = false }) {
  if (!isVisible) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <div className="confirm-modal-header">
          <h3>{title}</h3>
        </div>
        
        <div className="confirm-modal-body">
          <p>{message}</p>
        </div>
        
        <div className="confirm-modal-footer">
          <button 
            onClick={onCancel} 
            className="confirm-modal-cancel"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            className="confirm-modal-confirm"
            disabled={isLoading}
          >
            {isLoading ? 'Eliminando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
