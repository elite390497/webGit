<?php

namespace App\Http\Controllers\Configuration;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\CustomFieldRequest;
use App\Repositories\Configuration\CustomFieldRepository;

class CustomFieldController extends Controller
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
        CustomFieldRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/custom-field/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Custom Fields
     * @get ("/api/custom-field")
     * @return Response
     */
    public function index()
    {
        $custom_fields = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getPreRequisite();

        return $this->success(compact('custom_fields', 'filters'));
    }

    /**
     * Used to fetch all Custom Fields of given form
     * @get ("/api/custom-field/fetch")
     * @return Response
     */
    public function fetch()
    {
        return $this->ok($this->repo->fetch());
    }

    /**
     * Used to print all Custom Fields
     * @post ("/api/custom-field/print")
     * @return Response
     */
    public function print()
    {
        $custom_fields = $this->repo->print(request('filter'));

        return view('print.configuration.custom-field', compact('custom_fields'))->render();
    }

    /**
     * Used to generate pdf all Custom Fields
     * @post ("/api/custom-field/pdf")
     * @return Response
     */
    public function pdf()
    {
        $custom_fields = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.custom-field', compact('custom_fields'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Custom Field
     * @post ("/api/custom-field")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Custom Field"),
     *      @Parameter("type", type="string", required="true", description="Type of Custom Field")
     * })
     * @return Response
     */
    public function store(CustomFieldRequest $request)
    {
        $custom_field = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('configuration.custom_field_added')]);
    }

    /**
     * Used to get Custom Field detail
     * @get ("/api/custom-field/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Custom Field"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }
 
     /**
     * Used to reorder all custom fields
     * @frontend ("/api/custom-field/reorder")
     * @return Response
     */
    public function reorder()
    {
        $this->repo->reorder($this->request->all());
    
        return $this->success(['message' => trans('configuration.custom_field_updated')]);
    }

    /**
     * Used to update Custom Field
     * @patch ("/api/custom-field/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Custom Field"),
     *      @Parameter("name", type="string", required="true", description="Name of Custom Field"),
     *      @Parameter("type", type="string", required="true", description="Type of Custom Field")
     * })
     * @return Response
     */
    public function update($id, CustomFieldRequest $request)
    {
        $custom_field = $this->repo->findOrFail($id);

        $custom_field = $this->repo->update($custom_field, $this->request->all());

        return $this->success(['message' => trans('configuration.custom_field_updated')]);
    }

    /**
     * Used to delete Custom Field
     * @delete ("/api/custom-field/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Custom Field"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $custom_field = $this->repo->deletable($id);

        $this->repo->delete($custom_field);

        return $this->success(['message' => trans('configuration.custom_field_deleted')]);
    }
}