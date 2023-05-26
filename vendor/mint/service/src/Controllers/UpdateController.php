<?php
namespace Mint\Service\Controllers;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Mint\Service\Repositories\InitRepository;
use Mint\Service\Repositories\UpdateRepository;

class UpdateController extends Controller
{
    protected $request;
    protected $repo;
    protected $init;

    public function __construct(
        Request $request,
        UpdateRepository $repo,
        InitRepository $init
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->init = $init;
        $this->middleware('prohibited.test.mode')->only(['download','update']);
    }

    public function index()
    {
        return $this->init->product();
    }

    public function download()
    {
        $release = $this->repo->download();

        return $this->success(['release' => $release, 'message' => trans('install.update_downloaded')]);
    }

    public function update()
    {
        $this->repo->update($this->request->all());

        return $this->success(['message' => trans('install.updated')]);
    }
}
