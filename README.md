# Social Network Project

<img src="public/img/logo.webp" alt="SocialHlanz" style="width: 400px;"/>

## Tabla de Contenidos

- [Social Network Project](#social-network-project)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Introducción a la aplicación (Getting Started)](#introducción-a-la-aplicación-getting-started)
  - [Manual de Instalación](#manual-de-instalación)
    - [Requisitos previos](#requisitos-previos)
    - [Pasos de instalación](#pasos-de-instalación)
  - [Manual de usuario](#manual-de-usuario)
    - [Registro e inicio de sesión](#registro-e-inicio-de-sesión)
    - [Creación de publicaciones](#creación-de-publicaciones)
    - [Comentarios y "Me gusta"](#comentarios-y-me-gusta)
    - [Perfil de usuario](#perfil-de-usuario)
  - [Manual de administración](#manual-de-administración)
    - [Gestión de usuarios](#gestión-de-usuarios)
    - [Moderación de contenido](#moderación-de-contenido)
  - [Conclusiones finales](#conclusiones-finales)
  - [Bibliografía 📖](#bibliografía-)
  - [Contribuciones](#contribuciones)
  - [Licencia](#licencia)
  - [Autor](#autor)

## Introducción a la aplicación (Getting Started)

Bienvenido a la red social desarrollada como parte del trabajo final de grado para el Grado Superior en Desarrollo Web. Esta aplicación permite a los usuarios registrarse, iniciar sesión, crear publicaciones, comentar en las publicaciones y dar "me gusta" a publicaciones y comentarios.

## Manual de Instalación

### Requisitos previos

- **Docker**: Asegúrate de tener Docker instalado en tu sistema. Puedes descargarlo desde [aquí](https://www.docker.com/products/docker-desktop).
- **Laravel Sail**: Utilizaremos Laravel Sail para gestionar los contenedores Docker.

### Pasos de instalación

1. **Clonar el repositorio**:
    ```bash
    git clone https://github.com/RogerCiv/socialapp.git
    cd tu-repositorio
    ```

2. **Copiar el archivo de entorno**:
    ```bash
    cp .env.example .env
    ```

3. **Configurar variables de entorno**:
   Abre el archivo `.env` y configura las variables necesarias como la conexión a la base de datos.
    ```bash
    DB_CONNECTION=mysql
    DB_HOST=mysql
    DB_PORT=3306
    DB_DATABASE=laravel(nombre que quieras ponerle a la base de datos)
    DB_USERNAME=usuario
    DB_PASSWORD=password
    ```
   **Para configurar mailpit y poder verificar el registro**:
    ```bash
    MAIL_MAILER=smtp
    MAIL_HOST=mailpit
    MAIL_PORT=1025
    MAIL_USERNAME=null
    MAIL_PASSWORD=null
    MAIL_ENCRYPTION=null
    MAIL_FROM_ADDRESS="hello@example.com"
    MAIL_FROM_NAME="${APP_NAME}"
    ```
   **Para probar meilisearch añadir en el `.env` lo siguiente**:
    ```bash
    SCOUT_DRIVER=meilisearch
    MEILISEARCH_HOST=http://meilisearch:7700
    MEILISEARCH_NO_ANALYTICS=false
    ```

   **Y para moficiar logos del admin panel en el `.env**:
    ```bash
    MOONSHINE_LOGO='/img/logo.webp'
    MOONSHINE_LOGO_SMALL='/img/logo.webp'
    MOONSHINE_TITLE='SocialHlanz'
    ```

4. **Instalar dependencias con Composer sin necesidad de tener instalado composer en tu máquina**:
    ```bash
    docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php83-composer:latest \
    composer install --ignore-platform-reqs
    ```
   **Nota**: Si tienes Composer instalado en tu máquina, puedes ejecutar `composer install` en lugar del comando anterior.

5. **Levantar los contenedores Docker**:
    ```bash
    ./vendor/bin/sail up -d
    ```

6. **Generar la clave de la aplicación**:
    ```bash
    ./vendor/bin/sail artisan key:generate
    ```

7. **Migrar la base de datos**:
    ```bash
    ./vendor/bin/sail artisan migrate
    ```

8. **Sembrar la base de datos (opcional)**:
    ```bash
    ./vendor/bin/sail artisan db:seed
    ```
   **Nota**: Este comando añadirá datos de prueba a la base de datos.

9. **Generar usuario administrador hay 2 opciones**:
    ```bash
    php artisan moonshine:user
 
    ./vendor/bin/sail artisan moonshine:user
    ```    
10. **Instalar las dependencias de React**:
    ```bash
    ./vendor/bin/sail npm install
    ```

11. **Compilar los assets de React**:
    ```bash
    ./vendor/bin/sail npm run dev
    ```

La aplicación estará disponible en `http://localhost`.

## Manual de usuario

### Registro e inicio de sesión

- **Registro**:
    1. Accede a la página de registro desde el enlace en la pantalla de inicio.
    2. Completa el formulario con tu nombre, correo electrónico y contraseña.
    3. Haz clic en "Registrarse".
       **Nota**: En desarrollo entrar a `http://localhost:1025` para confirmar el registro con la verificación por email.

- **Inicio de sesión**:
    1. Accede a la página de inicio de sesión.
    2. Introduce tu correo electrónico y contraseña.
    3. Haz clic en "Iniciar sesión".

### Creación de publicaciones

1. Una vez que hayas iniciado sesión, accede a la página de inicio (Feed).
2. Haz clic en el botón "Crear Publicación".
3. Completa el formulario con el contenido de tu publicación y, opcionalmente, una imagen.
4. Haz clic en "Publicar".

### Comentarios y "Me gusta"

- **Comentarios**:
    1. Navega a una publicación.
    2. Introduce tu comentario en el campo correspondiente.
    3. Haz clic en "Comentar" 💬 :.

- **Me gusta**:
    - Para dar "me gusta" a una publicación o comentario, haz clic en el icono de "me gusta" ❤️ correspondiente.

### Perfil de usuario

1. Accede a tu perfil desde el menú de navegación.
2. Aquí puedes ver tus publicaciones, editar tu información de perfil y cambiar tu avatar.

## Manual de administración

### Gestión de usuarios

- **Para acceder al panel de administración entrar en `http://localhost/admin`**

- **Visualización de usuarios**:
    - Los administradores pueden ver una lista de todos los usuarios registrados.
    - Para acceder a la lista de usuarios, navega al panel de administración y selecciona "Users".

- **Edición y eliminación de usuarios**:
    - Los administradores pueden editar la información de los usuarios o eliminarlos.
    - Para editar o eliminar un usuario, selecciona el usuario de la lista y elige la acción correspondiente.

### Moderación de contenido

- **Publicaciones y comentarios**:
    - Los administradores pueden moderar publicaciones y comentarios.
    - Para moderar contenido, navega al panel de administración y selecciona "Publications" o "Comments".

## Conclusiones finales

El proyecto ha alcanzado todos los objetivos propuestos, proporcionando una plataforma de red social funcional y amigable. Futuras ampliaciones podrían incluir un sistema de mensajería instantánea, notificaciones en tiempo real, y la internacionalización del sitio.

## Bibliografía 📖

- [Documentación oficial de Laravel](https://laravel.com/docs/11.x)
- [Documentación oficial de Laravel Sail](https://laravel.com/docs/11.x/sail)
- [Documentación oficial de React](https://react.dev/)
- [Manual de instalación y configuración de Laravel Sail](https://laravel.com/docs/11.x/sail)
- [Manual TailwindCSS](https://tailwindcss.com/docs)
- [Manual Material UI components](https://mui.com/material-ui/getting-started/)
- [Manual Moonshine AdminDashboard](https://moonshine-laravel.com/docs/resource/getting-started/installation)

## Contribuciones

Si deseas contribuir a este proyecto, por favor sigue los siguientes pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva funcionalidad'`).
4. Empuja tus cambios a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## Autor

Desarrollado por [Rogelio Sánchez Civantos](https://github.com/RogerCiv).
