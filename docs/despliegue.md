# Guía de Despliegue

## 1. Naturaleza del despliegue

TITICACA CONTRAST compila a un conjunto de archivos estáticos HTML, CSS, JavaScript, CSV y JSON dentro del directorio `web/dist/`. No requiere Node.js ni Python en el servidor de producción.

## 2. Preparación de compilación

Desde la terminal en la raíz del proyecto:

```powershell
cd web
npm run build
```

El contenido de `web/dist/` queda listo para alojarse en cualquier servidor web o servicio de hosting estático:
- GitHub Pages
- Cloudflare Pages
- Netlify
- Vercel (modo estático)
- Servidores web estándar (Nginx, Apache, Caddy, IIS)

## 3. Verificación de vista previa local

```powershell
cd web
npm run preview
```

## 4. Política de rutas y enlaces

La aplicación utiliza enrutamiento estático compatible (o HashRouter / rutas relativas) para evitar errores 404 al recargar la página en servidores que no implementan reescritura de URLs para SPAs.

