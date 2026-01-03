set shell := ["fish", "-c"]

dev *args:
    deno run --allow-sys --watch weather.ts {{args}}
