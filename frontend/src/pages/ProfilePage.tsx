import React, { useState } from 'react';
import { User, MapPin, CreditCard, Package, LogOut, Edit } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { user, logout, updateProfile, orders, isAuthenticated } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressData, setAddressData] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    province: user?.address?.province || '',
    postalCode: user?.address?.postalCode || '',
    phone: user?.address?.phone || '',
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-4">Necesitas iniciar sesión</h2>
        <p className="text-muted-foreground mb-8">
          Accede a tu cuenta para ver tu perfil y pedidos
        </p>
        <Button onClick={() => onNavigate('auth')}>
          Iniciar Sesión
        </Button>
      </div>
    );
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileData);
    setIsEditingProfile(false);
    toast.success('Perfil actualizado');
  };

  const handleAddressUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ address: { ...addressData } });
    setIsEditingAddress(false);
    toast.success('Dirección actualizada');
  };

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada');
    onNavigate('home');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-secondary text-secondary-foreground';
      case 'shipped':
        return 'bg-primary text-primary-foreground';
      case 'processing':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Entregado';
      case 'shipped':
        return 'En camino';
      case 'processing':
        return 'Procesando';
      default:
        return 'Pendiente';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">Mi Cuenta</h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2">
            <Package className="w-4 h-4" />
            Pedidos
          </TabsTrigger>
          <TabsTrigger value="address" className="gap-2">
            <MapPin className="w-4 h-4" />
            Dirección
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-2">
            <CreditCard className="w-4 h-4" />
            Pagos
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3>Información Personal</h3>
              {!isEditingProfile && (
                <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Guardar Cambios</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditingProfile(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label>Nombre</Label>
                  <p>{user?.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p>{user?.email}</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <div className="space-y-4">
            <h3>Historial de Pedidos</h3>
            {orders.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No tienes pedidos aún</p>
                <Button onClick={() => onNavigate('catalog')}>
                  Explorar Productos
                </Button>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4>Pedido #{order.id}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-primary">
                        ${order.total.toLocaleString('es-AR')}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Address Tab */}
        <TabsContent value="address">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3>Dirección de Envío</h3>
              {!isEditingAddress && user?.address && (
                <Button variant="outline" size="sm" onClick={() => setIsEditingAddress(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>

            {isEditingAddress || !user?.address ? (
              <form onSubmit={handleAddressUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="street">Dirección</Label>
                  <Input
                    id="street"
                    value={addressData.street}
                    onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      value={addressData.city}
                      onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="province">Provincia</Label>
                    <Input
                      id="province"
                      value={addressData.province}
                      onChange={(e) => setAddressData({ ...addressData, province: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Código Postal</Label>
                    <Input
                      id="postalCode"
                      value={addressData.postalCode}
                      onChange={(e) => setAddressData({ ...addressData, postalCode: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={addressData.phone}
                    onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Guardar Dirección</Button>
                  {user?.address && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditingAddress(false)}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <p>{user.address.street}</p>
                <p>
                  {user.address.city}, {user.address.province} {user.address.postalCode}
                </p>
                <p>{user.address.phone}</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="mb-6">Métodos de Pago</h3>
            {user?.savedPaymentMethod ? (
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5" />
                  <div>
                    <p>
                      {user.savedPaymentMethod.type === 'credit'
                        ? 'Tarjeta de Crédito'
                        : 'Tarjeta de Débito'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      •••• {user.savedPaymentMethod.lastFour}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Eliminar
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  No tienes métodos de pago guardados
                </p>
                <p className="text-sm text-muted-foreground">
                  Puedes agregar uno durante el checkout
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
