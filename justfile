set shell := ["fish", "-c"]

dev *args:
    deno run -P --config deno.json --watch weather.ts {{args}}
