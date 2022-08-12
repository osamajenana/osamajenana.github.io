<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;


class contactController extends Controller
{
    public function Contact(Request $request)
    {
        // dd('dd');
        $receiving_email_address = 'ojenana@gmail.com';
        $from_name = $request->name;
        $from_email = $request->email;
        $subject = $request->subject;
        Mail::to('deli.pizza.bahla@gmail.com')->send(new SendEmail($emailMessage));
    }
}
