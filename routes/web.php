<?php

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\contactController;
use App\Mail\WelcomeEmail;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


// Route::get('change-language/{locale}', function ($locale) {
//     App::setLocale($locale);
//     return redirect()->route('index');
// })->name('change.language');

Route::get('/{locale?}', function ($locale = 'en') {
    App::setLocale($locale);
    return view('user.index');
})->name('index');


Route::post('user/Contact', [contactController::class, 'Contact'])->name('Contact');


Route::get('/user/email', function () {
    return new WelcomeEmail();
});
