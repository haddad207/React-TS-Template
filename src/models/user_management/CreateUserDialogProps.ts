import type CreateUserFormData from "./CreateUserFormData.ts";

export default interface CreateUserDialogProps {
  open: boolean;
  formData: CreateUserFormData;
  isCreating: boolean;
  onClose: () => void;
  onFormDataChange: (data: CreateUserFormData) => void;
  onSubmit: () => void;
}
