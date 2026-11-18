# Guía desde cero: React, Express y una API

Esta guía explica cómo levantar el proyecto y cómo conectar una aplicación React
con una API usando `fetch()` y `useEffect()`.

## 1. Qué vamos a construir

La aplicación tiene dos partes:

1. **Frontend:** React, que construye la interfaz del navegador.
2. **Servidor:** Express, que entrega al navegador los archivos generados por
   Parcel.

La API de ejemplo será [Dog CEO](https://dog.ceo/dog-api/). Usaremos:

- `https://dog.ceo/api/breeds/list/all` para obtener las razas.
- `https://dog.ceo/api/breed/{raza}/images/random` para obtener una imagen.

> La base de datos SQLite mencionada en `README2.md` forma parte de la
> arquitectura explicada en clase, pero todavía no está implementada en este
> repositorio. La aplicación actual consume una API externa directamente.

## 2. Requisitos

- Node.js instalado.
- npm instalado.
- Una terminal abierta en la carpeta raíz del proyecto.

Comprobar las versiones:

```bash
node --version
npm --version
```

## 3. Instalar el proyecto

Desde la raíz del repositorio:

```bash
npm ci
```

`npm ci` instala exactamente las versiones guardadas en `package-lock.json`.

## 4. Entender la estructura

```text
.
├── app.js                 # Servidor Express
├── package.json           # Dependencias y comandos
├── src/
│   ├── index.html         # HTML inicial
│   └── index.js           # Código React
└── express/
    └── public/            # Archivos generados por Parcel
```

El navegador no ejecuta directamente todo lo que hay en `src/`. Parcel toma
esos archivos, los empaqueta y escribe el resultado en `express/public/`.
Después Express sirve esa carpeta.

## 5. Crear el frontend React

En `src/index.js`, importa React y crea un componente que:

1. Solicite las razas cuando se monta la página.
2. Guarde la respuesta en un estado.
3. Muestre las razas.
4. Solicite una imagen al seleccionar una raza.

Ejemplo mínimo:

```jsx
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBreeds() {
      try {
        const response = await fetch("https://dog.ceo/api/breeds/list/all");
        if (!response.ok) throw new Error("No se pudieron cargar las razas");

        const data = await response.json();
        setBreeds(Object.keys(data.message));
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    loadBreeds();
  }, []);

  async function loadImage(event) {
    const breed = event.target.value;
    setSelectedBreed(breed);
    setImage("");

    if (!breed) return;

    try {
      const response = await fetch(
        `https://dog.ceo/api/breed/${breed}/images/random`,
      );
      if (!response.ok) throw new Error("No se pudo cargar la imagen");

      const data = await response.json();
      setImage(data.message);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <main>
      <h1>Explorador de perros</h1>

      <label>
        Elige una raza:
        <select value={selectedBreed} onChange={loadImage}>
          <option value="">Selecciona una raza</option>
          {breeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>
      </label>

      {error && <p role="alert">{error}</p>}
      {image && <img src={image} alt={`Perro de raza ${selectedBreed}`} />}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
```

En `src/index.html` debe existir el elemento donde React se montará:

```html
<div id="root"></div>
<script type="module" src="./index.js"></script>
```

## 6. Configurar Express

El servidor debe servir el contenido generado por Parcel. Un `app.js` mínimo
es:

```js
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "express/public")));

app.listen(port, () => {
  console.log(`Servidor disponible en http://localhost:${port}`);
});
```

El proyecto usa `"type": "module"` en `package.json`, por eso se utiliza
`import` en vez de `require`.

## 7. Generar los archivos de producción

Ejecuta:

```bash
npm run build
```

Este comando equivale a empaquetar `src/index.html` y escribir los archivos
resultantes en `express/public/`.

## 8. Iniciar Express

En otra terminal, o después del build:

```bash
npm start
```

Abre <http://localhost:3000>.

## 9. Trabajar con actualización automática

Durante el desarrollo, usa dos terminales.

Terminal 1:

```bash
npm run watch
```

Terminal 2:

```bash
npm start
```

`npm run watch` recompila el frontend cuando cambia un archivo. Luego recarga
el navegador para ver el resultado.

## 10. Cómo funciona `fetch` y `useEffect`

### `fetch()`

`fetch()` realiza una solicitud HTTP y devuelve una promesa. Por eso se espera
el resultado con `await` y después se convierte la respuesta a JSON:

```js
const response = await fetch(url);
const data = await response.json();
```

Siempre conviene revisar `response.ok`, porque un error HTTP no siempre hace
que `fetch()` lance una excepción automáticamente.

### `useEffect()`

El efecto con `[]` se ejecuta cuando el componente se monta:

```js
useEffect(() => {
  // Solicitud inicial a la API
}, []);
```

Así la solicitud se realiza fuera del render y no se repite en cada renderizado.

## 11. Verificación rápida

1. `npm ci` termina sin errores.
2. `npm run build` crea archivos dentro de `express/public/`.
3. `npm start` inicia Express en el puerto `3000`.
4. `http://localhost:3000` muestra la aplicación.
5. El selector contiene razas.
6. Al elegir una raza aparece una imagen.
7. En DevTools > Network se observan las solicitudes a `dog.ceo`.

## 12. Problemas frecuentes

### El puerto 3000 ya está ocupado

Detén el proceso que lo usa o cambia `port` en `app.js`.

### La página está en blanco

Comprueba que:

- `src/index.html` contiene `<div id="root"></div>`.
- El `script` apunta a `./index.js`.
- Ejecutaste `npm run build` antes de `npm start`.
- La consola del navegador no muestra errores.

### No aparecen las razas

Revisa la pestaña **Network** y confirma que la solicitud a Dog CEO no esté
bloqueada. También verifica que el código compruebe `response.ok` y muestre el
mensaje de error.

### Cambié React pero no veo el cambio

Ejecuta `npm run watch` durante el desarrollo o vuelve a ejecutar `npm run
build` antes de iniciar Express.

