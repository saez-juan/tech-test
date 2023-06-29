<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use App\Model\Convertion;

class ConversionsController extends Controller
{
    public function store(Request $request) {
        $request->validate([
            'usd' => 'required|min:0|max:999999999',
            'btc' => 'required|min:0|max:999999999',
        ]);

        $conversion = new Convertion();
        $conversion->usd = $request->usd;
        $conversion->btc = $request->btc;
        $conversion->save();

        return redirect()->route('home')->with('success', 'Conversión registrada');
    }

    public function index() {
        $conversions = Conversion::all();
        return view('');
    }

    public function convert(Request $request) {
        $request->validate([
            "value" => "required|min:0|max:999999999",
            "to" => "required"
        ]);

        $console = new \Symfony\Component\Console\Output\ConsoleOutput();

        $client = new Client();
        $response = $client->get("https://api.coindesk.com/v1/bpi/currentprice/euro.json");
        $data = json_decode($response->getBody());

        $price_usd = $data->bpi->USD->rate_float;

        $result = 0;

        // satoshi-usd-value = usd / satoshi-unit;
        // to usd:
        //   satoshis = req-btc * satoshi-unit
        //   usd-result = satoshis * satoshi-usd-value
        // to btc:
        //   satoshis = req-usd / satoshi-usd-value
        //   btc = satoshis / satoshi_unit

        $satoshi_unit = 0.00000001;
        $satoshi_usd_value = $price_usd / $satoshi_unit;

        // from BTC to USD
        if ($request->to == "USD") {
            $satoshis = $request->value * $satoshi_unit;
            $result = $satoshis * $satoshi_usd_value;
        } else if ($request->to == "BTC") {
            $satoshis = $request->value / $satoshi_usd_value;
            $result = $satoshis / $satoshi_unit;
        }

        return $result;
    }
}
