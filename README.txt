AMADER PATHSALA — COMPLETE PWA PACKAGE

Included:
- index.html: your existing app, with the old embedded favicon replaced by the new app icon
- manifest.webmanifest: install settings and correct relative scope for /AMADER_PATHSALA/
- sw.js: offline app-shell caching and service worker registration target
- icons/: 192px, 512px, Apple touch, favicon assets

UPLOAD STEPS (GitHub Pages):
1. Open your repository: sultanbdstore / AMADER_PATHSALA.
2. Upload/replace ALL files and the icons folder from this ZIP at the repository root.
   The root should contain index.html, manifest.webmanifest, sw.js, and icons/.
3. Keep the repository's existing app files and folders if the app uses them; this package replaces only
   index.html and adds/replaces manifest.webmanifest, sw.js, and icons/.
4. Commit the changes.
5. Open https://sultanbdstore.github.io/AMADER_PATHSALA/ in Chrome.
6. Refresh once, then close and reopen the page. In Chrome, use the menu > Install app
   (or Add to Home screen on Android).

IMPORTANT:
- This package is configured for the subpath /AMADER_PATHSALA/ (not the domain root).
- If the browser previously cached the old service worker, wait a minute, refresh twice,
  or clear the site's stored data once before testing installation again.
- GitHub Pages must be public/accessible over HTTPS.
- The existing app's own JavaScript and data logic are preserved from the supplied index(1).html.
- If your app depends on additional local files not included in the supplied HTML, upload those
  original files too; this package does not invent missing app assets.
