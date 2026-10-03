# AI chat backend (HR Digital)

The chat box on the site works out of the box with built-in answers. To make it a real AI that answers any question, deploy ONE of these small backends. Your API key stays on the server and is never put in the website.

Get an API key at console.anthropic.com. Model used: claude-haiku-4-5 (fast and low cost).

## Option A: Cloudflare Worker (free tier)
1. `npm i -g wrangler` then `wrangler login`
2. In this folder: `wrangler init hr-chat` and replace the worker file with `worker.js`
3. `wrangler secret put ANTHROPIC_API_KEY` (paste your key)
4. `wrangler deploy` and copy the URL it prints.

## Option B: PHP shared hosting
1. Create `anthropic-key.php` ABOVE public_html: `<?php $ANTHROPIC_API_KEY = "sk-ant-...";`
2. Upload `chat.php` to the site root and the `ai-backend/` folder (for system-prompt.txt).

## Connect it
In `script.js`, set `var AI_ENDPOINT = 'https://YOUR-WORKER-URL';` (or `'/chat.php'`) and re-upload.

## Notes
- Edit `system-prompt.txt` (and the SYSTEM text in worker.js) to change what the bot knows.
- Set a monthly spend limit in the Anthropic console and add a Cloudflare rate-limit rule to avoid abuse.
