FROM hayd/alpine-deno:1.4.4

COPY ./ /server/
WORKDIR /server/

EXPOSE 8083
ENTRYPOINT []

CMD [ "deno", "run","-A", "--unstable", "main.ts" ]
