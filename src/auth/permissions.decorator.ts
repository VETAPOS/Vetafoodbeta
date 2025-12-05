export const PERMISSION_KEY = 'requiredPermissions';
export const Permission = (..._permissions: string[]) => (_target: any, _propertyKey?: string, _descriptor?: PropertyDescriptor) => {};
