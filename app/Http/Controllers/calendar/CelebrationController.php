<?php

namespace App\Http\Controllers\Calendar;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Calendar\CelebrationRepository;

class CelebrationController extends Controller
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
        CelebrationRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->middleware('permission:list-birthday')->only(['birthday','printBirthday','pdfBirthday']);
        $this->middleware('permission:list-anniversary')->only(['anniversary','printAnniversary','pdfAnniversary']);
        $this->middleware('permission:list-work-anniversary')->only(['birthday','printWorkAnniversary','pdfWorkAnniversary']);
    }

    /**
     * Used to get all Birthdays
     * @get ("/api/birthday")
     * @return Response
     */
    public function birthday()
    {
        return $this->ok($this->repo->paginateBirthday($this->request->all()));
    }

    /**
     * Used to print all Birthdays
     * @post ("/api/birthday/print")
     * @return Response
     */
    public function printBirthday()
    {
        $filter = request('filter');
        $birthdays = $this->repo->printBirthday(request('filter'));
        return view('print.calendar.celebration.birthday', compact('birthdays','filter'))->render();
    }

    /**
     * Used to generate pdf all Birthdays
     * @post ("/api/birthday/pdf")
     * @return Response
     */
    public function pdfBirthday()
    {
        $filter = request('filter');
        $birthdays = $this->repo->printBirthday(request('filter'));
        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.calendar.celebration.birthday', compact('birthdays','filter'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to get all Anniversaries
     * @get ("/api/anniversary")
     * @return Response
     */
    public function anniversary()
    {
        return $this->ok($this->repo->paginateAnniversary($this->request->all()));
    }

    /**
     * Used to print all Anniversaries
     * @post ("/api/anniversary/print")
     * @return Response
     */
    public function printAnniversary()
    {
        $filter = request('filter');
        $anniversaries = $this->repo->printAnniversary(request('filter'));
        return view('print.calendar.celebration.anniversary', compact('anniversaries','filter'))->render();
    }

    /**
     * Used to generate pdf all Anniversaries
     * @post ("/api/anniversary/pdf")
     * @return Response
     */
    public function pdfAnniversary()
    {
        $filter = request('filter');
        $anniversaries = $this->repo->printAnniversary(request('filter'));
        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.calendar.celebration.anniversary', compact('anniversaries','filter'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to get all Work Anniversaries
     * @get ("/api/work/anniversary")
     * @return Response
     */
    public function workAnniversary()
    {
        return $this->ok($this->repo->paginateWorkAnniversary($this->request->all()));
    }

    /**
     * Used to print all Work Anniversaries
     * @post ("/api/work/anniversary/print")
     * @return Response
     */
    public function printWorkAnniversary()
    {
        $filter = request('filter');
        $work_anniversaries = $this->repo->printWorkAnniversary(request('filter'));
        return view('print.calendar.celebration.work-anniversary', compact('work_anniversaries','filter'))->render();
    }

    /**
     * Used to generate pdf all Work Anniversaries
     * @post ("/api/work/anniversary/pdf")
     * @return Response
     */
    public function pdfWorkAnniversary()
    {
        $filter = request('filter');
        $work_anniversaries = $this->repo->printWorkAnniversary(request('filter'));
        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.calendar.celebration.work-anniversary', compact('work_anniversaries','filter'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }
}