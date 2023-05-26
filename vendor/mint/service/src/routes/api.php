<?php
Route::group(['prefix' => 'api'], function () {
    Route::get('/install/pre-requisite', 'Mint\Service\Controllers\InstallController@preRequisite');
    Route::post('/install/validate/{option}', 'Mint\Service\Controllers\InstallController@store');
    Route::post('/install', 'Mint\Service\Controllers\InstallController@store');
    Route::post('/license', 'Mint\Service\Controllers\LicenseController@verify');

    Route::post('/biometric', 'Mint\Service\Controllers\AttendanceController@read');
    Route::post('/biometric/v2', 'Mint\Service\Controllers\AttendanceController@readV2');

    Route::get('/about', 'Mint\Service\Controllers\HomeController@about');
    Route::get('/support', 'Mint\Service\Controllers\SupportController@index');
    Route::post('/support', 'Mint\Service\Controllers\SupportController@submit');
    Route::get('/update', 'Mint\Service\Controllers\UpdateController@index');
    Route::post('/download', 'Mint\Service\Controllers\UpdateController@download');
    Route::post('/update', 'Mint\Service\Controllers\UpdateController@update');
    Route::post('/help/content', 'Mint\Service\Controllers\HomeController@helpDoc');

    Route::get('/license/validate', 'Mint\Service\Controllers\HomeController@licenseValidate');
});
