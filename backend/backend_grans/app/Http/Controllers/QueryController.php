<?php

namespace App\Http\Controllers;

use App\Models\Query;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\QuerySubmitted;

class QueryController extends Controller
{
    // ==============================
    // STORE NEW QUERY (Customer)
    // ==============================
    public function store(Request $request)
{
    $validatedData = $request->validate([
        'problem_statement' => 'required|string',
        'description' => 'required|string',
        'company_name' => 'required|string',
        'phone_number' => 'required|string',
        'name' => 'required|string',
        'email' => 'required|email',
        'photo' => 'nullable|file|mimes:jpg,jpeg,png|max:4096',
    ]);

    $photoName = null;

    if ($request->hasFile('photo')) {
        $photo = $request->file('photo');
        $photoName = time() . '_' . $photo->getClientOriginalName();
        $photo->move(public_path('uploads/queries'), $photoName);
    }

    Query::create([
        'problem_statement' => $validatedData['problem_statement'],
        'description' => $validatedData['description'],
        'company_name' => $validatedData['company_name'],
        'phone_number' => $validatedData['phone_number'],
        'name' => $validatedData['name'],
        'email' => $validatedData['email'],
        'photo' => $photoName,
    ]);

    return response()->json(['message' => 'Query submitted successfully'], 200);
}

    // ==============================
    // GET ALL QUERIES (For Admin)
    // ==============================
    public function getQuery()
    {
        try {
            $queries = Query::all()->map(function ($query) {
                if ($query->photo) {
                    $query->photo = url('uploads/queries/' . $query->photo);
                }
                return $query;
            });

            return response()->json([
                'message' => 'All queries fetched successfully!',
                'data' => $queries,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching queries:', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Something went wrong while fetching queries',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // ==============================
    // DISPLAY QUERIES FOR STAFF
    // ==============================
   public function displayQueryStaff()
{
    $queries = \App\Models\Query::with('AssignCall')->get();

    $queries = $queries->map(function ($query) {
        $query->has_assigned_call = $query->assignCall !== null;

        // Build the full image URL
        if ($query->photo) {
            $query->photo = asset('uploads/queries/' . $query->photo);
        } else {
            $query->photo = null;
        }

        return $query;
    });

    return response()->json($queries);
}


    // ==============================
    // FOR SUPER ADMIN VIEW
    // ==============================
    public function getAllQueriesAndAssignedEngineers()
    {
        $queries = Query::with('assignCalls')->get();

        // Add full photo URL for each record
        $queries = $queries->map(function ($query) {
            if ($query->photo) {
                $query->photo = url('uploads/queries/' . $query->photo);
            }
            return $query;
        });

        return response()->json($queries);
    }
}
