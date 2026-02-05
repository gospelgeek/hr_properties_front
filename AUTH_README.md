# Sistema de Autenticación - Properties HR

## 🔐 Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto client con las siguientes variables:

```env
VITE_API_BASE_LOCAL=http://127.0.0.1:8000/api/
VITE_GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
```

### 2. Google OAuth Setup

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google OAuth 2.0
4. Crea credenciales (OAuth 2.0 Client ID)
5. Configura los orígenes autorizados:
   - `http://localhost:5173` (desarrollo)
   - Tu dominio de producción
6. Copia el Client ID y pégalo en `.env`

## 👥 Roles y Permisos

### 🔑 Admin
- **Login**: Google OAuth
- **Acceso**: 
  - Dashboard completo
  - CRUD de propiedades
  - CRUD de rentals
  - Gestión financiera
  - Repairs
  - Tenants
- **Requisito**: Email debe estar en `ADMIN_EMAILS` del backend

### 👤 Cliente  
- **Login**: Username (teléfono) + Password (año de nacimiento)
- **Acceso**:
  - Ver solo SUS propios rentals
  - Ver información de sus pagos
- **Restricción**: Solo lectura, no puede crear/editar/eliminar

### 🌐 Invitado (Sin login)
- **Acceso**:
  - Ver propiedades disponibles públicamente
- **Ruta**: `/public-properties`

## 🚀 Uso

### Login como Cliente
```javascript
POST /api/users/login/
{
  "username": "3123456789",
  "password": "31234567891990"
}
```

### Login como Admin
1. Click en tab "Administrador"
2. Click en botón "Iniciar sesión con Google"
3. Selecciona tu cuenta autorizada

### Cerrar Sesión
- Click en avatar del usuario (esquina superior derecha)
- Click en "Cerrar Sesión"

## 📁 Estructura de Archivos

```
src/
├── api/
│   └── auth.api.js          # Funciones de autenticación
├── context/
│   └── AuthContext.jsx      # Contexto global de autenticación
├── components/
│   └── ProtectedRoute.jsx   # HOC para rutas protegidas
├── pages/
│   ├── LoginPage.jsx        # Página de login (tabs Admin/Cliente)
│   └── PublicPropertiesPage.jsx  # Página pública (invitados)
```

## 🔒 Protección de Rutas

### Rutas Públicas
- `/login` - Página de login
- `/public-properties` - Propiedades disponibles

### Rutas Protegidas (Requieren autenticación)
- `/rentals` - Accesible para todos los autenticados

### Rutas Admin (Solo administradores)
- `/dashboard`
- `/properties`
- `/obligations`
- `/tenants`
- `/repairs`
- Todas las rutas de creación/edición

## 🔄 Flujo de Autenticación

1. Usuario visita aplicación → Redirigido a `/login`
2. Selecciona tipo de login:
   - **Cliente**: Ingresa teléfono + contraseña
   - **Admin**: Click en Google OAuth
3. Backend valida y retorna tokens JWT
4. Frontend guarda tokens en `localStorage`
5. Axios interceptor agrega `Authorization: Bearer <token>` en cada petición
6. Si token expira (401), se intenta renovar automáticamente con refresh token
7. Si falla la renovación, se limpia sesión y redirige a login

## 🛡️ Seguridad

- Tokens JWT almacenados en localStorage
- Refresh token automático cuando access token expira
- Interceptores axios manejan autenticación en todas las peticiones
- Rutas protegidas verifican roles antes de renderizar
- Google OAuth para cuentas administrativas
- Blacklist de tokens en logout (backend)

## 🐛 Troubleshooting

### Error: "Google OAuth no funciona"
- Verifica que `VITE_GOOGLE_CLIENT_ID` esté correctamente configurado
- Asegúrate que `http://localhost:5173` esté en orígenes autorizados
- Revisa la consola del navegador para errores

### Error: "401 Unauthorized"
- Verifica que el token no haya expirado
- Comprueba que el backend esté corriendo
- Revisa que el email del admin esté en `ADMIN_EMAILS`

### Cliente no ve sus rentals
- Verifica que el backend filtre correctamente por tenant
- Comprueba que el cliente tenga rentals asignados
- Revisa los logs del backend

## 📝 Notas

- Los clientes se crean desde el backend cuando se crea un Tenant
- Username del cliente = phone1 del tenant
- Password del cliente = phone1 + birth_year
- Admins deben ser agregados manualmente en `ADMIN_EMAILS` del backend
