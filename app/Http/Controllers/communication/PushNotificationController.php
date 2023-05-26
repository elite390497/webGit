<?php

namespace App\Http\Controllers\Communication;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Communication\PushNotificationRequest;
use App\Repositories\Communication\PushNotificationRepository;

class PushNotificationController extends Controller
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
        PushNotificationRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->middleware('permission:send-push-notification');
        $this->middleware('prohibited.test.mode')->except(['store']);
    }

    /**
     * Used to submit push notification
     * @post ("/api/push-notification")
     * @return Response
     */
    public function store(PushNotificationRequest $request)
    {
        $count = $this->repo->submit($this->request->all());

        return $this->success(['message' => trans('communication.push_notification_submitted')]);
    }
}