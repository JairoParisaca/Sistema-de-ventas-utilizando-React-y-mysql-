# Sistema de Gestión de Entregas

Una aplicación web multiplataforma para gestionar el proceso de entrega de comprobantes en una empresa comercial que vende productos online. Desarrollada con React para el frontend y MySQL para el backend.

## Características

- ✅ Interfaz UI/UX moderna, responsiva y centrada en la experiencia del usuario
- ✅ Formularios de registro, actualización y consulta de guías de entrega
- ✅ Conexión a base de datos MySQL mediante API REST
- ✅ Funcionalidad de carga (upload) de archivos con almacenamiento y visualización de comprobantes
- ✅ Diseño multiplataforma (adaptable a dispositivos móviles y de escritorio)

## Tecnologías Utilizadas

### Frontend
- React 18
- Material-UI (MUI)
- Axios para llamadas HTTP
- Responsive design con CSS-in-JS

### Backend
- Node.js con Express.js
- MySQL2 para conexión a base de datos
- Multer para manejo de archivos
- CORS para comunicación cross-origin
- Dotenv para variables de entorno

### Base de Datos
- MySQL
- Tablas: orders, delivery_guides

## Requisitos Previos

- Node.js (versión 14 o superior)
- MySQL Server (Workbench 8.0 CE recomendado)
- npm o yarn

## Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/JairoParisaca/Sistema-de-ventas-utilizando-React-y-mysql-.git
cd Sistema-de-ventas-utilizando-React-y-mysql-
```

### 2. Configurar la Base de Datos

1. Abrir MySQL Workbench
2. Ejecutar el script `backend/database.sql` para crear la base de datos y tablas
3. Verificar que se crearon las tablas `orders` y `delivery_guides`

### 3. Configurar el Backend

```bash
cd backend
npm install
```

Crear un archivo `.env` en la carpeta `backend` con la configuración de la base de datos:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=delivery_system
PORT=5000
```

### 4. Configurar el Frontend

```bash
cd ../frontend
npm install
```

## Ejecución

### Iniciar el Backend

```bash
cd backend
npm start
```

El servidor backend estará disponible en `http://localhost:5000`

### Iniciar el Frontend

```bash
cd frontend
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## Uso de la Aplicación

1. **Ver Guías de Entrega**: La página principal muestra una lista de todas las guías de entrega con su estado actual.

2. **Crear Nueva Guía**:
   - Hacer clic en "Nueva Guía"
   - Completar el formulario con la información requerida
   - Seleccionar el estado de la entrega
   - Guardar la guía

3. **Editar Guía**:
   - Hacer clic en el ícono de editar en la fila correspondiente
   - Modificar la información necesaria
   - Guardar los cambios

4. **Eliminar Guía**:
   - Hacer clic en el ícono de eliminar en la fila correspondiente
   - Confirmar la eliminación

5. **Subir Comprobante**:
   - En la lista de guías, hacer clic en "Upload" en la columna "Receipt"
   - Seleccionar el archivo (imagen o PDF)
   - Confirmar la subida

6. **Ver Comprobante**:
   - Hacer clic en "View" en la columna "Receipt" para visualizar el archivo subido

## Estructura del Proyecto

```
Sistema-de-ventas-utilizando-React-y-mysql-/
├── backend/
│   ├── server.js          # Servidor Express principal
│   ├── database.sql       # Script de creación de base de datos
│   ├── .env              # Variables de entorno
│   ├── uploads/          # Directorio para archivos subidos
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DeliveryGuideForm.js    # Formulario CRUD
│   │   │   └── DeliveryGuideList.js    # Lista y tabla de guías
│   │   ├── services/
│   │   │   └── api.js                  # Configuración de API
│   │   ├── App.js                      # Componente principal
│   │   └── index.js
│   └── package.json
├── README.md
└── TODO.md
```

## API Endpoints

### Guías de Entrega
- `GET /api/delivery-guides` - Obtener todas las guías
- `GET /api/delivery-guides/:id` - Obtener guía por ID
- `POST /api/delivery-guides` - Crear nueva guía
- `PUT /api/delivery-guides/:id` - Actualizar guía
- `DELETE /api/delivery-guides/:id` - Eliminar guía
- `POST /api/delivery-guides/:id/upload` - Subir comprobante

### Órdenes
- `GET /api/orders` - Obtener todas las órdenes

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Jairo Parisaca - [GitHub](https://github.com/JairoParisaca)
