import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPermissions, fetchRole, updateRole, PermissionDto, RoleDto } from '../api';

export const EditRole: React.FC = () => {
  const { id } = useParams();
  const [role, setRole] = useState<RoleDto | null>(null);
  const [permissions, setPermissions] = useState<PermissionDto[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([fetchRole(id), fetchPermissions()])
      .then(([roleResult, perms]) => {
        setRole(roleResult);
        setPermissions(perms);
        setSelected(roleResult.permissions.map((p) => p.id));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const sortedPermissions = useMemo(
    () => [...permissions].sort((a, b) => a.code.localeCompare(b.code)),
    [permissions],
  );

  const togglePermission = (permissionId: string) => {
    setSelected((prev) =>
      prev.includes(permissionId) ? prev.filter((p) => p !== permissionId) : [...prev, permissionId],
    );
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    setSuccess(null);
    setError(null);
    try {
      const updated = await updateRole(id, { name: role?.name, permissionIds: selected });
      setRole(updated);
      setSelected(updated.permissions.map((p) => p.id));
      setSuccess('Cambios guardados');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando rol...</div>;
  }

  if (error) {
    return <div className="error">No se pudo cargar el rol: {error}</div>;
  }

  if (!role) {
    return <div className="error">Rol no encontrado</div>;
  }

  return (
    <section>
      <h2>Editar Rol</h2>
      <p>Rol: {role.name}</p>
      <div className="card">
        {sortedPermissions.map((perm) => (
          <label key={perm.id} className="switch">
            <input
              type="checkbox"
              checked={selected.includes(perm.id)}
              onChange={() => togglePermission(perm.id)}
            />
            <span>
              {perm.code} - {perm.name}
            </span>
          </label>
        ))}
      </div>
      {success && <div className="success">{success}</div>}
      {error && <div className="error">{error}</div>}
      <button className="button primary" onClick={handleSave} disabled={saving}>
        {saving ? 'Guardando...' : 'Guardar'}
      </button>
    </section>
  );
};
