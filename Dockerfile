FROM hayd/alpine-deno:1.4.4

COPY ./ /server/
WORKDIR /server/
RUN deno cache --unstable main.ts

EXPOSE 8083
ENTRYPOINT []

CMD [ "deno", "run","-A", "--unstable", "main.ts" ]
