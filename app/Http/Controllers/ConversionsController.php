<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use App\Models\Conversion;

class ConversionsController extends Controller
{
    public function store(float $usd_result, float $btc_result, float $btc_price) {
        $conversion = new Conversion();
        $conversion->usd = $usd_result;
        $conversion->btc = $btc_result;
        $conversion->btc_usd_price = $btc_price;
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

        if ($request->to == "USD") {
            $satoshis = $request->value * $satoshi_unit;
            $result = $satoshis * $satoshi_usd_value;

            $this->store($result, $request->value, $price_usd);
        } else if ($request->to == "BTC") {
            $satoshis = $request->value / $satoshi_usd_value;
            $result = $satoshis / $satoshi_unit;

            $this->store($request->value, $result, $price_usd);
        }

        return $result;
    }
}
