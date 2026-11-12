# Politica de Seguridad

## Comunicar un problema de seguridad

Si descubres una vulnerabilidad de seguridad, **NO abras un issue público**.
Envíame un correo a: **security@tiendaldg.com**

Te recompensamos por reportar problemas de seguridad críticos.

## Política de actualización

- Actualizaciones de dependencias automáticas con `npm audit`
- Monitoreo de vulnerabilidades con **Dependabot**
- Revisiones de código antes de mergear

## Buenas prácticas implementadas

### 🔐 Seguridad de datos
- ✅ Claves API en `.env.local` (nunca en código)
- ✅ Reglas de Firestore para proteger datos
- ✅ Validación de inputs en el frontend y backend
- ✅ Sanitización de URLs para evitar SSRF

### 🛡️ Protección contra ataques
- ✅ HTTPS obligatorio (Firebase Hosting)
- ✅ Content Security Policy (CSP)
- ✅ Protection against XSS y CSRF
- ✅ Reglas estrictas de Firestore

### 🚫 Qué NO debes hacer
- ❌ No compartir tu archivo `.env.local`
- ❌ No exponer keys de API en el frontend
- ❌ No modificar reglas de Firestore sin revisión
- ❌ No hacer scraping masivo que pueda bloquear IPs

## Reportar vulnerabilidades

Por favor, reporta las siguientes categorías de vulnerabilidades:

1. **Inyección de código** (SQL, NoSQL, comandos)
2. **Autenticación/Rotura**
3. **Exposición de datos**
4. **Vulnerabilidades de seguridad del navegador**
5. **Problemas de configuración**

---

## Escaneo automático

Este proyecto utiliza:
- **GitHub Dependabot** para actualizaciones
- **ESLint** con reglas de seguridad
- **Firebase Security Rules** para base de datos

---

Gracias por ayudar a mantener la seguridad de TiendaLDG!