<?php

namespace App\Http\Controllers\Reception;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Reception\VisitorMessage;
use App\Http\Controllers\Controller;
use App\Http\Requests\Reception\VisitorMessageRequest;
use App\Repositories\Reception\VisitorMessageRepository;

class VisitorMessageController extends Controller
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
        VisitorMessageRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('frontend.website.enabled')->only('store');
    }

    /**
     * Used to get all Visitor Messages
     * @get ("/api/visitor/message")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', VisitorMessage::class);

        $visitor_messages = $this->repo->paginate($this->request->all());

        $filters = array();

        return $this->success(compact('visitor_messages', 'filters'));
    }

    /**
     * Used to print all Visitor Messages
     * @post ("/api/visitor/message/print")
     * @return Response
     */
    public function print()
    {
        $visitor_messages = $this->repo->print(request('filter'));

        return view('print.reception.visitor-message', compact('visitor_messages'))->render();
    }

    /**
     * Used to generate pdf all Visitor Messages
     * @post ("/api/visitor/message/pdf")
     * @return Response
     */
    public function pdf()
    {
        $visitor_messages = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.reception.visitor-message', compact('visitor_messages'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Contact
     * @frontend ("/api/frontend/contact")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Contact"),
     *      @Parameter("email", type="string", required="true", description="Email of Contact"),
     *      @Parameter("contact_number", type="string", required="true", description="Number of Contact"),
     *      @Parameter("subject", type="text", required="true", description="Subject of Contact"),
     *      @Parameter("message", type="text", required="true", description="Message of Contact")
     * })
     * @return Response
     */
    public function store(VisitorMessageRequest $request)
    {
        $visitor_message = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('frontend.contact_message_sent')]);
    }

    /**
     * Used to get Visitor Message detail
     * @get ("/api/visitor/message/{id}")
     * @param ({
     *      @Parameter("id", type="string", required="true", description="Id of Visitor Message"),
     * })
     * @return Response
     */
    public function show($id)
    {
        $this->authorize('list', VisitorMessage::class);

        $visitor_message = $this->repo->findOrFail($id);

        return $this->success(compact('visitor_message'));
    }

    /**
     * Used to delete Visitor Message
     * @delete ("/api/visitor/message/{id}")
     * @param ({
     *      @Parameter("id", type="string", required="true", description="Id of Visitor Message"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $this->authorize('delete', VisitorMessage::class);

        $visitor_message = $this->repo->findOrFail($id);

        $this->repo->delete($visitor_message);

        return $this->success(['message' => trans('reception.visitor_message_deleted')]);
    }
}
