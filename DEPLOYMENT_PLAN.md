# hanibot Deployment Plan: Home NAS (Docker)

Goal: every push to `master` automatically redeploys the Discord bot on the home NAS, at ~$0/month, with no inbound ports opened on the home network.

## Background / decisions

- hanibot (`rbc-bot`) is a TypeScript / Node 24 Discord bot. On `GuildMemberAdd` it DMs the new member the welcome message.
- Member joins arrive via the Discord Gateway (Server Members intent, already enabled in `src/index.ts`), not HTTP webhooks. The bot needs an always-on process, so serverless hosts (Vercel) are not suitable.
- Railway currently deploys the repo (master -> staging, `railway` branch -> production), but its GitHub repo list was empty even after a full app reinstall, and Hobby costs $5/month. Self-hosting on the NAS is free.
- Chosen approach: GitHub Actions builds image -> GHCR stores it -> Watchtower on the NAS pulls and restarts. The NAS only makes outbound connections.
- Railway is left untouched for now so nothing breaks during the switch.

## Flow

1. Push to `master` on GitHub.
2. `docker-publish.yaml` builds a multi-arch (amd64 + arm64) image and pushes `ghcr.io/benalderfer/hanibot:latest` (+ a `sha-<commit>` tag).
3. Watchtower on the NAS detects the new `:latest`, pulls it, and recreates the `hanibot` container.

## What's in this branch (`nas-docker-deploy`)

| File | Purpose |
|---|---|
| `Dockerfile` | Two-stage build (`npm run compile`, then runtime with prod deps only, runs `node build/index.js` as the non-root `node` user) |
| `.dockerignore` | Keeps `.git`, `node_modules`, `build`, `.env`, tests, etc. out of the image |
| `.github/workflows/docker-publish.yaml` | Builds and pushes the image to GHCR on every push to `master` (also manually runnable) |
| `deploy/compose.yaml` | NAS stack: hanibot + Watchtower (labelled so it only updates hanibot) |
| `deploy/.env.example` | Template for the NAS-side `.env` (`TOKEN`, optional `LOG_CHANNEL_ID`) |
| `README.md` | New "Self-hosting on a NAS" section |

Verified locally: `tsc` compiles the project cleanly. The Docker image itself has not been built (no Docker available where this was prepared), so the first Actions run is the real test.

## Steps to go live

### 1. Merge and publish
- [ ] Review and merge this branch to `master` (the existing "Node.js CI" workflow runs on the PR).
- [ ] Confirm the "Publish Docker image" run succeeds and the package appears at github.com/BenAlderfer?tab=packages.
- [ ] Decide public vs private package. Private requires a one-time `docker login ghcr.io` on the NAS (personal access token, `read:packages`). Public is fine since no secrets are baked into the image.

### 2. Prepare the NAS
- [ ] Copy `deploy/` to the NAS (e.g. `/volume1/docker/hanibot/`).
- [ ] Create `.env` from `.env.example` and set `TOKEN` (the same bot token Railway uses).
- [ ] `docker compose up -d`, then `docker compose logs -f hanibot` and look for "bot logged in".

### 3. Cut over from Railway
- [ ] Only one instance should be logged in with the token, or members get two welcome DMs. Stop or remove the Railway production service once the NAS instance is confirmed working.
- [ ] Test by joining the server with an alt account.

### 4. Verify the full loop
- [ ] Push a trivial change to `master`, confirm the Actions run succeeds, and confirm within ~5 minutes that `docker compose logs watchtower` shows the pull and restart.

## Notes

- Use the maintained Watchtower fork `nickfedor/watchtower`. The original `containrrr/watchtower` was archived in December 2025 and its Docker API client is rejected by newer Docker engines.
- Watchtower mounts the Docker socket, so it can control the host's Docker. `WATCHTOWER_LABEL_ENABLE` limits which containers it updates.
- Staging vs production: this publishes only `master`. If you want a separate NAS staging bot, add a second tag/branch and a second compose service with its own token.
- The channel-logging feature lives on the separate `discord-channel-logging` branch. Once merged, set `LOG_CHANNEL_ID` in the NAS `.env`.
- Optional: Watchtower notifications (Discord/Pushover); pin to `sha-<commit>` tags for easy rollback.
- Action versions (`@v3`/`@v4`/`@v5`/`@v6`) were written from memory of current releases; Dependabot or a quick check can bump them.

## Alternatives considered

- Self-hosted GitHub Actions runner on the NAS: more flexible, but you maintain the runner.
- Portainer Git-based stacks: good if Portainer is already in use.
- SSH deploy from Actions: requires exposing SSH to the internet; avoided.
- Oracle Cloud Always Free VM ($0) or Railway Hobby ($5/month): fallbacks if the NAS isn't reliably on.

## Links

- Watchtower fork: https://github.com/nicholas-fedor/watchtower
- GHCR docs: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry
- Self-hosted runners: https://docs.github.com/en/actions/hosting-your-own-runners
- Discord intents: https://discord.com/developers/docs/events/gateway#gateway-intents
