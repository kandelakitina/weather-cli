set shell := ["fish", "-c"]

dev *args:
    deno run --allow-sys --allow-read --allow-write --watch weather.ts {{args}}
