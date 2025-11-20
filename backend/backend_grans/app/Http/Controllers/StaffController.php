<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\OfficeStaff;   // ✅ FIXED
use Illuminate\Support\Facades\Auth;

class StaffController extends Controller
{
    // ============================
    // STAFF SIGNUP
    // ============================
    public function staffSignup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:office_staff,email',
            'password' => 'required|min:4'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => "Validation error",
                'errors'  => $validator->errors()
            ], 422);
        }

        $staff = OfficeStaff::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'password' => Hash::make($request->password)
        ]);

        return response()->json([
            'message' => "Staff registered successfully",
            'staff'   => $staff
        ], 200);
    }


    // ============================
    // STAFF LOGIN
    // ============================
    public function staffLogin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => "Validation error",
                'errors'  => $validator->errors()
            ], 422);
        }

        // Check Email
        $staff = OfficeStaff::where('email', $request->email)->first();

        if (!$staff) {
            return response()->json([
                'message' => "Email not found"
            ], 404);
        }

        // Check Password
        if (!Hash::check($request->password, $staff->password)) {
            return response()->json([
                'message' => "Incorrect password"
            ], 401);
        }

        // Create Sanctum token
        $token = $staff->createToken("staff_token")->plainTextToken;

        return response()->json([
            'message' => "Staff login successful",
            'token'   => $token,
            'staff'   => $staff
        ], 200);
    }
    // ============================ OFFICE STAFF ADDITION ============================
    
    public function addOfficeStaff(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => 'required|string',
        'role' => 'nullable|string',
        'email' => 'required|email|unique:office_staff,email',
        'phone' => 'nullable|string',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Validation error',
            'errors' => $validator->errors()
        ], 422);
    }
    \Log::info("ROLE RECEIVED:", [$request->role]);
    
    $staff = OfficeStaff::create([
        'name' => $request->name,
        'role' => $request->role,
        'email' => $request->email,
        'phone' => $request->phone,
        'password' => bcrypt("12345678")  
    ]);

    return response()->json([
        'message' => 'Office Staff added successfully',
        'staff' => $staff
    ], 201);
}
public function getOfficeStaff()
{
    return response()->json(OfficeStaff::all());
}

}


