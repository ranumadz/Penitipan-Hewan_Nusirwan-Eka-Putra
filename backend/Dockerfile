FROM php:8.1-fpm

RUN apt-get update && apt-get install -y         git unzip libonig-dev libzip-dev libpng-dev zlib1g-dev         libxml2-dev curl libcurl4-openssl-dev

RUN docker-php-ext-install pdo pdo_mysql mbstring zip

# composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
