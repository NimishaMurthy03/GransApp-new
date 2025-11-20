<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SuperAdminController extends Controller
{
    public function superAdminLogIn(Request $request){

        $request->validate([
            'email' => 'required|min:6',
            'password'=> 'required|min:5'
        ]);

        $superAdmin = SuperAdmin::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Email not found.',
            ], 404);
        }


        if (!Hash::check($request->password, $superAdmin->password)) {
            return response()->json([
                'message' => 'Invalid email or password.',
            ], 401);
        }
    
        // Generate authentication token (Sanctum required)
        $token = $superAdmin->createToken('YourAppName')->plainTextToken;
    
        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
        ], 200);

    }


}
