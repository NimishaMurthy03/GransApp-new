<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\QueryController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\QueryDisplayController;
use App\Http\Controllers\AssignCallController;


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/emplogin', [AuthController::class, 'empLogin']);
Route::post('/empsignup', [AuthController::class, 'empSignup']);
Route::post('/updatepassword', [AuthController::class, 'updatePassword']);

Route::post('/postQuery', [QueryController::class, 'store']);
Route::get('/query', [QueryController::class, 'getQuery']); 
Route::get("/getAllQueriesAndAssignedEngineers",[QueryController::class, 'getAllQueriesAndAssignedEngineers']);

Route::post('/stafflogin', [StaffController::class, 'staffLogin']);
Route::post('/staffsignup', [StaffController::class, 'staffSignup']); 

Route::get('/displayquerystaff', [QueryDisplayController::class, 'displayQueries']);

//Route::post("/superAdminLogin", [SuperAdminController::class, 'superAdminLogin']);

Route::post('/assign-calls', [AssignCallController::class, 'store']);
Route::get('/assign-calls/query/{queryId}', [AssignCallController::class, 'showByQueryId']);

