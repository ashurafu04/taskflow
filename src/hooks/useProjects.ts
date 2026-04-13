import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import api from "../api/axios";

export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: string[];
}

function getAxiosMessage(err: unknown, fallback: string): string {
  if (!axios.isAxiosError(err)) return fallback;

  return (
    err.response?.data?.message || `Erreur: ${err.response?.status ?? "réseau"}`
  );
}

export default function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, colRes] = await Promise.all([
          api.get<Project[]>("/projects"),
          api.get<Column[]>("/columns"),
        ]);

        setProjects(projRes.data);
        setColumns(colRes.data);
      } catch {
        setError("Erreur chargement");
      } finally {
        setLoading(false);
      }
    }

    void fetchData();
  }, []);

  const addProject = useCallback(async (name: string, color: string) => {
    setSaving(true);
    setError(null);

    try {
      const { data } = await api.post<Project>("/projects", { name, color });
      setProjects((prev) => [...prev, data]);
    } catch (err) {
      setError(getAxiosMessage(err, "Erreur inconnue"));
    } finally {
      setSaving(false);
    }
  }, []);

  const renameProject = useCallback(async (project: Project) => {
    const newName = prompt("Nouveau nom :", project.name)?.trim();
    if (!newName || newName === project.name) return;

    setSaving(true);
    setError(null);

    try {
      const { data } = await api.put<Project>(`/projects/${project.id}`, {
        ...project,
        name: newName,
      });

      setProjects((prev) => prev.map((p) => (p.id === data.id ? data : p)));
    } catch (err) {
      setError(getAxiosMessage(err, "Erreur inconnue"));
    } finally {
      setSaving(false);
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    if (!confirm("Êtes-vous sûr ?")) return;

    setSaving(true);
    setError(null);

    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(getAxiosMessage(err, "Erreur inconnue"));
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    projects,
    columns,
    loading,
    error,
    saving,
    addProject,
    renameProject,
    deleteProject,
  };
}
