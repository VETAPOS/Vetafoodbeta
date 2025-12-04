import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPermissions, fetchRoles, fetchUser, updateUser, updateUserPin, PermissionDto, RoleDto, UserDto } from '../api';
import { PinModal } from './PinModal';

export const EditUser: React.FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<UserDto | null>(null);
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [permissions, setPermissions] = useState<PermissionDto[]>([]);
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState<string | null>(null);
  const [grantPermissionIds, setGrantPermissionIds] = useState<string[]>([]);
  const [denyPermissionIds, setDenyPermissionIds] = useState<string[]>([]);
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([fetchUser(id), fetchRoles(), fetchPermissions()])
      .then(([userData, roleData, permData]) => {
        setUser(userData);
        setEmail(userData.email);
        setRoleId(userData.roleId);
        setGrantPermissionIds(userData.grantPermissionIds);
        setDenyPermissionIds(userData.denyPermissionIds);
        setRoles(roleData);
        setPermissions(permData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const sortedPermissions = useMemo(
    () => [...permissions].sort((a, b) => a.code.localeCompare(b.code)),
    [permissions],
  );

  const toggleGrant = (permissionId: string) => {
    setGrantPermissionIds((prev) =>
      prev.includes(permissionId) ? prev.filter((p) => p !== permissionId) : [...prev, permissionId],
    );
  };

  const toggleDeny = (permissionId: string) => {
    setDenyPermissionIds((prev) =>
      prev.includes(permissionId) ? prev.filter((p) => p !== permissionId) : [...prev, permissionId],
    );
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await updateUser(id, {
        email,
        roleId,
        grantPermissionIds,
        denyPermissionIds,
      });
      setUser(updated);
      setSuccess('Usuario actualizado');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePinSubmit = async (pin: string) => {
    if (!id) return;
    try {
      const result = await updateUserPin(id, pin || undefined);
      setUser(result.user);
      setSuccess(`PIN guardado (${result.pin})`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setShowPin(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando usuario...</div>;
  }

  if (error) {
    return <div className="error">No se pudo cargar el usuario: {error}</div>;
  }

  if (!user) {
    return <div className="error">Usuario no encontrado</div>;
  }

  return (
    <section>
      <h2>Editar Usuario</h2>
      <p>Usuario: {user.email}</p>
      <div className="card">
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Rol</label>
        <select value={roleId ?? ''} onChange={(e) => setRoleId(e.target.value || null)}>
          <option value="">Sin rol</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
        <div className="inline">
          <strong>Permisos otorgados directamente</strong>
        </div>
        {sortedPermissions.map((perm) => (
          <label key={perm.id} className="switch">
            <input
              type="checkbox"
              checked={grantPermissionIds.includes(perm.id)}
              onChange={() => toggleGrant(perm.id)}
            />
            <span>{perm.code}</span>
          </label>
        ))}
        <div className="inline">
          <strong>Permisos denegados</strong>
        </div>
        {sortedPermissions.map((perm) => (
          <label key={perm.id} className="switch">
            <input
              type="checkbox"
              checked={denyPermissionIds.includes(perm.id)}
              onChange={() => toggleDeny(perm.id)}
            />
            <span>{perm.code}</span>
          </label>
        ))}
        {success && <div className="success">{success}</div>}
        {error && <div className="error">{error}</div>}
        <button className="button primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
        <button className="button" onClick={() => setShowPin(true)}>
          {user.pinEnabled ? 'Actualizar PIN' : 'Definir PIN'}
        </button>
      </div>
      {showPin && <PinModal onClose={() => setShowPin(false)} onSubmit={handlePinSubmit} />}
    </section>
  );
};
