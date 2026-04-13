import { useEffect } from "react";
import { useSelector } from "react-redux";
import { setAuthToken } from "../api/axios";
import type { RootState } from "../store";

export default function AuthTokenSync() {
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  return null;
}
