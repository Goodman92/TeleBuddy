<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');

Route::post('/login', 'API\LoginController@login');
Route::post('/test', 'API\LoginController@test');
Route::get('/login/user', 'API\LoginController@userAuthenticated');

//Route::resource('customers/{limit?}', 'API\CustomerController');
Route::get('/customers/clients/{floor?}/{ceil?}', 'API\CustomerController@index');
Route::get('/customers/cities', 'API\CustomerController@getCities');
Route::get('/customers/lines', 'API\CustomerController@getLines');
Route::get('/customers/details', 'API\CustomerController@getDetails');
Route::post('/customers/custom/{floor?}/{ceil?}', 'API\CustomerController@getCustomCompanies');
Route::post('/customers/generate', 'API\CustomerController@getList');