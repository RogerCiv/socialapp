<?php

namespace App\Http\Controllers\Info;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InfoController extends Controller
{
    public function index()
    {
        return Inertia::render('info.index');
    }
    


        
}
