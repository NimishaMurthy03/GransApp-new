<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // ==============================
    //  EMPLOYEE LOGIN
    // ==============================
    public function empLogin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|min:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ], 400);
        }

        $user = Employee::where('email', $request->input('email'))->first();

        if (!$user) {
            return response()->json([
                'message' => 'Email not found.'
            ], 404);
        }

        if (Hash::check($request->input('password'), $user->password)) {
            $token = $user->createToken('YourAppName')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
            ], 200);
        } else {
            return response()->json([
                'message' => 'Invalid email or password',
            ], 401);
        }
    }

    // ==============================
    //  EMPLOYEE SIGN UP
    // ==============================
    public function empSignup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:employees,email',
            'password' => [
                'required',
                'min:5',
                'regex:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/'
            ],
        ], [
            'email.unique' => 'This email is already registered.',
            'password.regex' => 'Password must be at least 5 characters long.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ], 400);
        }

        $user = Employee::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Signed up successfully!',
        ], 200);
    }

    // ==============================
    //  UPDATE PASSWORD (FORGOT PASSWORD)
    // ==============================
    public function updatePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:employees,email',
            'password' => [
                'required',
                'min:5',
                'regex:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{5,}$/'
             ],
        ], [
            'email.exists' => 'This email is not registered.',
            'password.regex' => 'Password must be at least 5 characters long',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ], 400);
        }

        $user = Employee::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password updated successfully!',
        ], 200);
    }
}
