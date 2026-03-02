FROM php:8.2-fpm

# ១. ដំឡើង dependencies ចាំបាច់
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip

# ២. ដំឡើង PHP extensions សម្រាប់ MySQL
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# ៣. យក Composer មកប្រើ
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . .

# ៤. ដំឡើងកញ្ចប់ Laravel (មិនរត់ migration នៅទីនេះទេ ដើម្បីកុំឱ្យ build fail)
RUN composer install --no-dev --optimize-autoloader

# ៥. បង្កើត Storage Link និងផ្ដល់សិទ្ធិ


RUN php artisan storage:link || true
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

EXPOSE 8000

