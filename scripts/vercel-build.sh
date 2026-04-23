#!/usr/bin/env bash
# Build the personal site + the /visualizer/ sub-app into a single static
# directory that Vercel can serve without any rewrites.
#
# Output layout:
#   out/
#     index.html                  (root site)
#     blog.html
#     theme.css, theme.js
#     blogs/, projects/, photos/
#     santaclara.jpg, icon.png, ...
#     visualizer/                 (built React app)
#       index.html
#       assets/

set -euo pipefail

OUT="out"

echo "▶ Cleaning $OUT/..."
rm -rf "$OUT"
mkdir -p "$OUT"

echo "▶ Copying root static site..."
# Whitelist approach: only copy things we intend to serve.
for item in \
  index.html \
  blog.html \
  theme.css \
  theme.js \
  bg.png \
  santaclara.jpg \
  icon.png \
  favicon.ico \
  blogs \
  projects \
  photos
do
  if [ -e "$item" ]; then
    cp -r "$item" "$OUT/"
    echo "   ✓ $item"
  fi
done

echo "▶ Building visualizer..."
(
  cd visualizer
  npm install --silent
  npm run build
)

echo "▶ Placing visualizer at /visualizer/..."
cp -r visualizer/dist "$OUT/visualizer"

echo "▶ Done. Output tree:"
find "$OUT" -maxdepth 2 -type d | sort
