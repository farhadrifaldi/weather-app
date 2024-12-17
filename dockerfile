# This will add about 137 MB (uncompressed)
FROM node:20.11.1-alpine3.19 AS base

# --------------------------------------------------------------------------------

# Build 1st image containing libraries and node_modules, so future build can reuse
# cache of this image (as long as package.json doesn't change).

FROM base AS deps
# Node process might need libc6-compat, https://github.com/nodejs/docker-node#nodealpine.
RUN apk add --no-cache libc6-compat

# create and use /app folder for base operation.
WORKDIR /app

# COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Use different package.json for build, to avoid installing unnecessary packages.
# COPY docker/overrides/build_only.package.json ./package.json
COPY package.json ./package.json
COPY yarn.lock* ./

# COPY ./patches ./patches
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  # elif [ -f package-lock.json ]; then npm ci; \
  # elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Installing node_modules dependencies will add about 2.3 GB (!) to the image. 
# The resulting image is about 2.42 GB.

# --------------------------------------------------------------------------------

# Build 2nd docker image for nextjs build. This image copy all files from repository,
# and copy node_modules from 1st built docker image above

FROM base AS builder
# create and use /app folder for base operation.
WORKDIR /app
# Copying node_modules from 1st docker image will add about 531 MB.
COPY --from=deps /app/node_modules ./node_modules
# Copying repository source files will add about less than 500 KB.
# BE CAREFUL: this also copy hidden files, unless you block them in .dockerignore.
COPY . .

# Use different tsconfig & next config for build.
# COPY docker/overrides/exclude_non_src.tsconfig.json ./tsconfig.json
# COPY docker/overrides/standalone.next.config.mjs ./next.config.mjs

# NextJS will inline all 'process.env.NEXT_PUBLIC_*'' env variables inside app
# at build time, so it can be usable later in browser. This must be done before
# nextjs build.

# Create .env file from external variable source (bitbucket pipeline).
# Comment these out if you run docker locally.
# ARG ENV_BASE64
# # base64 is built-in linux command (part of GNU coreutils).
# RUN echo "$ENV_BASE64" | base64 -d > /app/.env

# COPY  .env.example .env

# If you run docker outside pipeline that didn't send env variables (for example
# from locally build docker images), then simply create or copy .env file from
# repository, or from your local development folder.
# COPY .env.example .env

# TODO: Import generated encryption keys into .env file.

# disable nextjs telemetry on build.
ENV NEXT_TELEMETRY_DISABLED 1

# Finally, build nextjs app
# RUN npm run build
RUN yarn build

# Running build command will produce ".next" folder and add about 100 MB to the image.
# The resulting image is about 768 MB.

# --------------------------------------------------------------------------------

# Build 3rd docker image for production, containing only necessary files for running
# nextjs bundle.

FROM base AS runner
# create and use /app folder for base operation.
WORKDIR /app

# disable nextjs telemetry on runtime.
ENV NEXT_TELEMETRY_DISABLED 1

ENV NODE_ENV production

# Add nodejs group and user nextjs
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing

# Copy standalone output (including "server.js") to root /app
# This will add about 19 MB to the image.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Copy the rest of static folder. This will add about 1.1 MB.
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]