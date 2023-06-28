<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Model\Convertion;

class ConvertionsController extends Controller
{
    public function store(Request $request) {
        $request->validate([
            'usd' => 'required|min:0|max:999999999',
            'btc' => 'required|min:0|max:999999999',
        ]);

        $convert = new Convertion();
        $convert->usd = $request->usd;
        $convert->btc = $request->btc;
        $convert->save();

        return redirect()->route('todos')->with('success', 'Conversión registrada');
    }
}
