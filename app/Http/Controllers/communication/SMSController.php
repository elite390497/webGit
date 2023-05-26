<?php

namespace App\Http\Controllers\Communication;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Communication\SMSRequest;
use App\Repositories\Communication\SMSRepository;

class SMSController extends Controller
{
    protected $request;
    protected $repo;

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        SMSRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->middleware('permission:send-sms');
        $this->middleware('prohibited.test.mode')->except(['store']);
    }

    /**
     * Used to submit SMS
     * @post ("/api/sms")
     * @return Response
     */
    public function store(SMSRequest $request)
    {
        $count = $this->repo->submit($this->request->all());

        return $this->success(['message' => trans('communication.number_sms_submitted', ['count' => $count])]);
    }
}