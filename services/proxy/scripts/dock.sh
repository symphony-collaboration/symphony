docker build -t web-server . && slim build --target web-server \
docker tag web-server.slim ybirader/web-server.slim:latest && \
docker push ybirader/web-server.slim:latest
