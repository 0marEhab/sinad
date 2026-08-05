import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { LanguageToggle } from '../components/ui/LanguageToggle';
import { Alert } from '../components/ui/Alert';
import { InputField } from '../components/ui/InputField';
import { Button } from '../components/ui/Button';
import { api } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, user } = response.data;

      setAuth(user, accessToken);
      navigate('/');
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(t('common.unexpectedError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-login flex flex-col items-center font-sans relative pb-10">

      <div className="absolute top-6 end-6">
        <LanguageToggle />
      </div>

      {/* Logo */}
      <div className="mt-20 mb-8 flex items-center justify-center">
        <img src="/sinad.png" alt="SINAD Logo" className="h-24 w-auto object-contain" />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[440px] px-4">
        {/* Error Alert */}
        {error && <Alert message={error} />}

        {/* Login Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-xl font-semibold text-brand-primary mb-2">
              {t('common.welcomeBack')}
            </h1>
            <p className="text-gray-500 text-sm">
              {t('common.loginDesc')}
            </p>
          </div>

          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <InputField
              label={t('common.emailAddress')}
              type="email"
              placeholder="admin@sinad.com.kw"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} className="text-gray-500" />}
              required
            />

            {/* Password Field */}
            <InputField
              label={t('common.password')}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={18} className="text-gray-500" />}
              required
            />



            {/* Submit Button */}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('common.loggingIn') : t('common.logIn')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
