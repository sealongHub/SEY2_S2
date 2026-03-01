FROM php:8.2-fpm

# ដំឡើង dependencies
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip

# ដំឡើង PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# យក Composer មកប្រើ
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . .

# ដំឡើងកញ្ចប់ Laravel
RUN composer install --no-dev --optimize-autoloader

# បង្កើត Storage Link ជាមុនក្នុងដំណាក់កាល Build
RUN php artisan storage:link || true

# បើកសិទ្ធិឱ្យ Folder Storage និង Cache
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

EXPOSE 8000


# បញ្ជាឱ្យវារត់ Migration បង្កើត Table រាល់ពេល Server ចាប់ផ្ដើម
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=8000