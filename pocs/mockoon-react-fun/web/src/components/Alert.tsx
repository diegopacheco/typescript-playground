export const Alert = ({ message }: { message: string | null }) =>
  message ? <p className="alert">{message}</p> : null;
