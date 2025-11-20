<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\QueryController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\QueryDisplayController;
use App\Http\Controllers\AssignCallController;

// AUTH RELATED
Route::post('/emplogin', [AuthController::class, 'empLogin']);
Route::post('/empsignup', [AuthController::class, 'empSignup']);
Route::post('/updatepassword', [AuthController::class, 'updatePassword']);

// QUERIES RELATED
Route::post('/postQuery', [QueryController::class, 'store']);
Route::get('/query', [QueryController::class, 'getQuery']);
Route::get('/displayquerystaff', [QueryDisplayController::class, 'displayQueries']);
Route::get('/getAllQueriesAndAssignedEngineers', [QueryController::class, 'getAllQueriesAndAssignedEngineers']);

// ASSIGN CALLS
Route::post('/assign-calls', [AssignCallController::class, 'store']);
Route::get('/assign-calls/query/{queryId}', [AssignCallController::class, 'showByQueryId']);

// STAFF LOGIN & SIGNUP (FIELD STAFF)
Route::post('/stafflogin', [StaffController::class, 'staffLogin']);
Route::post('/staffsignup', [StaffController::class, 'staffSignup']);

// OFFICE STAFF (SEPARATE TABLE)
Route::post('/superadmin/add-office-staff', [StaffController::class, 'addOfficeStaff']);
Route::get('/office-staff/list', [StaffController::class, 'getOfficeStaff']);
