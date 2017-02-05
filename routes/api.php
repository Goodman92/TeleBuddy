<?php

use Illuminate\Http\Request;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');

Route::post('/login', 'API\LoginController@login');
Route::post('/test', 'API\LoginController@test');
Route::get('/login/user', 'API\LoginController@userAuthenticated');

//Customer controller
Route::get('/customers/clients/{floor?}/{ceil?}', 'API\CustomerController@index');
Route::get('/customers/cities', 'API\CustomerController@getCities');
Route::get('/customers/lines', 'API\CustomerController@getLines');
Route::get('/customers/details', 'API\CustomerController@getDetails');
Route::post('/customers/custom/{floor?}/{ceil?}', 'API\CustomerController@getCustomCompanies');
Route::post('/customers/generate', 'API\CustomerController@getList');

//Clientcontroller
Route::get('/clients', 'API\ClientController@index');
Route::post('/clients/delete', 'API\ClientController@delete');
Route::get('/clients/add/{id}', 'API\ClientController@add');
