FROM frolvlad/alpine-glibc:alpine-3.8 as builder

RUN apk add --no-cache curl

ARG DENO_VERSION=v1.3.1

RUN curl -fsSL https://deno.land/x/install/install.sh | sh -s $DENO_VERSION

FROM frolvlad/alpine-glibc:alpine-3.8

COPY --from=builder /root/.deno/bin/deno /bin/

EXPOSE 8080
WORKDIR /app
COPY deps.ts .
RUN deno cache deps.ts
ADD . .
RUN deno cache main.ts
CMD ["deno", "run", "--allow-net", "main.ts"]