# TestApiLaravelReactRouter

Projet d'apprentissage : API Laravel + front React Router v7 (ajout/suppression d'utilisateurs).

## Backend (backEndTestApi)
composer install
copier .env.example vers .env, puis php artisan key:generate
configurer la base de données dans .env
php artisan migrate
php artisan serve

## Frontend (frontEndTestApi)
npm install
créer un .env avec VITE_API_URL=http://127.0.0.1:8000/api
npm run dev
