<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/uploads/queries/{filename}', function ($filename) {
    $path = public_path('uploads/queries/' . $filename);

    if (!file_exists($path)) {
        abort(404);
    }

    return response()->file($path);
});




