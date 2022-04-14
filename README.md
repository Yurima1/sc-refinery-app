# SCREFINERY APP

A frontend to [sc-refinery-api](https://github.com/fre-sch/sc-refinery-api).


## CLI Commands

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# test the production build locally
npm run serve

# run tests with jest and enzyme
npm run test
```

For detailed explanation on how things work, checkout the [CLI Readme](https://github.com/developit/preact-cli/blob/master/README.md).


## Configure

Create ``.env`` file with contents:

```
PREACT_APP_APIURL=https://APIURL
PREACT_APP_BASEURL=/
```

For example, local development mode:

```
PREACT_APP_APIURL=https://localhost/api
PREACT_APP_BASEURL=/app
```


## Running local development mode

**Note that, since app and api exchange cookies, an https context is required.**

Here's an example NGINX config, to proxy both app and api on localhost. It requries
a self-signed SSL certificate, for example with [letsencrypt certificates for localhost](https://letsencrypt.org/de/docs/certificates-for-localhost/).

```
worker_processes  1;
daemon off;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
    error_log logs/error.log info;
    access_log logs/access.log;

    server {
        listen 80;
        return 301 https://$host$request_uri;
    }

    server {
        listen      443 ssl;
        server_name  localhost;

        ssl_certificate           certs/localhost.crt;
        ssl_certificate_key       certs/localhost.key;
        ssl_session_cache  builtin:1000  shared:SSL:10m;
        ssl_protocols  TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers HIGH:!aNULL:!eNULL:!EXPORT:!CAMELLIA:!DES:!MD5:!PSK:!RC4;
        ssl_prefer_server_ciphers on;

        location /app/ {
            proxy_set_header Host $http_host;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass_header Content-Type;
            proxy_redirect off;
            proxy_buffering off;
            proxy_pass http://localhost:8081/;
        }

        location /api/ {
            proxy_set_header Host $http_host;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass_header Content-Type;
            proxy_redirect off;
            proxy_buffering off;
            proxy_pass http://127.0.0.1:8080/;
        }

        location /ws {
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "Upgrade";
                proxy_set_header Host $http_host;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_pass_header Content-Type;
                proxy_redirect off;
                proxy_buffering off;
                proxy_pass http://localhost:8081;
        }
    }
}
```

To run development mode:

* Start NGINX with provided config
* Start app with ``npm run dev``
* Start api with
  ```
    cd sc-refinery-api
    source env/bin/activate
    python screfinery/server.py config.ini
  ```
* Browse to ``https://localhost/app/``
