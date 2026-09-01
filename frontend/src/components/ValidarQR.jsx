import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ValidarQR() {
  const { codigoQR } = useParams();
  const navigate     = useNavigate();

  useEffect(() => {
    navigate(`/escanear?codigo=${codigoQR}`);
  }, []);

  return null;
}
