<?php

namespace App\Http\Controllers;

use App\Models\Query;
use Illuminate\Http\Request;

class QueryDisplayController extends Controller
{
    public function displayQueries()
    {
        // Load assignCall relationship
        $queries = Query::with('assignCall')->get();

        $formatted = $queries->map(function ($query) {

            return [
                'id' => $query->id,
                'problem_statement' => $query->problem_statement,
                'description' => $query->description,
                'name' => $query->name,
                'phone_number' => $query->phone_number,
                'company_name' => $query->company_name,
                'email' => $query->email,

                // Fix image URL
                'photo' => $query->photo 
                    ? url('uploads/queries/' . $query->photo)
                    : null,

                // ⭐ MOST IMPORTANT PART ⭐
                'has_assigned_call' => $query->assignCall ? true : false,
            ];
        });

        return response()->json($formatted);
    }
}
