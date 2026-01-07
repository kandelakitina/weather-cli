set shell := ["fish", "-c"]

dev *args:
    deno run dev {{args}}
