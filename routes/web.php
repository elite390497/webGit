<?php
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
 */

Route::get('/test', 'HomeController@test');
Route::get('/custom', function() {
    return;
});
Route::get('/cache', 'Configuration\ConfigurationController@clearCache');

Route::group(['middleware' => ['auth:api']], function () {
    Route::get('/backup/{id}/download', 'Utility\BackupController@download');

    Route::get('/finance/transaction/income/{uuid}/print', 'Finance\Transaction\IncomeController@printIncome');
    Route::get('/finance/transaction/income/{uuid}/attachment/{attachment_uuid}/download', 'Finance\Transaction\IncomeController@download');
    Route::get('/finance/transaction/expense/{uuid}/print', 'Finance\Transaction\ExpenseController@printExpense');
    Route::get('/finance/transaction/expense/{uuid}/attachment/{attachment_uuid}/download', 'Finance\Transaction\ExpenseController@download');
    Route::get('/finance/transaction/account/transfer/{uuid}/print', 'Finance\Transaction\AccountTransferController@printAccountTransfer');
    Route::get('/finance/transaction/account/transfer/{uuid}/attachment/{attachment_uuid}/download', 'Finance\Transaction\AccountTransferController@download');

    Route::get('/student/id-card/print', 'Student\StudentRecordController@generateIdCard');
    Route::get('/employee/id-card/print', 'Employee\EmployeeController@generateIdCard');

    Route::get('/student/{uuid}/document/{id}/attachment/{attachment_uuid}/download', 'Student\StudentDocumentController@download');
    Route::get('/student/{uuid}/qualification/{id}/attachment/{attachment_uuid}/download', 'Student\StudentQualificationController@download');
    Route::get('/student/{uuid}/terminate/{id}/attachment/{attachment_uuid}/download', 'Student\TerminationController@download');

    Route::get('/employee/{uuid}/document/{id}/attachment/{attachment_uuid}/download', 'Employee\EmployeeDocumentController@download');
    Route::get('/employee/{uuid}/qualification/{id}/attachment/{attachment_uuid}/download', 'Employee\EmployeeQualificationController@download');
    Route::get('/employee/{uuid}/designation/{id}/attachment/{attachment_uuid}/download', 'Employee\EmployeeDesignationController@download');
    Route::get('/employee/{uuid}/term/{id}/attachment/{attachment_uuid}/download', 'Employee\EmployeeTermController@download');

    Route::get('/employee/leave/request/{uuid}/attachment/{attachment_uuid}/download', 'Employee\LeaveRequestController@download');
    Route::get('/employee/payroll/transaction/{uuid}/attachment/{attachment_uuid}/download', 'Employee\PayrollTransactionController@download');

    Route::get('/transport/vehicle/document/{id}/attachment/{attachment_uuid}/download', 'Transport\Vehicle\VehicleDocumentController@download');
    Route::get('/transport/vehicle/service/record/{id}/attachment/{attachment_uuid}/download', 'Transport\Vehicle\VehicleServiceRecordController@download');
    Route::get('/transport/vehicle/fuel/{id}/attachment/{attachment_uuid}/download', 'Transport\Vehicle\VehicleFuelController@download');

    Route::get('/institute/document/{id}/attachment/{attachment_uuid}/download', 'Institute\InstituteDocumentController@download');

    Route::get('/academic/timetable/batch/{uuid}/print', 'Academic\TimetableController@printIndividualBatchTimetable');
    Route::get('/academic/certificate/{uuid}/print', 'Academic\CertificateController@printCertificate');

    Route::get('/resource/lesson/plan/{uuid}/print', 'Resource\LessonPlanController@printLessonPlan');
    Route::get('/resource/syllabus/{uuid}/print', 'Resource\SyllabusController@printSyllabus');

    Route::get('/resource/assignment/{uuid}/attachment/{attachment_uuid}/download', 'Resource\AssignmentController@download');
    Route::get('/resource/notes/{uuid}/attachment/{attachment_uuid}/download', 'Resource\NotesController@download');
    Route::get('/resource/lesson/plan/{uuid}/attachment/{attachment_uuid}/download', 'Resource\LessonPlanController@download');
    Route::get('/resource/syllabus/{uuid}/attachment/{attachment_uuid}/download', 'Resource\SyllabusController@download');

    Route::get('/exam/schedule/{id}/admit-card/print', 'Exam\ScheduleController@printAdmitCard');
    Route::get('/exam/report-card/{batch_id}/{record_id}/print', 'Exam\ReportController@printReportCard');

    Route::get('/reception/gate/pass/{uuid}/print', 'Reception\GatePassController@printDetail');
    Route::get('/reception/visitor/pass/{uuid}/print', 'Reception\VisitorLogController@printDetail');
    
    Route::get('/reception/postal/record/{uuid}/attachment/{attachment_uuid}/download', 'Reception\PostalRecordController@download');
    Route::get('/reception/complaint/{uuid}/attachment/{attachment_uuid}/download', 'Reception\ComplaintController@download');

    Route::get('/stock/purchase/{id}/attachment/{attachment_uuid}/download', 'Inventory\StockPurchaseController@download');
    Route::get('/stock/transfer/{id}/attachment/{attachment_uuid}/download', 'Inventory\StockTransferController@download');

    Route::get('/employee/payroll/{uuid}/print', 'Employee\PayrollController@printPayrollSlip');
    Route::get('/download/report/{uuid}', 'HomeController@download');
});

Route::get('/calendar/event/{uuid}/attachment/{attachment_uuid}/download', 'Calendar\EventController@download');
Route::get('/post/article/{uuid}/attachment/{attachment_uuid}/download', 'Post\ArticleController@download');
Route::get('/frontend/page/{uuid}/attachment/{attachment_uuid}/download', 'Frontend\PageController@download');
Route::get('/frontend/block/{uuid}/attachment/{attachment_uuid}/download', 'Frontend\BlockController@download');
Route::get('/paypal/status', 'Student\StudentFeePaymentController@paypalStatus');

// Used to get translation in json format for current locale

Route::get('/js/lang', function () {
    if (App::environment('local')) {
        Cache::forget('lang.js');
    }

    if (\Cache::has('locale')) {
        config(['app.locale' => \Cache::get('locale')]);
    }

    $strings = Cache::rememberForever('lang.js', function () {
        $lang = config('app.locale');
        $files = glob(resource_path('lang/' . $lang . '/*.php'));
        $strings = [];
        foreach ($files as $file) {
            $name = basename($file, '.php');
            $strings[$name] = require $file;
        }
        return $strings;
    });
    header('Content-Type: text/javascript');
    echo('window.i18n = ' . json_encode($strings) . ';');
    exit();
})->name('assets.lang');

Route::get('/{vue?}', function () {
    return view('home');
})->where('vue', '[\/\w\.-]*')->name('home');
