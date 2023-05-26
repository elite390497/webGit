<?php
namespace Mint\Service\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Mint\Service\Repositories\InitRepository;

class HomeController extends Controller
{
    protected $request;
    protected $repo;

    public function __construct(
        Request $request,
        InitRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
    }

    public function about()
    {
        return $this->repo->product();
    }
    
    /**
     * Used to get right sidebar content
     */
    public function helpDoc()
    {
        return $this->repo->helpDoc(request('subject'));
    }

    /**
     * Used to validate service for license request
     * @return array
     */
    public function licenseValidate()
    {
        return $this->repo->licenseValidate();
    }
}
