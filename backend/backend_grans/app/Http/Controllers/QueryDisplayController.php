<?php

namespace App\Http\Controllers;
use App\Models\Query;
use Illuminate\Http\Request;


class QueryDisplayController extends Controller
{
public function displayQueries()
{
    $queries = \App\Models\Query::all();

    foreach ($queries as $query) {
        if ($query->photo) {
            $query->photo = url('uploads/queries/' . $query->photo);
        }
    }

    return response()->json($queries);
}
}
