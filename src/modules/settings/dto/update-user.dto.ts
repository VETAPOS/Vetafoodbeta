export class UpdateUserDto {
  email?: string;
  password?: string;
  roleId?: string | null;
  pinEnabled?: boolean;
  grantPermissionIds?: string[];
  denyPermissionIds?: string[];
}
