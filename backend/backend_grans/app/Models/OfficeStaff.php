<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class OfficeStaff extends Authenticatable
{
    use HasApiTokens;

    protected $table = "office_staff";

    protected $fillable = [
        'name', 'email', 'phone', 'password'
    ];

    protected $hidden = [
        'password'
    ];
}
