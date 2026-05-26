# Abi Cocina 🇻🇪

Sitio web sencillo para **Abi Cocina** — la comida casera venezolana de **Abi Norma** en Houston, Katy y alrededores.

Los pedidos llegan directo a su WhatsApp. No hay carrito ni pagos, solo un menú bonito y un botón grande para hacer el pedido.

A small marketing + ordering site for Abi Cocina, a Venezuelan home-catering business run by Abi Norma. Orders open WhatsApp pre-filled with the customer's selections.

---

## 1. Cómo cambiar el número de WhatsApp de Abi Norma

> **¡Esto es lo PRIMERO que tienes que hacer antes de publicar el sitio!**

1. Abre el archivo **[`src/data/menu.json`](src/data/menu.json)**.
2. En la parte de arriba, busca esta línea:

   ```json
   "whatsapp": "<<<REPLACE_WITH_ABI_NORMA_PHONE_E164>>>",
   ```

3. Reemplaza ese texto entre comillas por el número de Abi Norma **sin el signo `+`, sin espacios, sin guiones**.
   Para un número de Houston como `+1 (713) 555-1234`, queda así:

   ```json
   "whatsapp": "17135551234",
   ```

4. Guarda el archivo. Listo.

---

## 2. Cómo cambiar una foto del menú

Las fotos viven en la carpeta **[`public/images/`](public/images/)**. Cada plato del menú apunta a un archivo en esa carpeta (por ejemplo `caraotas-negras.jpg`).

Para cambiar una foto:

1. Consigue una foto cuadrada (~800×800px funciona bien). Buenos lugares gratis: [unsplash.com](https://unsplash.com), [pexels.com](https://pexels.com).
2. Guárdala con el **mismo nombre** que la que vas a reemplazar. Por ejemplo, para cambiar la foto de las caraotas, renombra tu nueva foto a `caraotas-negras.jpg` y arrástrala dentro de `public/images/`.
3. Listo. La página la usará automáticamente.

Si una foto no carga, la página muestra el emoji de la categoría como respaldo, así que la web nunca se ve rota.

> **TODO inicial:** la carpeta `public/images/` empieza vacía. Hay que llenarla con las fotos que mencionan los nombres en `menu.json`. Términos sugeridos para buscar están en el documento `project` (sección 10).

---

## 3. Cómo agregar o quitar un plato

Todo el menú está en **[`src/data/menu.json`](src/data/menu.json)**. No hace falta tocar código.

### Agregar un plato

Busca la categoría correspondiente (por ejemplo `"carnes"`) y agrega un objeto nuevo dentro de su lista `"items"`:

```json
{
  "id": "pernil-asado",
  "name": "Pernil Asado",
  "nameEn": "Roasted Pork Leg",
  "portion": "1 lb",
  "image": "/images/pernil-asado.jpg"
}
```

- **`id`**: un texto único en minúsculas, sin espacios (usa guiones).
- **`name`**: nombre en español que verá el cliente.
- **`nameEn`**: traducción en inglés (sale chiquita debajo).
- **`portion`**: tamaño (ej: `"1 lb"`, `"2 lb"`, `"por unidad"`).
- **`image`**: ruta de la foto. Tiene que ser un archivo dentro de `public/images/`.

**No te olvides:** después de agregar el plato, sube la foto a `public/images/` con el nombre que pusiste en `image`.

### Quitar un plato

Borra su objeto `{ ... }` completo (incluyendo la coma que lo separa del siguiente). Cuida que el JSON quede válido (sin comas sobrantes al final).

---

## 4. Cómo subir cambios (publicar la web)

La web se publica gratis en [Netlify](https://www.netlify.com). Hay dos formas — usa la que te resulte más fácil.

### Opción A — Arrastrar y soltar (la más fácil)

Desde la terminal, en la carpeta del proyecto:

```bash
npm install   # solo la primera vez
npm run build
```

Eso genera una carpeta llamada **`dist/`**. Arrastra esa carpeta `dist/` a [app.netlify.com/drop](https://app.netlify.com/drop). Netlify te da un link al instante.

### Opción B — Conectado a GitHub (se actualiza solo)

1. Sube el proyecto a un repositorio de GitHub.
2. En Netlify: **Add new site → Import an existing project** y elige el repo.
3. Cada vez que hagas un cambio y lo subas a GitHub, la web se actualiza sola.

### Dominio propio (opcional)

Si más adelante quieren tener un dominio como `abicocina.com`, Netlify lo permite — en el panel hay una opción para "Add custom domain" que te guía paso a paso.

---

## 5. Necesito ayuda

> **TODO:** poner aquí el email o WhatsApp de quien mantiene la web (probablemente tú 🙂).
> Ejemplo: *Si algo no funciona, escríbele a `tu-correo@ejemplo.com`.*

---

## Para desarrolladores / For developers

- **Stack:** Vite + React (JS) + Tailwind CSS + lucide-react. No backend.
- **Run locally:** `npm install` → `npm run dev` → open the printed URL.
- **Build:** `npm run build` (output in `dist/`).
- **State:** single `useReducer` cart in [`src/App.jsx`](src/App.jsx). No router, no global store.
- **WhatsApp link:** built in [`src/lib/whatsapp.js`](src/lib/whatsapp.js). Format is E.164 sin `+`.
- **Design tokens:** in [`tailwind.config.js`](tailwind.config.js) under `theme.extend.colors` (`abi.*` + `ve.*`).
- **Out of scope (por ahora):** pagos, login, base de datos, panel admin, multi-idioma con toggle, analítica.

### Mejoras futuras

- Mostrar precios cuando Abi Norma esté lista para publicarlos.
- Banner de "Especial de la semana".
- Galería de fotos de Abi Norma cocinando.
- Link / embed de Instagram cuando exista la cuenta.
- Dominio propio (`abicocina.com` o similar).
