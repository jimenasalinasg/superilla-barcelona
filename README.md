# Superilla Barcelona

Fanzine ilustrado sobre la Superilla de Consell de Cent (Barcelona, 2023), presentado como un acordeón que se pliega y despliega en el navegador.

Textos e ilustraciones por Jimena Salinas.

Para verlo en local:

```
python3 -m http.server
```

y abre http://localhost:8000.

## Reel para TikTok e Instagram

`reel/` tiene una versión de la página que se hojea sola en formato vertical (1080×1920) y un script que la graba cuadro por cuadro a MP4.

Necesita Node, `playwright-core`, Chromium y `ffmpeg`. Desde la raíz del repo:

```
python3 -m http.server 8000      # en una terminal
npm install playwright-core      # una vez
npx playwright install chromium  # una vez
node reel/grabar.js              # genera reel/superilla-reel.mp4
```

Los tiempos de cada página están en `DWELL`, dentro de `reel/index.html`.
