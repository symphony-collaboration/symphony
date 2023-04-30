docker build -t web-server . && slim build --target web-server \
docker tag web-server.slim europe-west2-docker.pkg.dev/fourth-elixir-380718/symphony/web-server.slim && \
docker push europe-west2-docker.pkg.dev/fourth-elixir-380718/symphony/web-server.slim
