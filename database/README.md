
# Configuración de Base de Datos PostgreSQL

## Requisitos
- PostgreSQL 12 o superior
- Node.js 16 o superior

## Configuración

1. **Instalar PostgreSQL**
   - Descarga e instala PostgreSQL desde https://www.postgresql.org/download/
   - Anota el usuario y contraseña que configures durante la instalación

2. **Crear la base de datos**
   ```bash
   # Conectarse a PostgreSQL como superusuario
   psql -U postgres
   
   # Crear la base de datos
   CREATE DATABASE evento_nomina_db;
   
   # Salir de psql
   \q
   ```

3. **Ejecutar el schema**
   ```bash
   # Ejecutar el script de schema
   psql -U postgres -d evento_nomina_db -f database/schema.sql
   ```

4. **Configurar variables de entorno**
   - Copia `.env.example` a `.env`
   - Actualiza las variables con tus credenciales de PostgreSQL:
   ```
   VITE_DB_HOST=localhost
   VITE_DB_PORT=5432
   VITE_DB_NAME=evento_nomina_db
   VITE_DB_USER=postgres
   VITE_DB_PASSWORD=tu_password_aqui
   VITE_DB_SSL=false
   VITE_JWT_SECRET=tu_clave_secreta_jwt_aqui
   ```

## Usuario por defecto
- Email: admin@example.com
- Password: password

## Comandos útiles

### Conectarse a la base de datos
```bash
psql -U postgres -d evento_nomina_db
```

### Ver tablas
```sql
\dt
```

### Ver usuarios
```sql
SELECT * FROM users;
```

### Ver perfiles
```sql
SELECT * FROM profiles;
```

### Cambiar contraseña de un usuario
```sql
UPDATE users SET password_hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE email = 'admin@example.com';
```
