import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { logout } from "../features/auth/authSlice";
import HeaderMUI from "../components/HeaderMUI";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import ProjectForm from "../components/ProjectForm";
import styles from "./Dashboard.module.css";
import useProjects, { type Project } from "../hooks/useProjects";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const userName = useSelector((state: RootState) => state.auth.user?.name);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const {
    projects,
    columns,
    loading,
    error,
    saving,
    addProject,
    renameProject,
    deleteProject,
  } = useProjects();
  const dangerousName = '<img src=x onerror=alert("HACK")>';

  const handleMenuClick = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleRename = useCallback(
    (project: Project) => {
      void renameProject(project);
    },
    [renameProject],
  );

  const handleDelete = useCallback(
    (id: string) => {
      void deleteProject(id);
    },
    [deleteProject],
  );

  const handleCreateProject = useCallback(
    (name: string, color: string) => {
      void addProject(name, color);
      setShowForm(false);
    },
    [addProject],
  );

  if (loading) return <div className={styles.loading}>Chargement...</div>;

  return (
    <div className={styles.layout}>
      <HeaderMUI
        title="TaskFlow"
        onMenuClick={handleMenuClick}
        userName={userName}
        onLogout={handleLogout}
      />
      <div className={styles.body}>
        <Sidebar
          projects={projects}
          isOpen={sidebarOpen}
          onRename={handleRename}
          onDelete={handleDelete}
          disabled={saving}
        />
        <div className={styles.content}>
          <div className={styles.toolbar}>
            {!showForm ? (
              <button
                className={styles.addBtn}
                disabled={saving}
                onClick={() => setShowForm(true)}
              >
                {saving ? "Enregistrement..." : "+ Nouveau projet"}
              </button>
            ) : (
              <ProjectForm
                submitLabel="Créer"
                onSubmit={handleCreateProject}
                onCancel={() => setShowForm(false)}
              />
            )}
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <p style={{ padding: "0 1rem", color: "#666" }}>{dangerousName}</p>
          <MainContent columns={columns} />
        </div>
      </div>
    </div>
  );
}
