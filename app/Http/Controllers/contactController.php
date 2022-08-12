<?php

namespace App\Http\Controllers;

use App\Mail\WelcomeEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class contactController extends Controller
{
    public function Contact(Request $request)
    {
        // dd('dd');
        $receiving_email_address = 'ojenana@gmail.com';
        $from_name = $request->name;
        $from_email = $request->email;
        $subject = $request->subject;
        Mail::to($from_email)->send(new WelcomeEmail());
    }
}
