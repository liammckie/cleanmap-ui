
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const Index = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return <Navigate to={user ? "/dashboard" : "/"} replace />
}

export default Index
