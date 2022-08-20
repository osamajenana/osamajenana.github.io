<?php

namespace App\Http\Controllers;

use App\Mail\WelcomeEmail;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class contactController extends Controller
{
    public function Contact(Request $request)
    {
        $data = [
            'subject' => $request->subject,
            'name' => $request->name,
            'email' => $request->email,
            'body' => $request->message
        ];
        try {
            Mail::to('ojenana11@gmail.com')->send(new WelcomeEmail($data));
            return response()->json(['msg' => 'OK']);
        } catch (Exception $ex) {
            return response()->json(['msg' => 'no']);
        }
    }
}
