<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Query extends Model
{
    use HasFactory;

    protected $fillable = [
        'problem_statement',
        'description',
        'company_name',
        'phone_number',
        'name',
        'email',
        'photo',
    ];

    // For super admin view (all assigned engineers)
    public function assignCalls()
    {
        return $this->hasMany(AssignCall::class, 'query_id');
    }

    // For staff/assign call button (single assignment)
    public function assignCall()
    {
        return $this->hasOne(AssignCall::class, 'query_id');
    }
}
