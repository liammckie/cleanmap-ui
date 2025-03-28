
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ClientForm from './ClientForm';
import { useClientDialog } from './useClientDialog';

interface AddClientDialogProps {
  children: React.ReactNode;
  onClientAdded?: () => void;
}

const AddClientDialog: React.FC<AddClientDialogProps> = ({ children, onClientAdded }) => {
  const {
    open,
    setOpen,
    loading,
    formData,
    handleChange,
    handleSubmit,
  } = useClientDialog({ onClientAdded });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Client</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the details for the new client.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit}>
          <ClientForm 
            formData={formData}
            onChange={handleChange}
            loading={loading}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={loading} onClick={handleSubmit}>
              {loading ? 'Creating...' : 'Create'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddClientDialog;
