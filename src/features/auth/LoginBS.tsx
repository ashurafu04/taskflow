import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/axios";
import type { AppDispatch, RootState } from "../../store";
import { loginFailure, loginStart, loginSuccess } from "./authSlice";

interface LoginLocationState {
  from?: string;
}

interface ApiUser {
  id: string;
  email: string;
  password: string;
  name: string;
}

export default function LoginBS() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const from =
    (location.state as LoginLocationState | null)?.from || "/dashboard";

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const { data: users } = await api.get<ApiUser[]>(
        `/users?email=${encodeURIComponent(email)}`,
      );

      if (users.length === 0 || users[0].password !== password) {
        dispatch(loginFailure("Email ou mot de passe incorrect"));
        return;
      }

      const { password: passwordFromApi, ...user } = users[0];
      void passwordFromApi;

      const fakeToken = btoa(
        JSON.stringify({
          userId: user.id,
          email: user.email,
          role: "admin",
          exp: Date.now() + 3600000,
        }),
      );

      dispatch(loginSuccess({ user, token: fakeToken }));
    } catch {
      dispatch(loginFailure("Erreur serveur"));
    }
  }

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Card style={{ maxWidth: 400, width: "100%" }}>
        <Card.Body>
          <Card.Title className="text-center" style={{ color: "#1B8C3E" }}>
            TaskFlow
          </Card.Title>
          <p className="text-center text-muted">
            Connectez-vous pour continuer
          </p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" className="w-100" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
