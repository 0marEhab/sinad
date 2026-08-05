import { AlertCircle } from 'lucide-react';
interface AlertProps {
  message: string;
}

export const Alert = ({ message }: AlertProps) => {
  return (
    <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 mb-6 flex items-start gap-3">
      <AlertCircle size={20} className="text-red-600 mt-0.5 shrink-0" />
      <p className="text-sm">
        {message}
      </p>
    </div>
  );
};
