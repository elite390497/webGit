<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

// Guest Routes
Route::group(['prefix' => 'auth'], function () {
	Route::post('/login', 'Auth\AuthController@login')->name('login');
	Route::post('/login/otp', 'Auth\AuthController@otp');
	Route::post('/check', 'Auth\AuthController@check');
	Route::post('/password', 'Auth\AuthController@password');
	Route::post('/validate-password-reset', 'Auth\AuthController@validatePasswordReset');
	Route::post('/reset', 'Auth\AuthController@reset');
});

Route::get('/config', 'Configuration\ConfigurationController@getConfig');

Route::post('/frontend/contact', 'Reception\VisitorMessageController@store');
Route::get('/frontend/menu/list', 'Frontend\FrontendController@listMenu');
Route::get('/frontend/page/{slug}/content', 'Frontend\FrontendController@getContent');
Route::get('/frontend/block/{uuid}/detail', 'Frontend\FrontendController@getBlock');
Route::get('/frontend/article/list', 'Frontend\FrontendController@listArticle');
Route::get('/frontend/article/{uuid}/detail', 'Frontend\FrontendController@getArticle');
Route::get('/frontend/event/list', 'Frontend\FrontendController@listEvent');
Route::get('/frontend/event/{uuid}/detail', 'Frontend\FrontendController@getEvent');
Route::get('/frontend/teacher/list', 'Frontend\FrontendController@listTeacher');
Route::get('/frontend/calendar/event', 'Frontend\FrontendController@getCalendarEvent');
Route::get('/frontend/online-registration/pre-requisite', 'Frontend\FrontendController@getOnlineRegistrationPreRequisite');
Route::post('/frontend/online-registration', 'Student\RegistrationController@onlineRegistration');

Route::group(['middleware' => ['auth:api']], function () {

	// Authentication Routes
	Route::post('/demo/message', 'HomeController@demoMessage');
	Route::post('/auth/refresh', 'Auth\AuthController@refresh');
	Route::post('/auth/me', 'Auth\AuthController@me');
	Route::post('/auth/logout', 'Auth\AuthController@logout');
	Route::post('/auth/lock', 'Auth\AuthController@lock');
	Route::post('/auth/security', 'Auth\AuthController@security');
	Route::post('/change/password', 'Auth\AuthController@changePassword');
	Route::post('/user/preference', 'Auth\UserController@preference');
	Route::get('/user/preference/pre-requisite', 'Auth\UserController@preferencePreRequisite');

	// Upload Routes
	Route::post('/upload', 'Upload\UploadController@upload');
	Route::post('/upload/extension', 'Upload\UploadController@getAllowedExtension');
	Route::post('/upload/image', 'Upload\UploadController@uploadImage');
	Route::post('/upload/fetch', 'Upload\UploadController@fetch');
	Route::post('/upload/{id}', 'Upload\UploadController@destroy');

	// Dashboard & Report Routes
	Route::get('/dashboard', 'HomeController@dashboard');
	Route::post('/dashboard/calendar/event', 'HomeController@calendarEvents');
	Route::post('/dashboard/student/strength/chart', 'HomeController@studentStrengthChart');
	Route::get('/search', 'HomeController@search');

	/*
		     * Configuration Routes Start
	*/
	Route::get('/configuration/variable', 'Configuration\ConfigurationController@getConfigurationVariable');
	Route::get('/configuration', 'Configuration\ConfigurationController@index');
	Route::post('/configuration', 'Configuration\ConfigurationController@store');
	Route::post('/configuration/{type}', 'Configuration\ConfigurationController@uploadImage');
	Route::delete('/configuration/{type}/remove', 'Configuration\ConfigurationController@removeImage');
	Route::get('/fetch/lists', 'Configuration\ConfigurationController@fetchList');
	Route::post('/setup/wizard', 'Configuration\ConfigurationController@setupWizard');

	Route::get('/locale', 'Configuration\LocaleController@index');
	Route::post('/locale', 'Configuration\LocaleController@store');
	Route::get('/locale/{id}', 'Configuration\LocaleController@show');
	Route::patch('/locale/{id}', 'Configuration\LocaleController@update');
	Route::delete('/locale/{id}', 'Configuration\LocaleController@destroy');
	Route::post('/locale/fetch', 'Configuration\LocaleController@fetch');
	Route::post('/locale/translate', 'Configuration\LocaleController@translate');
	Route::post('/locale/add-word', 'Configuration\LocaleController@addWord');

	Route::get('/role', 'Configuration\RoleController@index');
	Route::get('/role/employee/list', 'Configuration\RoleController@employeeRoleList');
	Route::get('/role/{id}', 'Configuration\RoleController@show');
	Route::post('/role', 'Configuration\RoleController@store');
	Route::delete('/role/{id}', 'Configuration\RoleController@destroy');

	Route::get('/permission', 'Configuration\PermissionController@index');
	Route::get('/permission/pre-requisite', 'Configuration\PermissionController@preRequisite');
	Route::get('/permission/{module}/pre-requisite', 'Configuration\PermissionController@modulePreRequisite');
	Route::get('/permission/{id}', 'Configuration\PermissionController@show');
	Route::post('/permission', 'Configuration\PermissionController@assignPermission');
	Route::post('/permission/module', 'Configuration\PermissionController@assignModulePermission');
	/*
		     * Configuration Routes End
	*/

	/*
		     * Utility Routes Start
	*/
	Route::post('/backup', 'Utility\BackupController@store');
	Route::get('/backup', 'Utility\BackupController@index');
	Route::delete('/backup/{id}', 'Utility\BackupController@destroy');

	Route::get('/ip-filter', 'Utility\IpFilterController@index');
	Route::get('/ip-filter/{id}', 'Utility\IpFilterController@show');
	Route::post('/ip-filter', 'Utility\IpFilterController@store');
	Route::patch('/ip-filter/{id}', 'Utility\IpFilterController@update');
	Route::delete('/ip-filter/{id}', 'Utility\IpFilterController@destroy');

	Route::get('/email-template', 'Utility\EmailTemplateController@index');
	Route::post('/email-template', 'Utility\EmailTemplateController@store');
	Route::get('/email-template/{id}', 'Utility\EmailTemplateController@show');
	Route::patch('/email-template/{id}', 'Utility\EmailTemplateController@update');
	Route::delete('/email-template/{id}', 'Utility\EmailTemplateController@destroy');
	Route::get('/email-template/{category}/lists', 'Utility\EmailTemplateController@lists');
	Route::get('/email-template/{id}/content', 'Utility\EmailTemplateController@getContent');

	Route::get('/todo', 'Utility\TodoController@index');
	Route::get('/todo/today', 'Utility\TodoController@getTodoOfToday');
	Route::get('/todo/{id}', 'Utility\TodoController@show');
	Route::post('/todo', 'Utility\TodoController@store');
	Route::patch('/todo/{id}', 'Utility\TodoController@update');
	Route::delete('/todo/{id}', 'Utility\TodoController@destroy');
	Route::post('/todo/{id}/status', 'Utility\TodoController@toggleStatus');

	Route::get('/email-log', 'Utility\EmailLogController@index');
	Route::get('/email-log/{id}', 'Utility\EmailLogController@show');
	Route::delete('/email-log/{id}', 'Utility\EmailLogController@destroy');

	Route::get('/activity-log', 'Utility\ActivityLogController@index');
	Route::delete('/activity-log/{id}', 'Utility\ActivityLogController@destroy');
	/*
		     * Utility Routes End
	*/

	/*
		     * Misc Routes Start
	*/

	Route::get('/custom-field/pre-requisite', 'Configuration\CustomFieldController@preRequisite');
	Route::get('/custom-field', 'Configuration\CustomFieldController@index');
	Route::get('/custom-field/fetch', 'Configuration\CustomFieldController@fetch');
	Route::get('/custom-field/{id}', 'Configuration\CustomFieldController@show');
	Route::post('/custom-field', 'Configuration\CustomFieldController@store');
	Route::post('/custom-field/reorder', 'Configuration\CustomFieldController@reorder');
	Route::post('/custom-field/print', 'Configuration\CustomFieldController@print');
	Route::post('/custom-field/pdf', 'Configuration\CustomFieldController@pdf');
	Route::patch('/custom-field/{id}', 'Configuration\CustomFieldController@update');
	Route::delete('/custom-field/{id}', 'Configuration\CustomFieldController@destroy');

	Route::get('/misc/blood/group', 'Configuration\Misc\BloodGroupController@index');
	Route::get('/misc/blood/group/{id}', 'Configuration\Misc\BloodGroupController@show');
	Route::post('/misc/blood/group', 'Configuration\Misc\BloodGroupController@store');
	Route::post('/misc/blood/group/print', 'Configuration\Misc\BloodGroupController@print');
	Route::post('/misc/blood/group/pdf', 'Configuration\Misc\BloodGroupController@pdf');
	Route::patch('/misc/blood/group/{id}', 'Configuration\Misc\BloodGroupController@update');
	Route::delete('/misc/blood/group/{id}', 'Configuration\Misc\BloodGroupController@destroy');

	Route::get('/misc/religion', 'Configuration\Misc\ReligionController@index');
	Route::get('/misc/religion/{id}', 'Configuration\Misc\ReligionController@show');
	Route::post('/misc/religion', 'Configuration\Misc\ReligionController@store');
	Route::post('/misc/religion/print', 'Configuration\Misc\ReligionController@print');
	Route::post('/misc/religion/pdf', 'Configuration\Misc\ReligionController@pdf');
	Route::patch('/misc/religion/{id}', 'Configuration\Misc\ReligionController@update');
	Route::delete('/misc/religion/{id}', 'Configuration\Misc\ReligionController@destroy');

	Route::get('/misc/caste', 'Configuration\Misc\CasteController@index');
	Route::get('/misc/caste/{id}', 'Configuration\Misc\CasteController@show');
	Route::post('/misc/caste', 'Configuration\Misc\CasteController@store');
	Route::post('/misc/caste/print', 'Configuration\Misc\CasteController@print');
	Route::post('/misc/caste/pdf', 'Configuration\Misc\CasteController@pdf');
	Route::patch('/misc/caste/{id}', 'Configuration\Misc\CasteController@update');
	Route::delete('/misc/caste/{id}', 'Configuration\Misc\CasteController@destroy');

	Route::get('/misc/category', 'Configuration\Misc\CategoryController@index');
	Route::get('/misc/category/{id}', 'Configuration\Misc\CategoryController@show');
	Route::post('/misc/category', 'Configuration\Misc\CategoryController@store');
	Route::post('/misc/category/print', 'Configuration\Misc\CategoryController@print');
	Route::post('/misc/category/pdf', 'Configuration\Misc\CategoryController@pdf');
	Route::patch('/misc/category/{id}', 'Configuration\Misc\CategoryController@update');
	Route::delete('/misc/category/{id}', 'Configuration\Misc\CategoryController@destroy');

	Route::get('/academic/course/group', 'Configuration\Academic\CourseGroupController@index');
	Route::get('/academic/course/group/{id}', 'Configuration\Academic\CourseGroupController@show');
	Route::post('/academic/course/group', 'Configuration\Academic\CourseGroupController@store');
	Route::post('/academic/course/group/reorder', 'Configuration\Academic\CourseGroupController@reorder');
	Route::post('/academic/course/group/print', 'Configuration\Academic\CourseGroupController@print');
	Route::post('/academic/course/group/pdf', 'Configuration\Academic\CourseGroupController@pdf');
	Route::patch('/academic/course/group/{id}', 'Configuration\Academic\CourseGroupController@update');
	Route::delete('/academic/course/group/{id}', 'Configuration\Academic\CourseGroupController@destroy');

	Route::get('/academic/institute', 'Configuration\Academic\InstituteController@index');
	Route::get('/academic/institute/{id}', 'Configuration\Academic\InstituteController@show');
	Route::post('/academic/institute', 'Configuration\Academic\InstituteController@store');
	Route::post('/academic/institute/print', 'Configuration\Academic\InstituteController@print');
	Route::post('/academic/institute/pdf', 'Configuration\Academic\InstituteController@pdf');
	Route::patch('/academic/institute/{id}', 'Configuration\Academic\InstituteController@update');
	Route::delete('/academic/institute/{id}', 'Configuration\Academic\InstituteController@destroy');

	Route::get('/academic/certificate/template/pre-requisite', 'Configuration\Academic\CertificateTemplateController@preRequisite');
	Route::get('/academic/certificate/template', 'Configuration\Academic\CertificateTemplateController@index');
	Route::get('/academic/certificate/template/{id}', 'Configuration\Academic\CertificateTemplateController@show');
	Route::post('/academic/certificate/template', 'Configuration\Academic\CertificateTemplateController@store');
	Route::post('/academic/certificate/template/print', 'Configuration\Academic\CertificateTemplateController@print');
	Route::post('/academic/certificate/template/pdf', 'Configuration\Academic\CertificateTemplateController@pdf');
	Route::patch('/academic/certificate/template/{id}', 'Configuration\Academic\CertificateTemplateController@update');
	Route::delete('/academic/certificate/template/{id}', 'Configuration\Academic\CertificateTemplateController@destroy');

	Route::get('/academic/id-card/template', 'Configuration\Academic\IdCardTemplateController@index');
	Route::get('/academic/id-card/template/{id}', 'Configuration\Academic\IdCardTemplateController@show');
	Route::post('/academic/id-card/template', 'Configuration\Academic\IdCardTemplateController@store');
	Route::post('/academic/id-card/template/print', 'Configuration\Academic\IdCardTemplateController@print');
	Route::post('/academic/id-card/template/pdf', 'Configuration\Academic\IdCardTemplateController@pdf');
	Route::patch('/academic/id-card/template/{id}', 'Configuration\Academic\IdCardTemplateController@update');
	Route::delete('/academic/id-card/template/{id}', 'Configuration\Academic\IdCardTemplateController@destroy');

	Route::post('/academic/id-card/template/{type}/{id}', 'Configuration\Academic\IdCardTemplateController@uploadImage');
	Route::delete('/academic/id-card/template/{type}/remove/{id}', 'Configuration\Academic\IdCardTemplateController@removeImage');

	Route::get('/asset/building', 'Configuration\Asset\BuildingController@index');
	Route::get('/asset/building/{id}', 'Configuration\Asset\BuildingController@show');
	Route::post('/asset/building', 'Configuration\Asset\BuildingController@store');
	Route::post('/asset/building/print', 'Configuration\Asset\BuildingController@print');
	Route::post('/asset/building/pdf', 'Configuration\Asset\BuildingController@pdf');
	Route::patch('/asset/building/{id}', 'Configuration\Asset\BuildingController@update');
	Route::delete('/asset/building/{id}', 'Configuration\Asset\BuildingController@destroy');

	Route::get('/asset/room/pre-requisite', 'Configuration\Asset\RoomController@preRequisite');
	Route::get('/asset/room', 'Configuration\Asset\RoomController@index');
	Route::get('/asset/room/{id}', 'Configuration\Asset\RoomController@show');
	Route::post('/asset/room', 'Configuration\Asset\RoomController@store');
	Route::post('/asset/room/print', 'Configuration\Asset\RoomController@print');
	Route::post('/asset/room/pdf', 'Configuration\Asset\RoomController@pdf');
	Route::patch('/asset/room/{id}', 'Configuration\Asset\RoomController@update');
	Route::delete('/asset/room/{id}', 'Configuration\Asset\RoomController@destroy');

    Route::get('/student/document/type', 'Configuration\Student\StudentDocumentTypeController@index');
    Route::get('/student/document/type/{id}', 'Configuration\Student\StudentDocumentTypeController@show');
    Route::post('/student/document/type', 'Configuration\Student\StudentDocumentTypeController@store');
    Route::post('/student/document/type/print', 'Configuration\Student\StudentDocumentTypeController@print');
    Route::post('/student/document/type/pdf', 'Configuration\Student\StudentDocumentTypeController@pdf');
    Route::patch('/student/document/type/{id}', 'Configuration\Student\StudentDocumentTypeController@update');
    Route::delete('/student/document/type/{id}', 'Configuration\Student\StudentDocumentTypeController@destroy');

    Route::get('/student/group', 'Configuration\Student\StudentGroupController@index');
    Route::get('/student/group/{id}', 'Configuration\Student\StudentGroupController@show');
    Route::post('/student/group', 'Configuration\Student\StudentGroupController@store');
    Route::post('/student/group/print', 'Configuration\Student\StudentGroupController@print');
    Route::post('/student/group/pdf', 'Configuration\Student\StudentGroupController@pdf');
    Route::patch('/student/group/{id}', 'Configuration\Student\StudentGroupController@update');
    Route::delete('/student/group/{id}', 'Configuration\Student\StudentGroupController@destroy');

	Route::get('/employee/group', 'Configuration\Employee\EmployeeGroupController@index');
	Route::get('/employee/group/{id}', 'Configuration\Employee\EmployeeGroupController@show');
	Route::post('/employee/group', 'Configuration\Employee\EmployeeGroupController@store');
	Route::post('/employee/group/print', 'Configuration\Employee\EmployeeGroupController@print');
	Route::post('/employee/group/pdf', 'Configuration\Employee\EmployeeGroupController@pdf');
	Route::patch('/employee/group/{id}', 'Configuration\Employee\EmployeeGroupController@update');
	Route::delete('/employee/group/{id}', 'Configuration\Employee\EmployeeGroupController@destroy');

	Route::get('/employee/document/type', 'Configuration\Employee\EmployeeDocumentTypeController@index');
	Route::get('/employee/document/type/{id}', 'Configuration\Employee\EmployeeDocumentTypeController@show');
	Route::post('/employee/document/type', 'Configuration\Employee\EmployeeDocumentTypeController@store');
	Route::post('/employee/document/type/print', 'Configuration\Employee\EmployeeDocumentTypeController@print');
	Route::post('/employee/document/type/pdf', 'Configuration\Employee\EmployeeDocumentTypeController@pdf');
	Route::patch('/employee/document/type/{id}', 'Configuration\Employee\EmployeeDocumentTypeController@update');
	Route::delete('/employee/document/type/{id}', 'Configuration\Employee\EmployeeDocumentTypeController@destroy');

	Route::get('/employee/leave/type', 'Configuration\Employee\LeaveTypeController@index');
	Route::get('/employee/leave/type/{id}', 'Configuration\Employee\LeaveTypeController@show');
	Route::post('/employee/leave/type', 'Configuration\Employee\LeaveTypeController@store');
	Route::post('/employee/leave/type/print', 'Configuration\Employee\LeaveTypeController@print');
	Route::post('/employee/leave/type/pdf', 'Configuration\Employee\LeaveTypeController@pdf');
	Route::patch('/employee/leave/type/{id}', 'Configuration\Employee\LeaveTypeController@update');
	Route::delete('/employee/leave/type/{id}', 'Configuration\Employee\LeaveTypeController@destroy');

	Route::get('/employee/attendance/type', 'Configuration\Employee\AttendanceTypeController@index');
	Route::get('/employee/attendance/type/{id}', 'Configuration\Employee\AttendanceTypeController@show');
	Route::post('/employee/attendance/type', 'Configuration\Employee\AttendanceTypeController@store');
	Route::post('/employee/attendance/type/print', 'Configuration\Employee\AttendanceTypeController@print');
	Route::post('/employee/attendance/type/pdf', 'Configuration\Employee\AttendanceTypeController@pdf');
	Route::patch('/employee/attendance/type/{id}', 'Configuration\Employee\AttendanceTypeController@update');
	Route::delete('/employee/attendance/type/{id}', 'Configuration\Employee\AttendanceTypeController@destroy');

	Route::get('/employee/pay/head', 'Configuration\Employee\PayHeadController@index');
	Route::get('/employee/pay/head/{id}', 'Configuration\Employee\PayHeadController@show');
	Route::post('/employee/pay/head', 'Configuration\Employee\PayHeadController@store');
	Route::post('/employee/pay/head/print', 'Configuration\Employee\PayHeadController@print');
	Route::post('/employee/pay/head/pdf', 'Configuration\Employee\PayHeadController@pdf');
	Route::patch('/employee/pay/head/{id}', 'Configuration\Employee\PayHeadController@update');
	Route::delete('/employee/pay/head/{id}', 'Configuration\Employee\PayHeadController@destroy');

	Route::get('/employee/category', 'Configuration\Employee\EmployeeCategoryController@index');
	Route::get('/employee/category/{id}', 'Configuration\Employee\EmployeeCategoryController@show');
	Route::post('/employee/category', 'Configuration\Employee\EmployeeCategoryController@store');
	Route::post('/employee/category/print', 'Configuration\Employee\EmployeeCategoryController@print');
	Route::post('/employee/category/pdf', 'Configuration\Employee\EmployeeCategoryController@pdf');
	Route::patch('/employee/category/{id}', 'Configuration\Employee\EmployeeCategoryController@update');
	Route::delete('/employee/category/{id}', 'Configuration\Employee\EmployeeCategoryController@destroy');

	Route::get('/employee/department', 'Configuration\Employee\DepartmentController@index');
	Route::get('/employee/department/{id}', 'Configuration\Employee\DepartmentController@show');
	Route::post('/employee/department', 'Configuration\Employee\DepartmentController@store');
	Route::post('/employee/department/print', 'Configuration\Employee\DepartmentController@print');
	Route::post('/employee/department/pdf', 'Configuration\Employee\DepartmentController@pdf');
	Route::patch('/employee/department/{id}', 'Configuration\Employee\DepartmentController@update');
	Route::delete('/employee/department/{id}', 'Configuration\Employee\DepartmentController@destroy');

	Route::get('/employee/designation/pre-requisite', 'Configuration\Employee\DesignationController@preRequisite');
	Route::get('/employee/designation', 'Configuration\Employee\DesignationController@index');
	Route::get('/employee/designation/{id}', 'Configuration\Employee\DesignationController@show');
	Route::post('/employee/designation', 'Configuration\Employee\DesignationController@store');
	Route::post('/employee/designation/print', 'Configuration\Employee\DesignationController@print');
	Route::post('/employee/designation/pdf', 'Configuration\Employee\DesignationController@pdf');
	Route::patch('/employee/designation/{id}', 'Configuration\Employee\DesignationController@update');
	Route::delete('/employee/designation/{id}', 'Configuration\Employee\DesignationController@destroy');

	Route::get('/transport/vehicle/document/type', 'Configuration\Transport\Vehicle\VehicleDocumentTypeController@index');
	Route::get('/transport/vehicle/document/type/{id}', 'Configuration\Transport\Vehicle\VehicleDocumentTypeController@show');
	Route::post('/transport/vehicle/document/type', 'Configuration\Transport\Vehicle\VehicleDocumentTypeController@store');
	Route::post('/transport/vehicle/document/type/print', 'Configuration\Transport\Vehicle\VehicleDocumentTypeController@print');
	Route::post('/transport/vehicle/document/type/pdf', 'Configuration\Transport\Vehicle\VehicleDocumentTypeController@pdf');
	Route::patch('/transport/vehicle/document/type/{id}', 'Configuration\Transport\Vehicle\VehicleDocumentTypeController@update');
	Route::delete('/transport/vehicle/document/type/{id}', 'Configuration\Transport\Vehicle\VehicleDocumentTypeController@destroy');

	Route::get('/transport/vehicle/fuel/type', 'Configuration\Transport\Vehicle\VehicleFuelTypeController@index');
	Route::get('/transport/vehicle/fuel/type/{id}', 'Configuration\Transport\Vehicle\VehicleFuelTypeController@show');
	Route::post('/transport/vehicle/fuel/type', 'Configuration\Transport\Vehicle\VehicleFuelTypeController@store');
	Route::post('/transport/vehicle/fuel/type/print', 'Configuration\Transport\Vehicle\VehicleFuelTypeController@print');
	Route::post('/transport/vehicle/fuel/type/pdf', 'Configuration\Transport\Vehicle\VehicleFuelTypeController@pdf');
	Route::patch('/transport/vehicle/fuel/type/{id}', 'Configuration\Transport\Vehicle\VehicleFuelTypeController@update');
	Route::delete('/transport/vehicle/fuel/type/{id}', 'Configuration\Transport\Vehicle\VehicleFuelTypeController@destroy');

	Route::get('/transport/vehicle/service/center', 'Configuration\Transport\Vehicle\VehicleServiceCenterController@index');
	Route::get('/transport/vehicle/service/center/{id}', 'Configuration\Transport\Vehicle\VehicleServiceCenterController@show');
	Route::post('/transport/vehicle/service/center', 'Configuration\Transport\Vehicle\VehicleServiceCenterController@store');
	Route::post('/transport/vehicle/service/center/print', 'Configuration\Transport\Vehicle\VehicleServiceCenterController@print');
	Route::post('/transport/vehicle/service/center/pdf', 'Configuration\Transport\Vehicle\VehicleServiceCenterController@pdf');
	Route::patch('/transport/vehicle/service/center/{id}', 'Configuration\Transport\Vehicle\VehicleServiceCenterController@update');
	Route::delete('/transport/vehicle/service/center/{id}', 'Configuration\Transport\Vehicle\VehicleServiceCenterController@destroy');

	Route::get('/finance/transaction/category', 'Configuration\Finance\Transaction\TransactionCategoryController@index');
	Route::get('/finance/transaction/category/{id}', 'Configuration\Finance\Transaction\TransactionCategoryController@show');
	Route::post('/finance/transaction/category', 'Configuration\Finance\Transaction\TransactionCategoryController@store');
	Route::post('/finance/transaction/category/print', 'Configuration\Finance\Transaction\TransactionCategoryController@print');
	Route::post('/finance/transaction/category/pdf', 'Configuration\Finance\Transaction\TransactionCategoryController@pdf');
	Route::patch('/finance/transaction/category/{id}', 'Configuration\Finance\Transaction\TransactionCategoryController@update');
	Route::delete('/finance/transaction/category/{id}', 'Configuration\Finance\Transaction\TransactionCategoryController@destroy');

	Route::get('/finance/payment/method', 'Configuration\Finance\Transaction\PaymentMethodController@index');
	Route::get('/finance/payment/method/{id}', 'Configuration\Finance\Transaction\PaymentMethodController@show');
	Route::post('/finance/payment/method', 'Configuration\Finance\Transaction\PaymentMethodController@store');
	Route::post('/finance/payment/method/print', 'Configuration\Finance\Transaction\PaymentMethodController@print');
	Route::post('/finance/payment/method/pdf', 'Configuration\Finance\Transaction\PaymentMethodController@pdf');
	Route::patch('/finance/payment/method/{id}', 'Configuration\Finance\Transaction\PaymentMethodController@update');
	Route::delete('/finance/payment/method/{id}', 'Configuration\Finance\Transaction\PaymentMethodController@destroy');

	Route::get('/library/book/author', 'Configuration\Library\BookAuthorController@index');
	Route::get('/library/book/author/{id}', 'Configuration\Library\BookAuthorController@show');
	Route::post('/library/book/author', 'Configuration\Library\BookAuthorController@store');
	Route::post('/library/book/author/print', 'Configuration\Library\BookAuthorController@print');
	Route::post('/library/book/author/pdf', 'Configuration\Library\BookAuthorController@pdf');
	Route::patch('/library/book/author/{id}', 'Configuration\Library\BookAuthorController@update');
	Route::delete('/library/book/author/{id}', 'Configuration\Library\BookAuthorController@destroy');

	Route::get('/library/book/language', 'Configuration\Library\BookLanguageController@index');
	Route::get('/library/book/language/{id}', 'Configuration\Library\BookLanguageController@show');
	Route::post('/library/book/language', 'Configuration\Library\BookLanguageController@store');
	Route::post('/library/book/language/print', 'Configuration\Library\BookLanguageController@print');
	Route::post('/library/book/language/pdf', 'Configuration\Library\BookLanguageController@pdf');
	Route::patch('/library/book/language/{id}', 'Configuration\Library\BookLanguageController@update');
	Route::delete('/library/book/language/{id}', 'Configuration\Library\BookLanguageController@destroy');

	Route::get('/library/book/publisher', 'Configuration\Library\BookPublisherController@index');
	Route::get('/library/book/publisher/{id}', 'Configuration\Library\BookPublisherController@show');
	Route::post('/library/book/publisher', 'Configuration\Library\BookPublisherController@store');
	Route::post('/library/book/publisher/print', 'Configuration\Library\BookPublisherController@print');
	Route::post('/library/book/publisher/pdf', 'Configuration\Library\BookPublisherController@pdf');
	Route::patch('/library/book/publisher/{id}', 'Configuration\Library\BookPublisherController@update');
	Route::delete('/library/book/publisher/{id}', 'Configuration\Library\BookPublisherController@destroy');

	Route::get('/library/book/topic', 'Configuration\Library\BookTopicController@index');
	Route::get('/library/book/topic/{id}', 'Configuration\Library\BookTopicController@show');
	Route::post('/library/book/topic', 'Configuration\Library\BookTopicController@store');
	Route::post('/library/book/topic/print', 'Configuration\Library\BookTopicController@print');
	Route::post('/library/book/topic/pdf', 'Configuration\Library\BookTopicController@pdf');
	Route::patch('/library/book/topic/{id}', 'Configuration\Library\BookTopicController@update');
	Route::delete('/library/book/topic/{id}', 'Configuration\Library\BookTopicController@destroy');

	Route::get('/library/book/condition', 'Configuration\Library\BookConditionController@index');
	Route::get('/library/book/condition/{id}', 'Configuration\Library\BookConditionController@show');
	Route::post('/library/book/condition', 'Configuration\Library\BookConditionController@store');
	Route::post('/library/book/condition/print', 'Configuration\Library\BookConditionController@print');
	Route::post('/library/book/condition/pdf', 'Configuration\Library\BookConditionController@pdf');
	Route::patch('/library/book/condition/{id}', 'Configuration\Library\BookConditionController@update');
	Route::delete('/library/book/condition/{id}', 'Configuration\Library\BookConditionController@destroy');

	Route::get('/calendar/event/type', 'Configuration\Calendar\EventTypeController@index');
	Route::get('/calendar/event/type/{id}', 'Configuration\Calendar\EventTypeController@show');
	Route::post('/calendar/event/type', 'Configuration\Calendar\EventTypeController@store');
	Route::post('/calendar/event/type/print', 'Configuration\Calendar\EventTypeController@print');
	Route::post('/calendar/event/type/pdf', 'Configuration\Calendar\EventTypeController@pdf');
	Route::patch('/calendar/event/type/{id}', 'Configuration\Calendar\EventTypeController@update');
	Route::delete('/calendar/event/type/{id}', 'Configuration\Calendar\EventTypeController@destroy');

	Route::get('/post/article/type', 'Configuration\Post\ArticleTypeController@index');
	Route::get('/post/article/type/{id}', 'Configuration\Post\ArticleTypeController@show');
	Route::post('/post/article/type', 'Configuration\Post\ArticleTypeController@store');
	Route::post('/post/article/type/print', 'Configuration\Post\ArticleTypeController@print');
	Route::post('/post/article/type/pdf', 'Configuration\Post\ArticleTypeController@pdf');
	Route::patch('/post/article/type/{id}', 'Configuration\Post\ArticleTypeController@update');
	Route::delete('/post/article/type/{id}', 'Configuration\Post\ArticleTypeController@destroy');

	Route::get('/reception/enquiry/type', 'Configuration\Reception\EnquiryTypeController@index');
	Route::get('/reception/enquiry/type/{id}', 'Configuration\Reception\EnquiryTypeController@show');
	Route::post('/reception/enquiry/type', 'Configuration\Reception\EnquiryTypeController@store');
	Route::post('/reception/enquiry/type/print', 'Configuration\Reception\EnquiryTypeController@print');
	Route::post('/reception/enquiry/type/pdf', 'Configuration\Reception\EnquiryTypeController@pdf');
	Route::patch('/reception/enquiry/type/{id}', 'Configuration\Reception\EnquiryTypeController@update');
	Route::delete('/reception/enquiry/type/{id}', 'Configuration\Reception\EnquiryTypeController@destroy');

	Route::get('/reception/complaint/type', 'Configuration\Reception\ComplaintTypeController@index');
	Route::get('/reception/complaint/type/{id}', 'Configuration\Reception\ComplaintTypeController@show');
	Route::post('/reception/complaint/type', 'Configuration\Reception\ComplaintTypeController@store');
	Route::post('/reception/complaint/type/print', 'Configuration\Reception\ComplaintTypeController@print');
	Route::post('/reception/complaint/type/pdf', 'Configuration\Reception\ComplaintTypeController@pdf');
	Route::patch('/reception/complaint/type/{id}', 'Configuration\Reception\ComplaintTypeController@update');
	Route::delete('/reception/complaint/type/{id}', 'Configuration\Reception\ComplaintTypeController@destroy');

	Route::get('/reception/enquiry/source', 'Configuration\Reception\EnquirySourceController@index');
	Route::get('/reception/enquiry/source/{id}', 'Configuration\Reception\EnquirySourceController@show');
	Route::post('/reception/enquiry/source', 'Configuration\Reception\EnquirySourceController@store');
	Route::post('/reception/enquiry/source/print', 'Configuration\Reception\EnquirySourceController@print');
	Route::post('/reception/enquiry/source/pdf', 'Configuration\Reception\EnquirySourceController@pdf');
	Route::patch('/reception/enquiry/source/{id}', 'Configuration\Reception\EnquirySourceController@update');
	Route::delete('/reception/enquiry/source/{id}', 'Configuration\Reception\EnquirySourceController@destroy');

	Route::get('/reception/visiting/purpose', 'Configuration\Reception\VisitingPurposeController@index');
	Route::get('/reception/visiting/purpose/{id}', 'Configuration\Reception\VisitingPurposeController@show');
	Route::post('/reception/visiting/purpose', 'Configuration\Reception\VisitingPurposeController@store');
	Route::post('/reception/visiting/purpose/print', 'Configuration\Reception\VisitingPurposeController@print');
	Route::post('/reception/visiting/purpose/pdf', 'Configuration\Reception\VisitingPurposeController@pdf');
	Route::patch('/reception/visiting/purpose/{id}', 'Configuration\Reception\VisitingPurposeController@update');
	Route::delete('/reception/visiting/purpose/{id}', 'Configuration\Reception\VisitingPurposeController@destroy');

	Route::get('/reception/calling/purpose', 'Configuration\Reception\CallingPurposeController@index');
	Route::get('/reception/calling/purpose/{id}', 'Configuration\Reception\CallingPurposeController@show');
	Route::post('/reception/calling/purpose', 'Configuration\Reception\CallingPurposeController@store');
	Route::post('/reception/calling/purpose/print', 'Configuration\Reception\CallingPurposeController@print');
	Route::post('/reception/calling/purpose/pdf', 'Configuration\Reception\CallingPurposeController@pdf');
	Route::patch('/reception/calling/purpose/{id}', 'Configuration\Reception\CallingPurposeController@update');
	Route::delete('/reception/calling/purpose/{id}', 'Configuration\Reception\CallingPurposeController@destroy');

	Route::get('/exam/term/pre-requisite', 'Configuration\Exam\TermController@preRequisite');
	Route::get('/exam/term', 'Configuration\Exam\TermController@index');
	Route::get('/exam/term/{id}', 'Configuration\Exam\TermController@show');
	Route::post('/exam/term', 'Configuration\Exam\TermController@store');
	Route::post('/exam/term/reorder', 'Configuration\Exam\TermController@reorder');
	Route::post('/exam/term/print', 'Configuration\Exam\TermController@print');
	Route::post('/exam/term/pdf', 'Configuration\Exam\TermController@pdf');
	Route::patch('/exam/term/{id}', 'Configuration\Exam\TermController@update');
	Route::delete('/exam/term/{id}', 'Configuration\Exam\TermController@destroy');

	Route::get('/exam/assessment', 'Configuration\Exam\AssessmentController@index');
	Route::get('/exam/assessment/{id}', 'Configuration\Exam\AssessmentController@show');
	Route::post('/exam/assessment', 'Configuration\Exam\AssessmentController@store');
	Route::post('/exam/assessment/print', 'Configuration\Exam\AssessmentController@print');
	Route::post('/exam/assessment/pdf', 'Configuration\Exam\AssessmentController@pdf');
	Route::post('/exam/assessment/{id}/reorder', 'Configuration\Exam\AssessmentController@reorder');
	Route::patch('/exam/assessment/{id}', 'Configuration\Exam\AssessmentController@update');
	Route::delete('/exam/assessment/{id}', 'Configuration\Exam\AssessmentController@destroy');

	Route::get('/exam/observation', 'Configuration\Exam\ObservationController@index');
	Route::get('/exam/observation/{id}', 'Configuration\Exam\ObservationController@show');
	Route::post('/exam/observation', 'Configuration\Exam\ObservationController@store');
	Route::post('/exam/observation/print', 'Configuration\Exam\ObservationController@print');
	Route::post('/exam/observation/pdf', 'Configuration\Exam\ObservationController@pdf');
	Route::post('/exam/observation/{id}/reorder', 'Configuration\Exam\ObservationController@reorder');
	Route::patch('/exam/observation/{id}', 'Configuration\Exam\ObservationController@update');
	Route::delete('/exam/observation/{id}', 'Configuration\Exam\ObservationController@destroy');

	Route::get('/exam/observation/assign/pre-requisite', 'Configuration\Exam\ObservationRecordController@preRequisite');
	Route::get('/exam/observation/assign', 'Configuration\Exam\ObservationRecordController@index');
	Route::get('/exam/observation/assign/{id}', 'Configuration\Exam\ObservationRecordController@show');
	Route::post('/exam/observation/assign', 'Configuration\Exam\ObservationRecordController@store');
	Route::post('/exam/observation/assign/print', 'Configuration\Exam\ObservationRecordController@print');
	Route::post('/exam/observation/assign/pdf', 'Configuration\Exam\ObservationRecordController@pdf');
	Route::patch('/exam/observation/assign/{id}', 'Configuration\Exam\ObservationRecordController@update');
	Route::delete('/exam/observation/assign/{id}', 'Configuration\Exam\ObservationRecordController@destroy');

	Route::get('/exam/grade', 'Configuration\Exam\GradeController@index');
	Route::get('/exam/grade/{id}', 'Configuration\Exam\GradeController@show');
	Route::post('/exam/grade', 'Configuration\Exam\GradeController@store');
	Route::post('/exam/grade/print', 'Configuration\Exam\GradeController@print');
	Route::post('/exam/grade/pdf', 'Configuration\Exam\GradeController@pdf');
	Route::patch('/exam/grade/{id}', 'Configuration\Exam\GradeController@update');
	Route::delete('/exam/grade/{id}', 'Configuration\Exam\GradeController@destroy');
	/*
		     * Misc Routes End
	*/

	/*
		     * Academic Routes Start
	*/
	Route::get('/academic/session/pre-requisite', 'Academic\AcademicSessionController@preRequisite');
	Route::get('/academic/session', 'Academic\AcademicSessionController@index');
	Route::get('/academic/session/{id}', 'Academic\AcademicSessionController@show');
	Route::post('/academic/session', 'Academic\AcademicSessionController@store');
	Route::post('/academic/session/print', 'Academic\AcademicSessionController@print');
	Route::post('/academic/session/pdf', 'Academic\AcademicSessionController@pdf');
	Route::post('/academic/session/import', 'Academic\AcademicSessionController@import');
	Route::post('/academic/session/{id}/user/default', 'Academic\AcademicSessionController@userDefault');
	Route::patch('/academic/session/{id}', 'Academic\AcademicSessionController@update');
	Route::delete('/academic/session/{id}', 'Academic\AcademicSessionController@destroy');

	Route::get('/course/pre-requisite', 'Academic\CourseController@preRequisite');
	Route::get('/course', 'Academic\CourseController@index');
	Route::get('/course/{id}', 'Academic\CourseController@show');
	Route::post('/course', 'Academic\CourseController@store');
	Route::post('/course/reorder', 'Academic\CourseController@reorder');
	Route::post('/course/{id}/batch/reorder', 'Academic\CourseController@batchReorder');
	Route::post('/course/print', 'Academic\CourseController@print');
	Route::post('/course/pdf', 'Academic\CourseController@pdf');
	Route::patch('/course/{id}', 'Academic\CourseController@update');
	Route::delete('/course/{id}', 'Academic\CourseController@destroy');

	Route::get('/batch/pre-requisite', 'Academic\BatchController@preRequisite');
	Route::get('/batch', 'Academic\BatchController@index');
	Route::get('/batch/{id}', 'Academic\BatchController@show');
	Route::post('/batch', 'Academic\BatchController@store');
	Route::post('/batch/print', 'Academic\BatchController@print');
	Route::post('/batch/pdf', 'Academic\BatchController@pdf');
	Route::patch('/batch/{id}', 'Academic\BatchController@update');
	Route::post('/batch/{id}/subject/reorder', 'Academic\BatchController@subjectReorder');
	Route::post('/batch/{id}/strength', 'Academic\BatchController@fetchStrength');
	Route::post('/batch/{id}/subjects', 'Academic\BatchController@fetchSubjects');
	Route::delete('/batch/{id}', 'Academic\BatchController@destroy');

	Route::get('/subject/teacher', 'Academic\SubjectTeacherController@index');
	Route::post('/subject/teacher', 'Academic\SubjectTeacherController@store');
	Route::post('/subject/teacher/print', 'Academic\SubjectTeacherController@print');
	Route::post('/subject/teacher/pdf', 'Academic\SubjectTeacherController@pdf');
	Route::post('/subject/teacher/{batch_id}', 'Academic\SubjectTeacherController@getSubjects');
	Route::delete('/subject/teacher/{id}', 'Academic\SubjectTeacherController@destroy');

	Route::get('/subject/pre-requisite', 'Academic\SubjectController@preRequisite');
	Route::get('/subject', 'Academic\SubjectController@index');
	Route::get('/subject/{id}', 'Academic\SubjectController@show');
	Route::post('/subject', 'Academic\SubjectController@store');
	Route::post('/subject/print', 'Academic\SubjectController@print');
	Route::post('/subject/pdf', 'Academic\SubjectController@pdf');
	Route::post('/subject/{batch_id}/copy', 'Academic\SubjectController@copy');
	Route::patch('/subject/{id}', 'Academic\SubjectController@update');
	Route::delete('/subject/{id}', 'Academic\SubjectController@destroy');
	Route::delete('/subject/{batch_id}/delete', 'Academic\SubjectController@destroyBatch');

	Route::get('/certificate/pre-requisite', 'Academic\CertificateController@preRequisite');
	Route::get('/certificate', 'Academic\CertificateController@index');
	Route::get('/certificate/{uuid}', 'Academic\CertificateController@show');
	Route::post('/certificate', 'Academic\CertificateController@store');
	Route::post('/certificate/print', 'Academic\CertificateController@print');
	Route::post('/certificate/pdf', 'Academic\CertificateController@pdf');
	Route::patch('/certificate/{uuid}', 'Academic\CertificateController@update');
	Route::delete('/certificate/{uuid}', 'Academic\CertificateController@destroy');

	Route::get('/class-teacher', 'Academic\ClassTeacherController@list');
	Route::get('/class/teacher', 'Academic\ClassTeacherController@index');
	Route::post('/class/teacher', 'Academic\ClassTeacherController@store');
	Route::post('/class/teacher/print', 'Academic\ClassTeacherController@print');
	Route::post('/class/teacher/pdf', 'Academic\ClassTeacherController@pdf');
	Route::delete('/class/teacher/{id}', 'Academic\ClassTeacherController@destroy');

	Route::get('/class/timing', 'Academic\ClassTimingController@index');
	Route::get('/class/timing/{uuid}', 'Academic\ClassTimingController@show');
	Route::post('/class/timing', 'Academic\ClassTimingController@store');
	Route::post('/class/timing/print', 'Academic\ClassTimingController@print');
	Route::post('/class/timing/pdf', 'Academic\ClassTimingController@pdf');
	Route::patch('/class/timing/{uuid}', 'Academic\ClassTimingController@update');
	Route::delete('/class/timing/{uuid}', 'Academic\ClassTimingController@destroy');

	Route::get('/timetable/pre-requisite', 'Academic\TimetableController@preRequisite');
	Route::get('/timetable', 'Academic\TimetableController@index');
	Route::get('/timetable/{uuid}', 'Academic\TimetableController@show');
	Route::post('/timetable', 'Academic\TimetableController@store');
	Route::post('/timetable/print', 'Academic\TimetableController@print');
	Route::post('/timetable/print/batch', 'Academic\TimetableController@printBatchTimetable');
	Route::post('/timetable/print/selected', 'Academic\TimetableController@printSelectedBatchTimetable');
	Route::post('/timetable/pdf', 'Academic\TimetableController@pdf');
	Route::post('/timetable/pdf/batch', 'Academic\TimetableController@pdfBatchTimetable');
	Route::post('/timetable/pdf/selected', 'Academic\TimetableController@pdfSelectedBatchTimetable');
	Route::post('/timetable/{uuid}/allocation', 'Academic\TimetableController@allocation');
	Route::patch('/timetable/{uuid}', 'Academic\TimetableController@update');
	Route::delete('/timetable/{id}', 'Academic\TimetableController@destroy');

	/*
		     * Academic Routes End
	*/

	/*
		     * Finance Routes Start
	*/
	Route::get('/account/transfer/pre-requisite', 'Finance\Transaction\AccountTransferController@preRequisite');
	Route::get('/account/transfer', 'Finance\Transaction\AccountTransferController@index');
	Route::get('/account/transfer/{uuid}', 'Finance\Transaction\AccountTransferController@show');
	Route::post('/account/transfer', 'Finance\Transaction\AccountTransferController@store');
	Route::post('/account/transfer/print', 'Finance\Transaction\AccountTransferController@print');
	Route::post('/account/transfer/pdf', 'Finance\Transaction\AccountTransferController@pdf');
	Route::patch('/account/transfer/{uuid}', 'Finance\Transaction\AccountTransferController@update');
	Route::delete('/account/transfer/{uuid}', 'Finance\Transaction\AccountTransferController@cancel');

	Route::get('/income/pre-requisite', 'Finance\Transaction\IncomeController@preRequisite');
	Route::get('/income', 'Finance\Transaction\IncomeController@index');
	Route::get('/income/{uuid}', 'Finance\Transaction\IncomeController@show');
	Route::post('/income', 'Finance\Transaction\IncomeController@store');
	Route::post('/income/print', 'Finance\Transaction\IncomeController@print');
	Route::post('/income/pdf', 'Finance\Transaction\IncomeController@pdf');
	Route::patch('/income/{uuid}', 'Finance\Transaction\IncomeController@update');
	Route::delete('/income/{uuid}', 'Finance\Transaction\IncomeController@cancel');

	Route::get('/expense/pre-requisite', 'Finance\Transaction\ExpenseController@preRequisite');
	Route::get('/expense', 'Finance\Transaction\ExpenseController@index');
	Route::get('/expense/{uuid}', 'Finance\Transaction\ExpenseController@show');
	Route::post('/expense', 'Finance\Transaction\ExpenseController@store');
	Route::post('/expense/print', 'Finance\Transaction\ExpenseController@print');
	Route::post('/expense/pdf', 'Finance\Transaction\ExpenseController@pdf');
	Route::patch('/expense/{uuid}', 'Finance\Transaction\ExpenseController@update');
	Route::delete('/expense/{uuid}', 'Finance\Transaction\ExpenseController@cancel');

	Route::get('/account', 'Finance\AccountController@index');
	Route::get('/account/{id}', 'Finance\AccountController@show');
	Route::post('/account', 'Finance\AccountController@store');
	Route::post('/account/print', 'Finance\AccountController@print');
	Route::post('/account/pdf', 'Finance\AccountController@pdf');
	Route::patch('/account/{id}', 'Finance\AccountController@update');
	Route::delete('/account/{id}', 'Finance\AccountController@destroy');

	Route::get('/fee/group', 'Finance\Fee\FeeGroupController@index');
	Route::get('/fee/group/{id}', 'Finance\Fee\FeeGroupController@show');
	Route::post('/fee/group', 'Finance\Fee\FeeGroupController@store');
	Route::post('/fee/group/print', 'Finance\Fee\FeeGroupController@print');
	Route::post('/fee/group/pdf', 'Finance\Fee\FeeGroupController@pdf');
	Route::patch('/fee/group/{id}', 'Finance\Fee\FeeGroupController@update');
	Route::delete('/fee/group/{id}', 'Finance\Fee\FeeGroupController@destroy');

	Route::get('/fee/head/pre-requisite', 'Finance\Fee\FeeHeadController@preRequisite');
	Route::get('/fee/head', 'Finance\Fee\FeeHeadController@index');
	Route::get('/fee/head/{id}', 'Finance\Fee\FeeHeadController@show');
	Route::post('/fee/head', 'Finance\Fee\FeeHeadController@store');
	Route::post('/fee/head/print', 'Finance\Fee\FeeHeadController@print');
	Route::post('/fee/head/pdf', 'Finance\Fee\FeeHeadController@pdf');
	Route::patch('/fee/head/{id}', 'Finance\Fee\FeeHeadController@update');
	Route::delete('/fee/head/{id}', 'Finance\Fee\FeeHeadController@destroy');

	Route::get('/fee/allocation/pre-requisite', 'Finance\Fee\FeeAllocationController@preRequisite');
	Route::get('/fee/allocation', 'Finance\Fee\FeeAllocationController@index');
	Route::get('/fee/allocation/{uuid}', 'Finance\Fee\FeeAllocationController@show');
	Route::post('/fee/allocation', 'Finance\Fee\FeeAllocationController@store');
	Route::post('/fee/allocation/print', 'Finance\Fee\FeeAllocationController@print');
	Route::post('/fee/allocation/pdf', 'Finance\Fee\FeeAllocationController@pdf');
	Route::patch('/fee/allocation/{uuid}', 'Finance\Fee\FeeAllocationController@update');
	Route::delete('/fee/allocation/{uuid}', 'Finance\Fee\FeeAllocationController@destroy');

	Route::get('/fee/allocation/show/pre-requisite', 'Finance\Fee\FeeAllocationController@showPreRequisite');
	Route::post('/fee/allocation/{uuid}/print', 'Finance\Fee\FeeAllocationController@printDetail');
	Route::post('/fee/allocation/{uuid}/pdf', 'Finance\Fee\FeeAllocationController@pdfDetail');
	Route::post('/fee/allocation/{uuid}/copy', 'Finance\Fee\FeeAllocationController@copy');

	Route::get('/fee/installment/pre-requisite', 'Finance\Fee\FeeInstallmentController@preRequisite');
	Route::get('/fee/installment/{uuid}', 'Finance\Fee\FeeInstallmentController@show');
	Route::patch('/fee/installment/{uuid}', 'Finance\Fee\FeeInstallmentController@update');

	Route::get('/fee/concession/pre-requisite', 'Finance\Fee\FeeConcessionController@preRequisite');
	Route::get('/fee/concession', 'Finance\Fee\FeeConcessionController@index');
	Route::get('/fee/concession/{id}', 'Finance\Fee\FeeConcessionController@show');
	Route::post('/fee/concession', 'Finance\Fee\FeeConcessionController@store');
	Route::post('/fee/concession/print', 'Finance\Fee\FeeConcessionController@print');
	Route::post('/fee/concession/pdf', 'Finance\Fee\FeeConcessionController@pdf');
	Route::patch('/fee/concession/{id}', 'Finance\Fee\FeeConcessionController@update');
	Route::delete('/fee/concession/{id}', 'Finance\Fee\FeeConcessionController@destroy');
	/*
		     * Finance Routes End
	*/

    /*
             * Student Routes Start
    */
    Route::get('/registration/pre-requisite', 'Student\RegistrationController@preRequisite');
    Route::get('/registration', 'Student\RegistrationController@index');
    Route::get('/registration/{id}', 'Student\RegistrationController@show');
    Route::post('/registration', 'Student\RegistrationController@store');
    Route::post('/registration/print', 'Student\RegistrationController@print');
    Route::post('/registration/pdf', 'Student\RegistrationController@pdf');
    Route::patch('/registration/{id}', 'Student\RegistrationController@update');
    Route::delete('/registration/{id}', 'Student\RegistrationController@destroy');

    Route::get('/registration/status/pre-requisite', 'Student\RegistrationController@statusPreRequisite');
    Route::post('/registration/{id}/update/status', 'Student\RegistrationController@updateStatus');

    Route::get('/registration/fee/pre-requisite', 'Student\RegistrationController@feePreRequisite');
    Route::post('/registration/{id}/fee/payment', 'Student\RegistrationController@feePayment');
    Route::post('/registration/{id}/fee/{transaction_id}/print', 'Student\RegistrationController@printReceipt');
    Route::post('/registration/{id}/transaction/{transaction_id}/cancel', 'Student\RegistrationController@cancelPayment');

    Route::get('/student/parent', 'Student\StudentParentController@index');
    Route::post('/student/parent', 'Student\StudentParentController@store');
    Route::post('/student/parent/print', 'Student\StudentParentController@print');
    Route::post('/student/parent/pdf', 'Student\StudentParentController@pdf');
    Route::get('/student/parent/search', 'Student\StudentParentController@search');
    Route::delete('/student/parent/{id}', 'Student\StudentParentController@destroy');

    Route::get('/student/pre-requisite', 'Student\StudentController@preRequisite');
    Route::post('/student/{id}/parent', 'Student\StudentController@updateParent');

    Route::get('/student/roll/number/pre-requisite', 'Student\StudentRecordController@rollNumberPreRequisite');
    Route::post('/student/roll/number', 'Student\StudentRecordController@storeRollNumber');
    Route::post('/student/fetch', 'Student\StudentRecordController@fetchBatchWiseStudent');
    Route::post('/student/fetch/login', 'Student\StudentRecordController@fetchBatchWiseStudentForLogin');

    Route::get('/student/id-card/pre-requisite', 'Student\StudentRecordController@idCardPreRequisite');

    Route::get('/student/attendance/pre-requisite', 'Student\AttendanceController@preRequisite');
    Route::get('/student/attendance/absentee', 'Student\AttendanceController@getAbsentee');
    Route::post('/student/attendance/absentee', 'Student\AttendanceController@sendSMSToAbsentee');
    Route::post('/student/attendance/absentee/print', 'Student\AttendanceController@printAbsentee');
    Route::post('/student/attendance/absentee/pdf', 'Student\AttendanceController@pdfAbsentee');
    Route::post('/student/attendance', 'Student\AttendanceController@store');
    Route::post('/student/attendance/fetch', 'Student\AttendanceController@fetch');
    Route::post('/student/attendance/delete', 'Student\AttendanceController@destroy');
    Route::post('/student/attendance/default', 'Student\AttendanceController@default');

    Route::post('/student/import/start', 'Student\StudentImportController@startImport');
    Route::post('/student/import/finish', 'Student\StudentImportController@finishImport');

    Route::get('/student/promotion/pre-requisite', 'Student\PromotionController@preRequisite');
    Route::get('/student/promotion', 'Student\PromotionController@index');
    Route::post('/student/promotion', 'Student\PromotionController@store');
    Route::post('/student/promotion/print', 'Student\PromotionController@print');
    Route::post('/student/promotion/pdf', 'Student\PromotionController@pdf');

    Route::get('/student/terminated', 'Student\TerminationController@index');
    Route::post('/student/terminated/print', 'Student\TerminationController@print');
    Route::post('/student/terminated/pdf', 'Student\TerminationController@pdf');
    Route::post('/student/{uuid}/terminate/{record_id}', 'Student\TerminationController@terminate');
    Route::get('/student/{uuid}/terminate/{record_id}/attachment', 'Student\TerminationController@terminateAttachment');

    Route::get('/student/{uuid}/transfer-certificate/{record_id}', 'Student\TerminationController@getTransferCertificate');
    Route::post('/student/{uuid}/transfer-certificate/{record_id}/print', 'Student\TerminationController@printTransferCertificate');
    Route::post('/student/{uuid}/transfer-certificate/{record_id}', 'Student\TerminationController@transferCertificate');

    Route::get('/student', 'Student\StudentController@index');
    Route::get('/student/{uuid}', 'Student\StudentController@show');
    Route::get('/student/{uuid}/sibling', 'Student\StudentController@sibling');
    Route::get('/student/search/name', 'Student\StudentController@searchByName');
    Route::get('/student/search/registration', 'Student\StudentController@searchForRegistration');
    Route::post('/student/print', 'Student\StudentController@print');
    Route::post('/student/pdf', 'Student\StudentController@pdf');
    Route::post('/student/action/group', 'Student\StudentController@groupAction');
    Route::patch('/student/{uuid}', 'Student\StudentController@update');
    Route::patch('/student/{uuid}/user/login', 'Student\StudentController@updateUserLogin');

    Route::get('/student/fee/pre-requisite', 'Student\StudentRecordController@feePreRequisite');
    Route::get('/student/record/pre-requisite', 'Student\StudentRecordController@recordPreRequisite');
    Route::patch('/student/{uuid}/record/{record_id}', 'Student\StudentRecordController@updateRecord');
    Route::get('/student/{uuid}/record/{record_id}', 'Student\StudentRecordController@index');
    Route::post('/student/{uuid}/fee/{record_id}', 'Student\StudentRecordController@store');
    Route::get('/student/{uuid}/fee/{record_id}', 'Student\StudentRecordController@fee');
    Route::get('/student/{uuid}/fee/{record_id}/detail', 'Student\StudentRecordController@feeDetail');
    Route::get('/student/{uuid}/fee/{record_id}/{fee_record_id}', 'Student\StudentRecordController@getPaymentDetail');
    Route::post('/student/{uuid}/payment/{record_id}', 'Student\StudentRecordController@makePayment');
    Route::post('/student/{uuid}/payment/{record_id}/rzp', 'Student\StudentFeePaymentController@razorpayPayment');
    Route::post('/student/{uuid}/payment/{record_id}/paystack', 'Student\StudentFeePaymentController@paystackPayment');
    Route::post('/student/{uuid}/payment/{record_id}/stripe', 'Student\StudentFeePaymentController@stripePayment');
    Route::post('/student/{uuid}/payment/{record_id}/paypal', 'Student\StudentFeePaymentController@paypalPayment');
    Route::post('/student/{uuid}/payment/{record_id}/billdesk', 'Student\StudentFeePaymentController@billdeskPayment');

    Route::post('/student/{uuid}/fee/{record_id}/{fee_record_id}/cancel', 'Student\StudentRecordController@cancelEmptyPayment');
    Route::post('/student/{uuid}/fee/{record_id}/{fee_record_id}/{transaction_id}/cancel', 'Student\StudentRecordController@cancelPayment');
    Route::post('/student/{uuid}/fee/{record_id}/{fee_record_id}/{transaction_id}/print', 'Student\StudentRecordController@printReceipt');
    Route::post('/student/{uuid}/fee/{record_id}/print', 'Student\StudentRecordController@print');
    Route::post('/student/{uuid}/fee/{record_id}/pdf', 'Student\StudentRecordController@pdf');
    Route::patch('/student/{uuid}/fee/{record_id}', 'Student\StudentRecordController@setFee');
    Route::patch('/student/{uuid}/fee/{record_id}/reset', 'Student\StudentRecordController@resetFee');

    Route::get('/student/{uuid}/record/{record_id}/attendance', 'Student\AttendanceController@studentMonthlyReport');
    Route::get('/student/{uuid}/record/{record_id}/exam', 'Exam\ReportController@studentExamReport');

    Route::get('/student/{uuid}/document/pre-requisite', 'Student\StudentDocumentController@preRequisite');
    Route::get('/student/{uuid}/document', 'Student\StudentDocumentController@index');
    Route::get('/student/{uuid}/document/{id}', 'Student\StudentDocumentController@show');
    Route::post('/student/{uuid}/document', 'Student\StudentDocumentController@store');
    Route::patch('/student/{uuid}/document/{id}', 'Student\StudentDocumentController@update');
    Route::delete('/student/{uuid}/document/{id}', 'Student\StudentDocumentController@destroy');

    Route::get('/student/{uuid}/account', 'Student\StudentAccountController@index');
    Route::get('/student/{uuid}/account/{id}', 'Student\StudentAccountController@show');
    Route::post('/student/{uuid}/account', 'Student\StudentAccountController@store');
    Route::patch('/student/{uuid}/account/{id}', 'Student\StudentAccountController@update');
    Route::delete('/student/{uuid}/account/{id}', 'Student\StudentAccountController@destroy');

    Route::get('/student/{uuid}/qualification', 'Student\StudentQualificationController@index');
    Route::get('/student/{uuid}/qualification/{id}', 'Student\StudentQualificationController@show');
    Route::post('/student/{uuid}/qualification', 'Student\StudentQualificationController@store');
    Route::patch('/student/{uuid}/qualification/{id}', 'Student\StudentQualificationController@update');
    Route::delete('/student/{uuid}/qualification/{id}', 'Student\StudentQualificationController@destroy');

    Route::post('/student/{type}/photo/{uuid}', 'Student\StudentController@uploadPhoto');
    Route::delete('/student/{type}/photo/remove/{uuid}', 'Student\StudentController@removePhoto');
    /*
             * Student Routes End
    */

	/*
		     * Exam Routes Start
	*/
	Route::get('/exam/schedule/pre-requisite', 'Exam\ScheduleController@preRequisite');
	Route::get('/exam/schedule', 'Exam\ScheduleController@index');
	Route::get('/exam/schedule/{id}', 'Exam\ScheduleController@show');
	Route::post('/exam/schedule', 'Exam\ScheduleController@store');
	Route::post('/exam/schedule/print', 'Exam\ScheduleController@print');
	Route::post('/exam/schedule/pdf', 'Exam\ScheduleController@pdf');
	Route::patch('/exam/schedule/{id}', 'Exam\ScheduleController@update');
	Route::delete('/exam/schedule/{id}', 'Exam\ScheduleController@destroy');

	Route::get('/exam/record/pre-requisite', 'Exam\RecordController@preRequisite');
	Route::post('/exam/record/student', 'Exam\RecordController@getStudents');
	Route::post('/exam/record', 'Exam\RecordController@store');
	Route::post('/exam/record/delete', 'Exam\RecordController@destroy');

	Route::get('/exam/record/observation/pre-requisite', 'Exam\RecordController@observationPreRequisite');
	Route::post('/exam/record/observation/student', 'Exam\RecordController@getStudentsForObservationRecord');
	Route::post('/exam/record/observation', 'Exam\RecordController@storeObservation');
	Route::post('/exam/record/observation/delete', 'Exam\RecordController@destroyObservation');

	Route::get('/exam/report/pre-requisite', 'Exam\ReportController@preRequisite');
	Route::post('/exam/report/student', 'Exam\ReportController@getStudents');
	Route::post('/exam/report', 'Exam\ReportController@getReport');
	Route::post('/exam/report/pdf', 'Exam\ReportController@getPDFReport');
	Route::post('/exam/report/topper', 'Exam\ReportController@topperReport');
	Route::post('/exam/report/exam-wise', 'Exam\ReportController@examWiseReport');
    Route::post('/exam/report/term-wise', 'Exam\ReportController@termWiseReport');
    Route::post('/exam/report-card/{batch_id}/print', 'Exam\ReportController@printReportCard');

	Route::get('/exam/pre-requisite', 'Exam\ExamController@preRequisite');
	Route::get('/exam', 'Exam\ExamController@index');
	Route::get('/exam/{id}', 'Exam\ExamController@show');
	Route::post('/exam', 'Exam\ExamController@store');
	Route::post('/exam/print', 'Exam\ExamController@print');
	Route::post('/exam/pdf', 'Exam\ExamController@pdf');
	Route::post('/exam/reorder', 'Exam\ExamController@reorder');
	Route::patch('/exam/{id}', 'Exam\ExamController@update');
	Route::delete('/exam/{id}', 'Exam\ExamController@destroy');

	Route::get('/online-exam/pre-requisite', 'Exam\OnlineExamController@preRequisite');
	Route::get('/online-exam', 'Exam\OnlineExamController@index');
	Route::get('/online-exam/{uuid}', 'Exam\OnlineExamController@show');
	Route::get('/online-exam/{uuid}/exam', 'Exam\OnlineExamController@exam');
	Route::post('/online-exam/{uuid}/exam', 'Exam\OnlineExamController@storeExam');
	Route::get('/online-exam/{uuid}/exam/{id}', 'Exam\OnlineExamController@getExam');
	Route::post('/online-exam', 'Exam\OnlineExamController@store');
	Route::post('/online-exam/{uuid}/question', 'Exam\OnlineExamController@addQuestion');
	Route::post('/online-exam/{uuid}/status', 'Exam\OnlineExamController@toggleStatus');
	Route::patch('/online-exam/{uuid}/question/{id}', 'Exam\OnlineExamController@updateQuestion');
	Route::delete('/online-exam/{uuid}/question/{id}', 'Exam\OnlineExamController@deleteQuestion');
	Route::post('/online-exam/print', 'Exam\OnlineExamController@print');
	Route::post('/online-exam/pdf', 'Exam\OnlineExamController@pdf');
	Route::patch('/online-exam/{uuid}', 'Exam\OnlineExamController@update');
	Route::delete('/online-exam/{uuid}', 'Exam\OnlineExamController@destroy');
	Route::post('/online-exam/question/image', 'Exam\OnlineExamController@uploadQuestionImage');
	Route::delete('/online-exam/question/image', 'Exam\OnlineExamController@removeQuestionImage');
	/*
		     * Exam Routes End
	*/

	/*
		     * Transport Routes Start
	*/
	Route::get('/transport/circle', 'Transport\TransportCircleController@index');
	Route::get('/transport/circle/{id}', 'Transport\TransportCircleController@show');
	Route::post('/transport/circle', 'Transport\TransportCircleController@store');
	Route::post('/transport/circle/print', 'Transport\TransportCircleController@print');
	Route::post('/transport/circle/pdf', 'Transport\TransportCircleController@pdf');
	Route::patch('/transport/circle/{id}', 'Transport\TransportCircleController@update');
	Route::delete('/transport/circle/{id}', 'Transport\TransportCircleController@destroy');

	Route::get('/transport/fee/pre-requisite', 'Transport\TransportFeeController@preRequisite');
	Route::get('/transport/fee', 'Transport\TransportFeeController@index');
	Route::get('/transport/fee/{id}', 'Transport\TransportFeeController@show');
	Route::post('/transport/fee', 'Transport\TransportFeeController@store');
	Route::post('/transport/fee/print', 'Transport\TransportFeeController@print');
	Route::post('/transport/fee/pdf', 'Transport\TransportFeeController@pdf');
	Route::patch('/transport/fee/{id}', 'Transport\TransportFeeController@update');
	Route::delete('/transport/fee/{id}', 'Transport\TransportFeeController@destroy');

	Route::get('/transport/stoppage', 'Transport\TransportStoppageController@index');
	Route::get('/transport/stoppage/{id}', 'Transport\TransportStoppageController@show');
	Route::post('/transport/stoppage', 'Transport\TransportStoppageController@store');
	Route::post('/transport/stoppage/print', 'Transport\TransportStoppageController@print');
	Route::post('/transport/stoppage/pdf', 'Transport\TransportStoppageController@pdf');
	Route::patch('/transport/stoppage/{id}', 'Transport\TransportStoppageController@update');
	Route::delete('/transport/stoppage/{id}', 'Transport\TransportStoppageController@destroy');

	Route::get('/transport/route/assign/pre-requisite', 'Transport\TransportRouteAssignController@preRequisite');
	Route::post('/transport/route/assign/fetch', 'Transport\TransportRouteAssignController@fetchStudent');
	Route::get('/transport/route/assign', 'Transport\TransportRouteAssignController@index');
	Route::post('/transport/route/assign', 'Transport\TransportRouteAssignController@store');

	Route::get('/transport/route/pre-requisite', 'Transport\TransportRouteController@preRequisite');
	Route::get('/transport/route', 'Transport\TransportRouteController@index');
	Route::get('/transport/route/{id}', 'Transport\TransportRouteController@show');
	Route::post('/transport/route/{id}/stoppage/reorder', 'Transport\TransportRouteController@stoppageReorder');
	Route::post('/transport/route', 'Transport\TransportRouteController@store');
	Route::post('/transport/route/print', 'Transport\TransportRouteController@print');
	Route::post('/transport/route/pdf', 'Transport\TransportRouteController@pdf');
	Route::patch('/transport/route/{id}', 'Transport\TransportRouteController@update');
	Route::delete('/transport/route/{id}', 'Transport\TransportRouteController@destroy');

	Route::get('/vehicle/document/pre-requisite', 'Transport\Vehicle\VehicleDocumentController@preRequisite');
	Route::get('/vehicle/document', 'Transport\Vehicle\VehicleDocumentController@index');
	Route::get('/vehicle/document/{id}', 'Transport\Vehicle\VehicleDocumentController@show');
	Route::post('/vehicle/document', 'Transport\Vehicle\VehicleDocumentController@store');
	Route::post('/vehicle/document/print', 'Transport\Vehicle\VehicleDocumentController@print');
	Route::post('/vehicle/document/pdf', 'Transport\Vehicle\VehicleDocumentController@pdf');
	Route::patch('/vehicle/document/{id}', 'Transport\Vehicle\VehicleDocumentController@update');
	Route::delete('/vehicle/document/{id}', 'Transport\Vehicle\VehicleDocumentController@destroy');

	Route::get('/vehicle/fuel/pre-requisite', 'Transport\Vehicle\VehicleFuelController@preRequisite');
	Route::get('/vehicle/fuel', 'Transport\Vehicle\VehicleFuelController@index');
	Route::get('/vehicle/fuel/{id}', 'Transport\Vehicle\VehicleFuelController@show');
	Route::post('/vehicle/fuel', 'Transport\Vehicle\VehicleFuelController@store');
	Route::post('/vehicle/fuel/print', 'Transport\Vehicle\VehicleFuelController@print');
	Route::post('/vehicle/fuel/pdf', 'Transport\Vehicle\VehicleFuelController@pdf');
	Route::patch('/vehicle/fuel/{id}', 'Transport\Vehicle\VehicleFuelController@update');
	Route::delete('/vehicle/fuel/{id}', 'Transport\Vehicle\VehicleFuelController@destroy');

	Route::get('/vehicle/log/pre-requisite', 'Transport\Vehicle\VehicleLogController@preRequisite');
	Route::get('/vehicle/log', 'Transport\Vehicle\VehicleLogController@index');
	Route::get('/vehicle/log/{id}', 'Transport\Vehicle\VehicleLogController@show');
	Route::post('/vehicle/log', 'Transport\Vehicle\VehicleLogController@store');
	Route::post('/vehicle/log/print', 'Transport\Vehicle\VehicleLogController@print');
	Route::post('/vehicle/log/pdf', 'Transport\Vehicle\VehicleLogController@pdf');
	Route::patch('/vehicle/log/{id}', 'Transport\Vehicle\VehicleLogController@update');
	Route::delete('/vehicle/log/{id}', 'Transport\Vehicle\VehicleLogController@destroy');

	Route::get('/vehicle/service/record/pre-requisite', 'Transport\Vehicle\VehicleServiceRecordController@preRequisite');
	Route::get('/vehicle/service/record', 'Transport\Vehicle\VehicleServiceRecordController@index');
	Route::get('/vehicle/service/record/{id}', 'Transport\Vehicle\VehicleServiceRecordController@show');
	Route::post('/vehicle/service/record', 'Transport\Vehicle\VehicleServiceRecordController@store');
	Route::post('/vehicle/service/record/print', 'Transport\Vehicle\VehicleServiceRecordController@print');
	Route::post('/vehicle/service/record/pdf', 'Transport\Vehicle\VehicleServiceRecordController@pdf');
	Route::patch('/vehicle/service/record/{id}', 'Transport\Vehicle\VehicleServiceRecordController@update');
	Route::delete('/vehicle/service/record/{id}', 'Transport\Vehicle\VehicleServiceRecordController@destroy');

	Route::get('/vehicle/incharge', 'Transport\Vehicle\VehicleInchargeController@index');
	Route::post('/vehicle/incharge', 'Transport\Vehicle\VehicleInchargeController@store');
	Route::post('/vehicle/incharge/print', 'Transport\Vehicle\VehicleInchargeController@print');
	Route::post('/vehicle/incharge/pdf', 'Transport\Vehicle\VehicleInchargeController@pdf');
	Route::delete('/vehicle/incharge/{id}', 'Transport\Vehicle\VehicleInchargeController@destroy');

	Route::get('/vehicle/pre-requisite', 'Transport\Vehicle\VehicleController@preRequisite');
	Route::get('/vehicle', 'Transport\Vehicle\VehicleController@index');
	Route::get('/vehicle/{id}', 'Transport\Vehicle\VehicleController@show');
	Route::post('/vehicle', 'Transport\Vehicle\VehicleController@store');
	Route::post('/vehicle/print', 'Transport\Vehicle\VehicleController@print');
	Route::post('/vehicle/pdf', 'Transport\Vehicle\VehicleController@pdf');
	Route::patch('/vehicle/{id}', 'Transport\Vehicle\VehicleController@update');
	Route::delete('/vehicle/{id}', 'Transport\Vehicle\VehicleController@destroy');

	Route::get('/vehicle/performance/criteria/pre-requisite', 'Transport\Vehicle\VehiclePerformanceCriteriaController@preRequisite');
	Route::get('/vehicle/performance/criteria', 'Transport\Vehicle\VehiclePerformanceCriteriaController@index');
	Route::get('/vehicle/performance/criteria/{id}', 'Transport\Vehicle\VehiclePerformanceCriteriaController@show');
	Route::post('/vehicle/performance/criteria', 'Transport\Vehicle\VehiclePerformanceCriteriaController@store');
	Route::post('/vehicle/performance/criteria/print', 'Transport\Vehicle\VehiclePerformanceCriteriaController@print');
	Route::post('/vehicle/performance/criteria/pdf', 'Transport\Vehicle\VehiclePerformanceCriteriaController@pdf');
	Route::patch('/vehicle/performance/criteria/{id}', 'Transport\Vehicle\VehiclePerformanceCriteriaController@update');
	Route::delete('/vehicle/performance/criteria/{id}', 'Transport\Vehicle\VehiclePerformanceCriteriaController@destroy');
	/*
		     * Transport Routes End
	*/

	/*
		     * Employee Routes Start
	*/
	Route::get('/employee/pre-requisite', 'Employee\EmployeeController@preRequisite');
	Route::get('/employee/basic/pre-requisite', 'Employee\EmployeeController@basicPreRequisite');
	Route::get('/employee', 'Employee\EmployeeController@index');
	Route::get('/employee/{uuid}', 'Employee\EmployeeController@show');
	Route::get('/employee/search/name', 'Employee\EmployeeController@searchByName');
	Route::post('/employee', 'Employee\EmployeeController@store');
	Route::post('/employee/print', 'Employee\EmployeeController@print');
	Route::post('/employee/pdf', 'Employee\EmployeeController@pdf');
	Route::post('/employee/action/group', 'Employee\EmployeeController@groupAction');
	Route::patch('/employee/{uuid}', 'Employee\EmployeeController@update');
	Route::patch('/employee/{uuid}/user/login', 'Employee\EmployeeController@updateUserLogin');

	Route::get('/employee/id-card/pre-requisite', 'Employee\EmployeeController@idCardPreRequisite');
	
	Route::post('/employee/import/start', 'Employee\EmployeeImportController@startImport');
	Route::post('/employee/import/finish', 'Employee\EmployeeImportController@finishImport');

	Route::post('/employee/{uuid}/photo', 'Employee\EmployeeController@uploadPhoto');
	Route::delete('/employee/{uuid}/photo/remove', 'Employee\EmployeeController@removePhoto');

	Route::get('/employee/{uuid}/designation/pre-requisite', 'Employee\EmployeeDesignationController@preRequisite');
	Route::post('/employee/{uuid}/designation', 'Employee\EmployeeDesignationController@store');
	Route::get('/employee/{uuid}/designation/{id}', 'Employee\EmployeeDesignationController@show');
	Route::patch('/employee/{uuid}/designation/{id}', 'Employee\EmployeeDesignationController@update');
	Route::delete('/employee/{uuid}/designation/{id}', 'Employee\EmployeeDesignationController@destroy');

	Route::get('/employee/{uuid}/term/pre-requisite', 'Employee\EmployeeTermController@preRequisite');
	Route::post('/employee/{uuid}/term', 'Employee\EmployeeTermController@store');
	Route::get('/employee/{uuid}/term/{id}', 'Employee\EmployeeTermController@show');
	Route::patch('/employee/{uuid}/term/{id}', 'Employee\EmployeeTermController@update');
	Route::delete('/employee/{uuid}/term/{id}', 'Employee\EmployeeTermController@destroy');

	Route::get('/employee/{uuid}/document/pre-requisite', 'Employee\EmployeeDocumentController@preRequisite');
	Route::get('/employee/{uuid}/document', 'Employee\EmployeeDocumentController@index');
	Route::get('/employee/{uuid}/document/{id}', 'Employee\EmployeeDocumentController@show');
	Route::post('/employee/{uuid}/document', 'Employee\EmployeeDocumentController@store');
	Route::patch('/employee/{uuid}/document/{id}', 'Employee\EmployeeDocumentController@update');
	Route::delete('/employee/{uuid}/document/{id}', 'Employee\EmployeeDocumentController@destroy');

	Route::get('/employee/{uuid}/account', 'Employee\EmployeeAccountController@index');
	Route::get('/employee/{uuid}/account/{id}', 'Employee\EmployeeAccountController@show');
	Route::post('/employee/{uuid}/account', 'Employee\EmployeeAccountController@store');
	Route::patch('/employee/{uuid}/account/{id}', 'Employee\EmployeeAccountController@update');
	Route::delete('/employee/{uuid}/account/{id}', 'Employee\EmployeeAccountController@destroy');

	Route::get('/employee/{uuid}/qualification', 'Employee\EmployeeQualificationController@index');
	Route::get('/employee/{uuid}/qualification/{id}', 'Employee\EmployeeQualificationController@show');
	Route::post('/employee/{uuid}/qualification', 'Employee\EmployeeQualificationController@store');
	Route::patch('/employee/{uuid}/qualification/{id}', 'Employee\EmployeeQualificationController@update');
	Route::delete('/employee/{uuid}/qualification/{id}', 'Employee\EmployeeQualificationController@destroy');

	Route::get('/employee/leave/allocation/pre-requisite', 'Employee\LeaveAllocationController@preRequisite');
	Route::get('/employee/leave/allocation', 'Employee\LeaveAllocationController@index');
	Route::get('/employee/leave/allocation/{uuid}', 'Employee\LeaveAllocationController@show');
	Route::post('/employee/leave/allocation', 'Employee\LeaveAllocationController@store');
	Route::post('/employee/leave/allocation/fetch', 'Employee\LeaveAllocationController@employeeLeaveAllocation');
	Route::post('/employee/leave/allocation/print', 'Employee\LeaveAllocationController@print');
	Route::post('/employee/leave/allocation/pdf', 'Employee\LeaveAllocationController@pdf');
	Route::patch('/employee/leave/allocation/{uuid}', 'Employee\LeaveAllocationController@update');
	Route::delete('/employee/leave/allocation/{uuid}', 'Employee\LeaveAllocationController@destroy');

	Route::get('/employee/leave/request/pre-requisite', 'Employee\LeaveRequestController@preRequisite');
	Route::get('/employee/leave/request', 'Employee\LeaveRequestController@index');
	Route::get('/employee/leave/request/{uuid}', 'Employee\LeaveRequestController@show');
	Route::post('/employee/leave/request', 'Employee\LeaveRequestController@store');
	Route::post('/employee/leave/request/print', 'Employee\LeaveRequestController@print');
	Route::post('/employee/leave/request/pdf', 'Employee\LeaveRequestController@pdf');
	Route::post('/employee/leave/request/{uuid}/status', 'Employee\LeaveRequestController@updateSatus');
	Route::patch('/employee/leave/request/{uuid}', 'Employee\LeaveRequestController@update');
	Route::delete('/employee/leave/request/{uuid}', 'Employee\LeaveRequestController@destroy');

	Route::get('/employee/attendance/regular/pre-requisite', 'Employee\AttendanceController@preRequisiteRegular');
	Route::get('/employee/attendance/production/pre-requisite', 'Employee\AttendanceController@preRequisiteProduction');
	Route::post('/employee/attendance/regular/list', 'Employee\AttendanceController@listRegular');
	Route::post('/employee/attendance/regular', 'Employee\AttendanceController@storeRegular');
	Route::post('/employee/attendance/production', 'Employee\AttendanceController@storeProduction');
	Route::post('/employee/attendance/regular/fetch', 'Employee\AttendanceController@fetchRegular');
	Route::post('/employee/attendance/production/fetch', 'Employee\AttendanceController@fetchProduction');

	Route::get('/employee/payroll/template/pre-requisite', 'Employee\PayrollTemplateController@preRequisite');
	Route::get('/employee/payroll/template', 'Employee\PayrollTemplateController@index');
	Route::get('/employee/payroll/template/{uuid}', 'Employee\PayrollTemplateController@show');
	Route::post('/employee/payroll/template', 'Employee\PayrollTemplateController@store');
	Route::post('/employee/payroll/template/print', 'Employee\PayrollTemplateController@print');
	Route::post('/employee/payroll/template/pdf', 'Employee\PayrollTemplateController@pdf');
	Route::patch('/employee/payroll/template/{uuid}', 'Employee\PayrollTemplateController@update');
	Route::delete('/employee/payroll/template/{uuid}', 'Employee\PayrollTemplateController@destroy');

	Route::get('/employee/payroll/salary/pre-requisite', 'Employee\SalaryController@preRequisite');
	Route::get('/employee/payroll/salary', 'Employee\SalaryController@index');
	Route::get('/employee/payroll/salary/{uuid}', 'Employee\SalaryController@show');
	Route::post('/employee/payroll/salary', 'Employee\SalaryController@store');
	Route::post('/employee/payroll/salary/print', 'Employee\SalaryController@print');
	Route::post('/employee/payroll/salary/pdf', 'Employee\SalaryController@pdf');
	Route::patch('/employee/payroll/salary/{uuid}', 'Employee\SalaryController@update');
	Route::delete('/employee/payroll/salary/{uuid}', 'Employee\SalaryController@destroy');

	Route::get('/employee/payroll/transaction/pre-requisite', 'Employee\PayrollTransactionController@preRequisite');
	Route::get('/employee/payroll/transaction', 'Employee\PayrollTransactionController@index');
	Route::get('/employee/payroll/transaction/{uuid}', 'Employee\PayrollTransactionController@show');
	Route::post('/employee/payroll/transaction', 'Employee\PayrollTransactionController@store');
	Route::post('/employee/payroll/transaction/advance/balance', 'Employee\PayrollTransactionController@advanceBalance');
	Route::post('/employee/payroll/transaction/print', 'Employee\PayrollTransactionController@print');
	Route::post('/employee/payroll/transaction/pdf', 'Employee\PayrollTransactionController@pdf');
	Route::patch('/employee/payroll/transaction/{uuid}', 'Employee\PayrollTransactionController@update');
	Route::delete('/employee/payroll/transaction/{uuid}', 'Employee\PayrollTransactionController@cancel');

	Route::get('/employee/payroll/pre-requisite', 'Employee\PayrollController@preRequisite');
	Route::get('/employee/payroll/list', 'Employee\PayrollController@index');
	Route::get('/employee/payroll/{uuid}', 'Employee\PayrollController@show');
	Route::post('/employee/payroll/fetch', 'Employee\PayrollController@fetch');
	Route::post('/employee/payroll/generate', 'Employee\PayrollController@generate');
	Route::post('/employee/payroll/unpaid', 'Employee\PayrollController@fetchUnpaid');
	Route::post('/employee/payroll/print', 'Employee\PayrollController@print');
	Route::post('/employee/payroll/pdf', 'Employee\PayrollController@pdf');
	Route::patch('/employee/payroll/{uuid}', 'Employee\PayrollController@update');
	Route::delete('/employee/payroll/{uuid}', 'Employee\PayrollController@destroy');
	/*
		     * Transport Routes End
	*/

	/*
		     * Library Routes Start
	*/

	Route::post('/library/barcode', 'Library\BarcodeController@print');

	Route::get('/book/log', 'Library\BookLogController@index');
	Route::get('/book/log/fee/pre-requisite', 'Library\BookLogController@feePreRequisite');
	Route::get('/book/log/{uuid}', 'Library\BookLogController@show');
	Route::post('/book/log', 'Library\BookLogController@store');
	Route::post('/book/log/unreturned', 'Library\BookLogController@unreturnedBooks');
	Route::post('/book/log/print', 'Library\BookLogController@print');
	Route::post('/book/log/pdf', 'Library\BookLogController@pdf');
	Route::post('/book/log/{uuid}/return', 'Library\BookLogController@returnBook');

	Route::get('/book/pre-requisite', 'Library\BookController@preRequisite');
	Route::get('/book/post/pre-requisite', 'Library\BookController@bookPostPreRequisite');
	Route::get('/book', 'Library\BookController@index');
	Route::get('/book/{uuid}', 'Library\BookController@show');
	Route::post('/book', 'Library\BookController@store');
	Route::post('/book/search/number', 'Library\BookController@searchByNumber');
	Route::post('/book/print', 'Library\BookController@print');
	Route::post('/book/pdf', 'Library\BookController@pdf');
	Route::post('/book/{uuid}/post', 'Library\BookController@post');
	Route::patch('/book/{uuid}', 'Library\BookController@update');
	Route::patch('/book/{uuid}/post/detail/{id}', 'Library\BookController@updateBookDetail');
	Route::delete('/book/{uuid}', 'Library\BookController@destroy');
	Route::delete('/book/{uuid}/post/{id}', 'Library\BookController@destroyBookPost');
	Route::delete('/book/{uuid}/post/detail/{id}', 'Library\BookController@destroyBookPostDetail');
	/*
		     * Library Routes End
	*/

	/*
		     * Calendar Routes Start
	*/
	Route::get('/holiday', 'Calendar\HolidayController@index');
	Route::get('/holiday/{id}', 'Calendar\HolidayController@show');
	Route::post('/holiday', 'Calendar\HolidayController@store');
	Route::post('/holiday/print', 'Calendar\HolidayController@print');
	Route::post('/holiday/pdf', 'Calendar\HolidayController@pdf');
	Route::patch('/holiday/{id}', 'Calendar\HolidayController@update');
	Route::delete('/holiday/{id}', 'Calendar\HolidayController@destroy');

	Route::get('/event/pre-requisite', 'Calendar\EventController@preRequisite');
	Route::get('/event', 'Calendar\EventController@index');
	Route::get('/event/upcoming', 'Calendar\EventController@upcoming');
	Route::get('/event/{uuid}', 'Calendar\EventController@show');
	Route::post('/event', 'Calendar\EventController@store');
	Route::post('/event/print', 'Calendar\EventController@print');
	Route::post('/event/pdf', 'Calendar\EventController@pdf');
	Route::patch('/event/{uuid}', 'Calendar\EventController@update');
	Route::delete('/event/{uuid}', 'Calendar\EventController@destroy');

	Route::get('/birthday', 'Calendar\CelebrationController@birthday');
	Route::post('/birthday/print', 'Calendar\CelebrationController@printBirthday');
	Route::post('/birthday/pdf', 'Calendar\CelebrationController@pdfBirthday');
	Route::get('/anniversary', 'Calendar\CelebrationController@anniversary');
	Route::post('/anniversary/print', 'Calendar\CelebrationController@printAnniversary');
	Route::post('/anniversary/pdf', 'Calendar\CelebrationController@pdfAnniversary');
	Route::get('/work/anniversary', 'Calendar\CelebrationController@workAnniversary');
	Route::post('/work/anniversary/print', 'Calendar\CelebrationController@printWorkAnniversary');
	Route::post('/work/anniversary/pdf', 'Calendar\CelebrationController@pdfWorkAnniversary');
	/*
		     * Calendar Routes End
	*/

	/*
		     * Post Routes Start
	*/
	Route::get('/article/pre-requisite', 'Post\ArticleController@preRequisite');
	Route::get('/article', 'Post\ArticleController@index');
	Route::get('/article/{uuid}', 'Post\ArticleController@show');
	Route::post('/article', 'Post\ArticleController@store');
	Route::post('/article/print', 'Post\ArticleController@print');
	Route::post('/article/pdf', 'Post\ArticleController@pdf');
	Route::patch('/article/{uuid}', 'Post\ArticleController@update');
	Route::delete('/article/{uuid}', 'Post\ArticleController@destroy');
	/*
		     * Post Routes End
	*/

	/*
		     * Reception Routes Start
	*/
	Route::get('/enquiry/pre-requisite', 'Reception\EnquiryController@preRequisite');
	Route::get('/enquiry', 'Reception\EnquiryController@index');
	Route::get('/enquiry/{uuid}', 'Reception\EnquiryController@show');
	Route::post('/enquiry', 'Reception\EnquiryController@store');
	Route::post('/enquiry/print', 'Reception\EnquiryController@print');
	Route::post('/enquiry/pdf', 'Reception\EnquiryController@pdf');
	Route::post('/enquiry/{uuid}/follow/up', 'Reception\EnquiryController@followUp');
	Route::patch('/enquiry/{uuid}', 'Reception\EnquiryController@update');
	Route::delete('/enquiry/{uuid}', 'Reception\EnquiryController@destroy');
	Route::delete('/enquiry/{uuid}/follow/up/{id}', 'Reception\EnquiryController@destroyFollowUp');

	Route::get('/complaint/pre-requisite', 'Reception\ComplaintController@preRequisite');
	Route::get('/complaint', 'Reception\ComplaintController@index');
	Route::get('/complaint/{uuid}', 'Reception\ComplaintController@show');
	Route::post('/complaint', 'Reception\ComplaintController@store');
	Route::post('/complaint/print', 'Reception\ComplaintController@print');
	Route::post('/complaint/pdf', 'Reception\ComplaintController@pdf');
	Route::patch('/complaint/{uuid}', 'Reception\ComplaintController@update');
	Route::delete('/complaint/{uuid}', 'Reception\ComplaintController@destroy');

	Route::get('/visitor/log/pre-requisite', 'Reception\VisitorLogController@preRequisite');
	Route::get('/visitor/log', 'Reception\VisitorLogController@index');
	Route::get('/visitor/log/{uuid}', 'Reception\VisitorLogController@show');
	Route::post('/visitor/log', 'Reception\VisitorLogController@store');
	Route::post('/visitor/log/print', 'Reception\VisitorLogController@print');
	Route::post('/visitor/log/pdf', 'Reception\VisitorLogController@pdf');
	Route::patch('/visitor/log/{uuid}', 'Reception\VisitorLogController@update');
	Route::delete('/visitor/log/{uuid}', 'Reception\VisitorLogController@destroy');

	Route::get('/call/log/pre-requisite', 'Reception\CallLogController@preRequisite');
	Route::get('/call/log', 'Reception\CallLogController@index');
	Route::get('/call/log/{uuid}', 'Reception\CallLogController@show');
	Route::post('/call/log', 'Reception\CallLogController@store');
	Route::post('/call/log/print', 'Reception\CallLogController@print');
	Route::post('/call/log/pdf', 'Reception\CallLogController@pdf');
	Route::patch('/call/log/{uuid}', 'Reception\CallLogController@update');
	Route::delete('/call/log/{uuid}', 'Reception\CallLogController@destroy');

	Route::get('/postal/record/pre-requisite', 'Reception\PostalRecordController@preRequisite');
	Route::get('/postal/record', 'Reception\PostalRecordController@index');
	Route::get('/postal/record/{uuid}', 'Reception\PostalRecordController@show');
	Route::post('/postal/record', 'Reception\PostalRecordController@store');
	Route::post('/postal/record/print', 'Reception\PostalRecordController@print');
	Route::post('/postal/record/pdf', 'Reception\PostalRecordController@pdf');
	Route::patch('/postal/record/{uuid}', 'Reception\PostalRecordController@update');
	Route::delete('/postal/record/{uuid}', 'Reception\PostalRecordController@destroy');

	Route::get('/gate/pass/pre-requisite', 'Reception\GatePassController@preRequisite');
	Route::get('/gate/pass', 'Reception\GatePassController@index');
	Route::get('/gate/pass/{uuid}', 'Reception\GatePassController@show');
	Route::post('/gate/pass', 'Reception\GatePassController@store');
	Route::post('/gate/pass/print', 'Reception\GatePassController@print');
	Route::post('/gate/pass/pdf', 'Reception\GatePassController@pdf');
	Route::patch('/gate/pass/{uuid}', 'Reception\GatePassController@update');
	Route::delete('/gate/pass/{uuid}', 'Reception\GatePassController@destroy');

	Route::get('/visitor/message', 'Reception\VisitorMessageController@index');
	Route::get('/visitor/message/{uuid}', 'Reception\VisitorMessageController@show');
	Route::post('/visitor/message/print', 'Reception\VisitorMessageController@print');
	Route::post('/visitor/message/pdf', 'Reception\VisitorMessageController@pdf');
	Route::delete('/visitor/message/{uuid}', 'Reception\VisitorMessageController@destroy');
	/*
		     * Reception Routes End
	*/

	/*
		     * Resource Routes Start
	*/
	Route::get('/assignment/pre-requisite', 'Resource\AssignmentController@preRequisite');
	Route::get('/assignment', 'Resource\AssignmentController@index');
	Route::get('/assignment/{uuid}', 'Resource\AssignmentController@show');
	Route::post('/assignment', 'Resource\AssignmentController@store');
	Route::post('/assignment/print', 'Resource\AssignmentController@print');
	Route::post('/assignment/pdf', 'Resource\AssignmentController@pdf');
	Route::patch('/assignment/{uuid}', 'Resource\AssignmentController@update');
	Route::delete('/assignment/{uuid}', 'Resource\AssignmentController@destroy');

	Route::get('/notes/pre-requisite', 'Resource\NotesController@preRequisite');
	Route::get('/notes', 'Resource\NotesController@index');
	Route::get('/notes/{uuid}', 'Resource\NotesController@show');
	Route::post('/notes', 'Resource\NotesController@store');
	Route::post('/notes/print', 'Resource\NotesController@print');
	Route::post('/notes/pdf', 'Resource\NotesController@pdf');
	Route::patch('/notes/{uuid}', 'Resource\NotesController@update');
	Route::delete('/notes/{uuid}', 'Resource\NotesController@destroy');

	Route::get('/lesson/plan/pre-requisite', 'Resource\LessonPlanController@preRequisite');
	Route::get('/lesson/plan', 'Resource\LessonPlanController@index');
	Route::get('/lesson/plan/{uuid}', 'Resource\LessonPlanController@show');
	Route::post('/lesson/plan', 'Resource\LessonPlanController@store');
	Route::post('/lesson/plan/print', 'Resource\LessonPlanController@print');
	Route::post('/lesson/plan/pdf', 'Resource\LessonPlanController@pdf');
	Route::patch('/lesson/plan/{uuid}', 'Resource\LessonPlanController@update');
	Route::delete('/lesson/plan/{uuid}', 'Resource\LessonPlanController@destroy');

	Route::get('/syllabus/pre-requisite', 'Resource\SyllabusController@preRequisite');
	Route::get('/syllabus', 'Resource\SyllabusController@index');
	Route::get('/syllabus/{uuid}', 'Resource\SyllabusController@show');
	Route::post('/syllabus', 'Resource\SyllabusController@store');
	Route::post('/syllabus/print', 'Resource\SyllabusController@print');
	Route::post('/syllabus/pdf', 'Resource\SyllabusController@pdf');
	Route::patch('/syllabus/{uuid}', 'Resource\SyllabusController@update');
	Route::delete('/syllabus/{uuid}', 'Resource\SyllabusController@destroy');
	/*
		     * Resource Routes End
	*/

	/*
		     * Frontend Routes Start
	*/
	Route::get('/frontend/page', 'Frontend\PageController@index');
	Route::get('/frontend/page/{uuid}', 'Frontend\PageController@show');
	Route::post('/frontend/page', 'Frontend\PageController@store');
	Route::post('/frontend/page/slider/image', 'Frontend\PageController@uploadSliderImage');
	Route::post('/frontend/page/print', 'Frontend\PageController@print');
	Route::post('/frontend/page/pdf', 'Frontend\PageController@pdf');
	Route::patch('/frontend/page/{uuid}', 'Frontend\PageController@update');
	Route::delete('/frontend/page/{uuid}', 'Frontend\PageController@destroy');
	Route::delete('/frontend/page/slider/image', 'Frontend\PageController@removeSliderImage');

	Route::get('/frontend/block/pre-requisite', 'Frontend\BlockController@preRequisite');
	Route::get('/frontend/block', 'Frontend\BlockController@index');
	Route::get('/frontend/block/{uuid}', 'Frontend\BlockController@show');
	Route::post('/frontend/block', 'Frontend\BlockController@store');
	Route::post('/frontend/block/reorder', 'Frontend\BlockController@reorder');
	Route::post('/frontend/block/featured/image', 'Frontend\BlockController@uploadFeaturedImage');
	Route::post('/frontend/block/print', 'Frontend\BlockController@print');
	Route::post('/frontend/block/pdf', 'Frontend\BlockController@pdf');
	Route::patch('/frontend/block/{uuid}', 'Frontend\BlockController@update');
	Route::delete('/frontend/block/{uuid}', 'Frontend\BlockController@destroy');
	Route::delete('/frontend/block/featured/image', 'Frontend\BlockController@removeFeaturedImage');

	Route::get('/frontend/menu/pre-requisite', 'Frontend\MenuController@preRequisite');
	Route::get('/frontend/menu', 'Frontend\MenuController@index');
	Route::get('/frontend/menu/{id}', 'Frontend\MenuController@show');
	Route::post('/frontend/menu', 'Frontend\MenuController@store');
	Route::post('/frontend/menu/reorder', 'Frontend\MenuController@reorder');
	Route::post('/frontend/menu/{id}/reorder', 'Frontend\MenuController@reorderSubMenu');
	Route::post('/frontend/menu/print', 'Frontend\MenuController@print');
	Route::post('/frontend/menu/pdf', 'Frontend\MenuController@pdf');
	Route::patch('/frontend/menu/{id}', 'Frontend\MenuController@update');
	Route::delete('/frontend/menu/{id}', 'Frontend\MenuController@destroy');
	/*
		     * Frontend Routes End
	*/

	Route::get('/institute/document/pre-requisite', 'Institute\InstituteDocumentController@preRequisite');
	Route::get('/institute/document', 'Institute\InstituteDocumentController@index');
	Route::get('/institute/document/{id}', 'Institute\InstituteDocumentController@show');
	Route::post('/institute/document', 'Institute\InstituteDocumentController@store');
	Route::post('/institute/document/print', 'Institute\InstituteDocumentController@print');
	Route::post('/institute/document/pdf', 'Institute\InstituteDocumentController@pdf');
	Route::patch('/institute/document/{id}', 'Institute\InstituteDocumentController@update');
	Route::delete('/institute/document/{id}', 'Institute\InstituteDocumentController@destroy');

	Route::get('/fee/report/summary', 'Finance\Fee\ReportController@feeSummary');
	Route::post('/fee/report/summary/print', 'Finance\Fee\ReportController@printFeeSummary');
	Route::post('/fee/report/summary/pdf', 'Finance\Fee\ReportController@pdfFeeSummary');
	Route::post('/fee/report/summary/sms', 'Finance\Fee\ReportController@smsSummary');
	Route::get('/fee/report/concession', 'Finance\Fee\ReportController@feeConcession');
	Route::post('/fee/report/concession/print', 'Finance\Fee\ReportController@printFeeConcession');
	Route::post('/fee/report/concession/pdf', 'Finance\Fee\ReportController@pdfFeeConcession');
	Route::get('/fee/report/due', 'Finance\Fee\ReportController@feeDue');
	Route::post('/fee/report/due/print', 'Finance\Fee\ReportController@printFeeDue');
	Route::post('/fee/report/due/pdf', 'Finance\Fee\ReportController@pdfFeeDue');
	Route::post('/fee/report/due/sms', 'Finance\Fee\ReportController@smsDue');
	Route::get('/fee/report/payment', 'Finance\Fee\ReportController@feePayment');
	Route::post('/fee/report/payment/print', 'Finance\Fee\ReportController@printFeePayment');
	Route::post('/fee/report/payment/pdf', 'Finance\Fee\ReportController@pdfFeePayment');
	Route::post('/fee/report/payment/sms', 'Finance\Fee\ReportController@smsPayment');

	Route::get('/vehicle/report/summary', 'Transport\Vehicle\ReportController@summaryReport');
	Route::get('/vehicle/report/log', 'Transport\Vehicle\ReportController@logReport');
	Route::get('/vehicle/report/fuel', 'Transport\Vehicle\ReportController@fuelReport');
	Route::get('/vehicle/report/service', 'Transport\Vehicle\ReportController@serviceReport');

	Route::get('/transport/report/pre-requisite', 'Transport\ReportController@preRequisite');
	Route::get('/transport/report/route', 'Transport\ReportController@routeWiseReport');
	Route::post('/transport/report/route/print', 'Transport\ReportController@printRouteWiseReport');
	Route::post('/transport/report/route/pdf', 'Transport\ReportController@pdfRouteWiseReport');
	Route::get('/transport/report/stoppage', 'Transport\ReportController@stoppageWiseReport');
	Route::post('/transport/report/stoppage/print', 'Transport\ReportController@printStoppageWiseReport');
	Route::post('/transport/report/stoppage/pdf', 'Transport\ReportController@pdfStoppageWiseReport');

	Route::get('/transaction/report/pre-requisite', 'Finance\Transaction\ReportController@preRequisite');
	Route::get('/transaction/report/summary', 'Finance\Transaction\ReportController@summary');
	Route::post('/transaction/report/summary/print', 'Finance\Transaction\ReportController@printSummary');
	Route::post('/transaction/report/summary/pdf', 'Finance\Transaction\ReportController@pdfSummary');
	Route::get('/transaction/report/day-book', 'Finance\Transaction\ReportController@dayBook');
	Route::post('/transaction/report/day-book/print', 'Finance\Transaction\ReportController@printDayBook');
	Route::post('/transaction/report/day-book/pdf', 'Finance\Transaction\ReportController@pdfDayBook');

	/*
		     * Communication Routes Start
	*/
	Route::get('/communication/pre-requisite', 'Communication\CommunicationController@preRequisite');
	Route::get('/communication', 'Communication\CommunicationController@index');
	Route::get('/communication/{uuid}', 'Communication\CommunicationController@show');
	Route::post('/communication/print', 'Communication\CommunicationController@print');
	Route::post('/communication/pdf', 'Communication\CommunicationController@pdf');
	Route::delete('/communication/{uuid}', 'Communication\CommunicationController@destroy');
	Route::post('/sms', 'Communication\SMSController@store');
	Route::post('/email', 'Communication\EmailController@store');
	/*
		     * Communication Routes End
	*/

	Route::get('/vendor', 'Inventory\VendorController@index');
	Route::get('/vendor/{id}', 'Inventory\VendorController@show');
	Route::post('/vendor', 'Inventory\VendorController@store');
	Route::post('/vendor/print', 'Inventory\VendorController@print');
	Route::post('/vendor/pdf', 'Inventory\VendorController@pdf');
	Route::patch('/vendor/{id}', 'Inventory\VendorController@update');
	Route::delete('/vendor/{id}', 'Inventory\VendorController@destroy');

	Route::get('/stock/category/pre-requisite', 'Inventory\StockCategoryController@preRequisite');
	Route::get('/stock/category', 'Inventory\StockCategoryController@index');
	Route::get('/stock/category/{id}', 'Inventory\StockCategoryController@show');
	Route::post('/stock/category', 'Inventory\StockCategoryController@store');
	Route::post('/stock/category/print', 'Inventory\StockCategoryController@print');
	Route::post('/stock/category/pdf', 'Inventory\StockCategoryController@pdf');
	Route::patch('/stock/category/{id}', 'Inventory\StockCategoryController@update');
	Route::delete('/stock/category/{id}', 'Inventory\StockCategoryController@destroy');

	Route::get('/stock/item/pre-requisite', 'Inventory\StockItemController@preRequisite');
	Route::get('/stock/item', 'Inventory\StockItemController@index');
	Route::get('/stock/item/{id}', 'Inventory\StockItemController@show');
	Route::post('/stock/item', 'Inventory\StockItemController@store');
	Route::post('/stock/item/print', 'Inventory\StockItemController@print');
	Route::post('/stock/item/pdf', 'Inventory\StockItemController@pdf');
	Route::patch('/stock/item/{id}', 'Inventory\StockItemController@update');
	Route::delete('/stock/item/{id}', 'Inventory\StockItemController@destroy');

	Route::get('/stock/purchase/pre-requisite', 'Inventory\StockPurchaseController@preRequisite');
	Route::get('/stock/purchase', 'Inventory\StockPurchaseController@index');
	Route::get('/stock/purchase/{id}', 'Inventory\StockPurchaseController@show');
	Route::post('/stock/purchase', 'Inventory\StockPurchaseController@store');
	Route::post('/stock/purchase/print', 'Inventory\StockPurchaseController@print');
	Route::post('/stock/purchase/pdf', 'Inventory\StockPurchaseController@pdf');
	Route::patch('/stock/purchase/{id}', 'Inventory\StockPurchaseController@update');
	Route::delete('/stock/purchase/{id}', 'Inventory\StockPurchaseController@destroy');

	Route::get('/stock/transfer/pre-requisite', 'Inventory\StockTransferController@preRequisite');
	Route::get('/stock/transfer', 'Inventory\StockTransferController@index');
	Route::get('/stock/transfer/{id}', 'Inventory\StockTransferController@show');
	Route::post('/stock/transfer/{id}/return', 'Inventory\StockTransferController@returnItem');
	Route::delete('/stock/transfer/{id}/return/{return_id}', 'Inventory\StockTransferController@destroyReturn');
	Route::post('/stock/transfer', 'Inventory\StockTransferController@store');
	Route::post('/stock/transfer/print', 'Inventory\StockTransferController@print');
	Route::post('/stock/transfer/pdf', 'Inventory\StockTransferController@pdf');
	Route::patch('/stock/transfer/{id}', 'Inventory\StockTransferController@update');
	Route::delete('/stock/transfer/{id}', 'Inventory\StockTransferController@destroy');
});

Route::any('/{var?}', function () {
	return response()->json(['message' => 'API Endpoint Not Found!'], 404);
});