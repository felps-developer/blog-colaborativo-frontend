'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';
import { useAuthResource } from '@/hooks/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, type ApiError } from '@/types/errors';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const authResource = useAuthResource();
  const { setUser, setToken } = useAuthStore();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authResource.register({ name, email, password });
      setToken(response.data.access_token);
      
      // Buscar perfil do usuário
      const profileResponse = await authResource.getProfile();
      setUser(profileResponse.data);
      
      toast({
        title: 'Conta criada',
        description: 'Sua conta foi criada com sucesso!',
      });
      
      router.push('/posts');
    } catch (err) {
      const error = err as ApiError;
      toast({
        variant: 'destructive',
        title: 'Erro ao criar conta',
        description: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-2xl border border-gray-200 bg-white">
      <CardHeader className="space-y-4 pb-8 pt-8">
        <div className="flex justify-center mb-4">
          <div className="bg-[#0052A5] p-4 rounded-xl shadow-lg">
            <User className="h-10 w-10 text-white" />
          </div>
        </div>
        <CardTitle className="text-3xl text-center font-bold text-gray-900">Criar Conta</CardTitle>
        <CardDescription className="text-center text-base text-gray-600">
          Crie sua conta para começar a publicar posts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={passwordVisible ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#0052A5] hover:bg-[#003d7a] text-white font-semibold h-12 shadow-md hover:shadow-lg transition-all" 
            disabled={loading}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>

          <div className="text-center text-sm pt-2">
            <span className="text-gray-600">Já tem uma conta? </span>
            <Link href="/auth/login" className="text-[#0052A5] hover:text-[#003d7a] font-semibold hover:underline">
              Fazer login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

