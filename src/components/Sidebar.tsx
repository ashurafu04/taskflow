import { memo } from "react";
import styles from "./Sidebar.module.css";
import { NavLink } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  color: string;
}
interface SidebarProps {
  projects: Project[];
  isOpen: boolean;
  onRename?: (project: Project) => void;
  onDelete?: (id: string) => void;
  disabled?: boolean;
}

function Sidebar({
  projects,
  isOpen,
  onRename,
  onDelete,
  disabled = false,
}: SidebarProps) {
  console.log("Sidebar re-render");

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
    >
      <h2 className={styles.title}>Mes Projets</h2>
      <ul className={styles.list}>
        {projects.map((p) => (
          <li key={p.id} className={styles.projectRow}>
            <NavLink
              to={`/projects/${p.id}`}
              className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ""}`
              }
            >
              <span className={styles.dot} style={{ background: p.color }} />
              {p.name}
            </NavLink>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => onRename?.(p)}
                disabled={disabled}
                title="Renommer"
              >
                R
              </button>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => onDelete?.(p.id)}
                disabled={disabled}
                title="Supprimer"
              >
                X
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

const MemoizedSidebar = memo(Sidebar);
MemoizedSidebar.displayName = "Sidebar";

export default MemoizedSidebar;
