import { AlertCircle } from 'react-feather';
import '../styles/confirmDelete.css'

export default function ConfirmCard({ setConfirmDelete, setConfirmedModal }) {

  return (
    <div className="confirm-box">
      <div>
        <h2><AlertCircle /> Confirmation Alert</h2>
        <p>Do you really want to delete property ?</p>
        <div className="confirm-buttons">
          <button
            onClick={(e) => {
              setConfirmDelete(true)
              setConfirmedModal(false)
            }}
          >Yes</button>
          <button
            onClick={(e) => {
              setConfirmDelete(false)
              setConfirmedModal(false)
            }}
          >No</button>
        </div>
      </div>
    </div>
  );
}
