<?php

return [

    'defaults' => [
        'guard' => 'web',
        'passwords' => 'users',
    ],

    // -----------------------------
    // AUTH GUARDS
    // -----------------------------
    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],

        // 🔥 STAFF GUARD USING SANCTUM
        'staff' => [
            'driver' => 'sanctum',
            'provider' => 'office_staff',
        ],
    ],

    // -----------------------------
    // USER PROVIDERS
    // -----------------------------
    'providers' => [

        'users' => [
            'driver' => 'eloquent',
            'model'  => App\Models\User::class,
        ],

        // 🔥 STAFF USER PROVIDER
        'office_staff' => [
            'driver' => 'eloquent',
            'model'  => App\Models\OfficeStaff::class,
        ],
    ],

    // -----------------------------
    // PASSWORD RESET
    // -----------------------------
    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => 'password_reset_tokens',
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => 10800,
];
