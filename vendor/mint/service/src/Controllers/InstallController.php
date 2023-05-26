<?php
namespace Mint\Service\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Mint\Service\Requests\InstallRequest;
use Mint\Service\Repositories\InstallRepository;

class InstallController extends Controller
{
    protected $repo;
    protected $request;

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        InstallRepository $repo,
        Request $request
    ) {
        $this->repo    = $repo;
        $this->request = $request;
    }

    public function forceMigrate() {
        if (\Storage::exists('.app_installed')) {
            return 'Could not migrate!';
        }

        \Artisan::call('migrate', ['--force' => true]);
        
        return 'Migration completed!';
    }

    /**
     * Used to get pre requisites of server and folder
     */
    public function preRequisite()
    {
        $checks = $this->repo->getPreRequisite();

        $server_checks = $checks['server'];
        $folder_checks = $checks['folder'];
        $verifier = $checks['verifier'];

        envu(['APP_ENV' => 'local']);
        $name = env('APP_NAME');

        return $this->success(compact('server_checks', 'folder_checks', 'name','verifier'));
    }

    /**
     * Used to install the application
     */
    public function store(InstallRequest $request, $option = null)
    {
        $valid_database = $this->repo->validateDatabase($this->request->all(), $option);

        if ($option === 'database' || $option === 'admin' || $option === 'access_code') {
            return $this->success([]);
        }

        $this->repo->install($this->request->all());

        return $this->success(['message' => trans('install.done')]);
    }
}
