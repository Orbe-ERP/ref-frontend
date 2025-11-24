import useAuth from "./useAuth";

export const usePermissions = () => {
  const { user } = useAuth();
  
  const isAdmin = user?.role === "ADMIN";
  const isUser = user?.role === "USER";
  
  const canEdit = isAdmin;
  const canDelete = isAdmin;
  const canCreate = isAdmin;
  const canAccessDashboard = isAdmin;
  const canAccessConfig = isAdmin;
  const canAccessReports = isAdmin;
  const canAccessKitchen = isAdmin;
  const canViewAdvancedCharts = isAdmin;
  
  return {
    isAdmin,
    isUser,
    canEdit,
    canDelete,
    canCreate,
    canAccessDashboard,
    canAccessConfig,
    canAccessReports,
    canAccessKitchen,
    canViewAdvancedCharts,
  };
};