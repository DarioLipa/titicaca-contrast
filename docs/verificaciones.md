# Registro de Verificaciones

## Procedimiento de verificación de Fase 0

1. **Frontend:**
   - Comprobación de instalación limpia (`npm ci` o `npm install`).
   - Verificación de tipos (`npm run typecheck`).
   - Linter (`npm run lint`).
   - Pruebas unitarias (`npm run test`).
   - Compilación para producción (`npm run build`).

2. **Pipeline:**
   - Verificación de estructura de paquetes.
   - Ejecución de pruebas unitarias mínimas (`pytest`).

3. **Seguridad y Privacidad:**
   - Búsqueda de secretos, tokens o credenciales.
   - Verificación de exclusión en `.gitignore`.

