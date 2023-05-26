<?php

namespace App\Http\Controllers\Communication;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Communication\EmailRequest;
use App\Repositories\Communication\EmailRepository;

class EmailController extends Controller
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
        EmailRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->middleware('permission:send-email');
        $this->middleware('prohibited.test.mode')->except(['store']);
    }

    /**
     * Used to submit Email
     * @post ("/api/email")
     * @return Response
     */
    public function store(EmailRequest $request)
    {
        $count = $this->repo->submit($this->request->all());

        return $this->success(['message' => trans('communication.number_email_submitted', ['count' => $count])]);
    }
}