<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'App\User'                                          => 'App\Policies\UserPolicy',
        'App\Models\Utility\Todo'                           => 'App\Policies\Utility\TodoPolicy',
        'App\Models\Academic\AcademicSession'               => 'App\Policies\Academic\AcademicSessionPolicy',
        'App\Models\Finance\Account'                        => 'App\Policies\Finance\AccountPolicy',
        'App\Models\Academic\Course'                        => 'App\Policies\Academic\CoursePolicy',
        'App\Models\Academic\Batch'                         => 'App\Policies\Academic\BatchPolicy',
        'App\Models\Academic\ClassTeacher'                  => 'App\Policies\Academic\ClassTeacherPolicy',
        'App\Models\Academic\SubjectTeacher'                => 'App\Policies\Academic\SubjectTeacherPolicy',
        'App\Models\Academic\ClassTiming'                   => 'App\Policies\Academic\ClassTimingPolicy',
        'App\Models\Academic\Timetable'                     => 'App\Policies\Academic\TimetablePolicy',
        'App\Models\Academic\Subject'                       => 'App\Policies\Academic\SubjectPolicy',
        'App\Models\Student\Registration'                   => 'App\Policies\Student\RegistrationPolicy',
        'App\Models\Student\Student'                        => 'App\Policies\Student\StudentPolicy',
        'App\Models\Student\StudentParent'                  => 'App\Policies\Student\StudentParentPolicy',
        'App\Models\Employee\Employee'                      => 'App\Policies\Employee\EmployeePolicy',
        'App\Models\Employee\LeaveRequest'                  => 'App\Policies\Employee\LeaveRequestPolicy',
        'App\Models\Employee\Attendance'                    => 'App\Policies\Employee\AttendancePolicy',
        'App\Models\Employee\Payroll'                       => 'App\Policies\Employee\PayrollPolicy',
        'App\Models\Finance\Transaction\Transaction'        => 'App\Policies\Finance\Transaction\TransactionPolicy',
        'App\Models\Finance\Transaction\Income'             => 'App\Policies\Finance\Transaction\IncomePolicy',
        'App\Models\Finance\Transaction\Expense'            => 'App\Policies\Finance\Transaction\ExpensePolicy',
        'App\Models\Finance\Transaction\AccountTransfer'    => 'App\Policies\Finance\Transaction\AccountTransferPolicy',
        'App\Models\Finance\Fee\FeeGroup'                   => 'App\Policies\Finance\Fee\FeeGroupPolicy',
        'App\Models\Finance\Fee\FeeConcession'              => 'App\Policies\Finance\Fee\FeeConcessionPolicy',
        'App\Models\Finance\Fee\FeeHead'                    => 'App\Policies\Finance\Fee\FeeHeadPolicy',
        'App\Models\Finance\Fee\FeeAllocation'              => 'App\Policies\Finance\Fee\FeeAllocationPolicy',
        'App\Models\Transport\TransportCircle'              => 'App\Policies\Transport\TransportCirclePolicy',
        'App\Models\Transport\TransportStoppage'            => 'App\Policies\Transport\TransportStoppagePolicy',
        'App\Models\Transport\TransportRoute'               => 'App\Policies\Transport\TransportRoutePolicy',
        'App\Models\Transport\TransportFee'                 => 'App\Policies\Transport\TransportFeePolicy',
        'App\Models\Student\StudentRecord'                  => 'App\Policies\Student\StudentRecordPolicy',
        'App\Models\Transport\Vehicle\Vehicle'              => 'App\Policies\Transport\Vehicle\VehiclePolicy',
        'App\Models\Transport\Vehicle\VehicleIncharge'      => 'App\Policies\Transport\Vehicle\VehicleInchargePolicy',
        'App\Models\Transport\Vehicle\VehicleLog'           => 'App\Policies\Transport\Vehicle\VehicleLogPolicy',
        'App\Models\Transport\Vehicle\VehicleDocument'      => 'App\Policies\Transport\Vehicle\VehicleDocumentPolicy',
        'App\Models\Transport\Vehicle\VehicleFuel'          => 'App\Policies\Transport\Vehicle\VehicleFuelPolicy',
        'App\Models\Transport\Vehicle\VehicleServiceRecord' => 'App\Policies\Transport\Vehicle\VehicleServiceRecordPolicy',
        'App\Models\Institute\InstituteDocument'            => 'App\Policies\Institute\InstituteDocumentPolicy',
        'App\Models\Library\Book'                           => 'App\Policies\Library\BookPolicy',
        'App\Models\Library\BookLog'                        => 'App\Policies\Library\BookLogPolicy',
        'App\Models\Calendar\Holiday'                       => 'App\Policies\Calendar\HolidayPolicy',
        'App\Models\Calendar\Event'                         => 'App\Policies\Calendar\EventPolicy',
        'App\Models\Post\Article'                           => 'App\Policies\Post\ArticlePolicy',
        'App\Models\Reception\VisitorLog'                   => 'App\Policies\Reception\VisitorLogPolicy',
        'App\Models\Reception\Complaint'                    => 'App\Policies\Reception\ComplaintPolicy',
        'App\Models\Reception\CallLog'                      => 'App\Policies\Reception\CallLogPolicy',
        'App\Models\Reception\PostalRecord'                 => 'App\Policies\Reception\PostalRecordPolicy',
        'App\Models\Reception\GatePass'                     => 'App\Policies\Reception\GatePassPolicy',
        'App\Models\Reception\VisitorMessage'               => 'App\Policies\Reception\VisitorMessagePolicy',
        'App\Models\Reception\Enquiry'                      => 'App\Policies\Reception\EnquiryPolicy',
        'App\Models\Student\StudentAttendance'              => 'App\Policies\Student\StudentAttendancePolicy',
        'App\Models\Academic\Certificate'                   => 'App\Policies\Academic\CertificatePolicy',
        'App\Models\Resource\Assignment'                    => 'App\Policies\Resource\AssignmentPolicy',
        'App\Models\Resource\Notes'                         => 'App\Policies\Resource\NotesPolicy',
        'App\Models\Resource\LessonPlan'                    => 'App\Policies\Resource\LessonPlanPolicy',
        'App\Models\Resource\Syllabus'                      => 'App\Policies\Resource\SyllabusPolicy',
        'App\Models\Exam\OnlineExam'                        => 'App\Policies\Exam\OnlineExamPolicy',
        'App\Models\Exam\Exam'                              => 'App\Policies\Exam\ExamPolicy',
        'App\Models\Exam\Schedule'                          => 'App\Policies\Exam\SchedulePolicy',
        'App\Models\Exam\Record'                            => 'App\Policies\Exam\RecordPolicy',
        'App\Models\Inventory\StockCategory'                => 'App\Policies\Inventory\StockCategoryPolicy',
        'App\Models\Inventory\StockItem'                    => 'App\Policies\Inventory\StockItemPolicy',
        'App\Models\Inventory\Vendor'                       => 'App\Policies\Inventory\VendorPolicy',
        'App\Models\Inventory\StockPurchase'                => 'App\Policies\Inventory\StockPurchasePolicy',
        'App\Models\Inventory\StockTransfer'                => 'App\Policies\Inventory\StockTransferPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        //
    }
}
