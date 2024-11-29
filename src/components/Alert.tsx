import "bootstrap/dist/css/bootstrap.css";

interface Props {
  message: string;
  type: "success" | "danger" | "warning" | "info";
  onClose: () => void;
}

function Alert({ message, type, onClose }: Props) {
  return (
    <div
      className={`alert alert-${type} alert-dismissble d-flex justify-content-between`}
    >
      <span>{message}</span>
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        onClick={onClose}
        // style={{ marginLeft: 900 }}
        aria-label="close"
      ></button>
    </div>
  );
}
export default Alert;
