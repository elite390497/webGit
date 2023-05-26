<?php

namespace App\Http\Controllers\Library;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Library\BarcodeRequest;

class BarcodeController extends Controller
{
    protected $request;

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request
    ) {
        $this->request = $request;
    }

    /**
     * Used to print barcode
     * @post ("/api/library/barcode/print")
     * @return Response
     */
    public function print(BarcodeRequest $request)
    {
        if (request('type') == 'range') {
            $items = array();
            for($i=request('start'); $i<=request('end'); $i++) {
                $items[] = $i;
            }
        } else {
            $items = array_filter(explode(',', request('csv')));
        }

        return view('print.library.barcode', compact('items'))->render();
    }
}