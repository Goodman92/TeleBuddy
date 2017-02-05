<?php


Route::group(['prefix' => 'api'], function() {
    // Route::resource('employees', 'EmployeesController');
});

Auth::routes();


Route::get('/', 'Frontend\HomeController');

Auth::routes();

