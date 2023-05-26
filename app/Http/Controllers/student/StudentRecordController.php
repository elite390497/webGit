<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\FeePaymentRequest;
use App\Http\Requests\Student\RecordUpdateRequest;
use App\Models\Student\StudentRecord;
use App\Repositories\Student\StudentRecordRepository;
use App\Repositories\Student\StudentFeeRecordRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Session;

class StudentRecordController extends Controller {
	protected $request;
	protected $repo;
	protected $fee_repo;

	/**
	 * Instantiate a new controller instance.
	 *
	 * @return void
	 */
	public function __construct(
		Request $request,
		StudentRecordRepository $repo,
		StudentFeeRecordRepository $fee_repo
	) {
		$this->request = $request;
		$this->repo = $repo;
		$this->fee_repo = $fee_repo;
	}

	/**
	 * Used to get student record
	 * @get ("/api/student/{uuid}/record/{record_id}")
	 * @return Response
	 */
	public function index($uuid, $record_id) {
		$this->authorize('list', StudentRecord::class);

		$student_record = $this->repo->findByUuidOrFail($uuid, $record_id);

		return $this->success($this->repo->getDataForCreateFee($student_record));
	}

	/**
	 * Used to store student fee record
	 * @post ("/api/student/{uuid}/fee/{record_id}")
	 * @return Response
	 */
	public function store($uuid, $record_id) {
		$this->authorize('setFee', StudentRecord::class);

		$student_record = $this->repo->findByUuidOrFail($uuid, $record_id);

		$this->repo->create($student_record, $this->request->all());

		return $this->success(['message' => trans('student.fee_set')]);
	}

	/**
	 * Used to get student fee record
	 * @get ("/api/student/{uuid}/fee/{record_id}")
	 * @return Response
	 */
	public function fee($uuid, $record_id) {
		$this->authorize('listFee', StudentRecord::class);

		$record = $this->repo->findByUuidOrFail($uuid, $record_id);

		return $this->success($this->repo->fee($record));
	}

	/**
	 * Used to get student fee record detail
	 * @get ("/api/student/{uuid}/fee/{record_id}/detail")
	 * @return Response
	 */
	public function feeDetail($uuid, $record_id) {
		$this->authorize('listFee', StudentRecord::class);

		$record = $this->repo->findByUuidOrFail($uuid, $record_id);

		$record = $this->repo->loadFeeData($record);

		return $this->ok($this->fee_repo->feeDetail($record));
	}

	/**
	 * Used to print student fee
	 * @post ("/api/students/{uuid}/fee/{record_id}/print")
	 * @return Response
	 */
	public function print($uuid, $record_id) {
		$this->authorize('listFee', StudentRecord::class);

		$record = $this->repo->findByUuidOrFail($uuid, $record_id);

		$fee = request('fee');

		return view('print.student.fee', compact('fee', 'record'))->render();
	}

	/**
	 * Used to generate pdf of student fee
	 * @post ("/api/students/{uuid}/fee/{record_id}/pdf")
	 * @return Response
	 */
	public function pdf($uuid, $record_id) {
		$this->authorize('listFee', StudentRecord::class);

		$record = $this->repo->findByUuidOrFail($uuid, $record_id);

		$fee = request('fee');

		$uuid = Str::uuid();
		$pdf = \PDF::loadView('print.student.fee', compact('fee', 'record'))->save('../storage/app/downloads/' . $uuid . '.pdf');

		return $uuid;
	}

	/**
	 * Used to get fee payment requisite
	 * @get ("/api/student/fee/pre-requisite")
	 * @return Response
	 */
	public function feePreRequisite() {
		$this->authorize('makePayment', StudentRecord::class);

		return $this->success($this->repo->getFeePreRequisite());
	}

	/**
	 * Used to get record edit requisite
	 * @get ("/api/student/record/pre-requisite")
	 * @return Response
	 */
	public function recordPreRequisite() {
		$this->authorize('update', StudentRecord::class);

		return $this->success($this->repo->getRecordPreRequisite());
	}

	/**
	 * Used to update student fee record
	 * @patch ("/api/student/{uuid}/fee/{record_id}")
	 * @return Response
	 */
	public function setFee($uuid, $record_id) {
		$this->authorize('setFee', StudentRecord::class);

		$student_record = $this->repo->findByUuidOrFail($uuid, $record_id);

		$this->repo->setFee($student_record, $this->request->all());

		return $this->success(['message' => trans('student.fee_set')]);
	}

	/**
	 * Used to reset student fee record
	 * @patch ("/api/student/{uuid}/fee/{record_id}/reset")
	 * @return Response
	 */
	public function resetFee($uuid, $record_id) {
		$this->authorize('setFee', StudentRecord::class);

		$student_record = $this->repo->findByUuidOrFail($uuid, $record_id);

		$this->repo->resetFee($student_record, $this->request->all());

		return $this->success(['message' => trans('student.fee_reset')]);
	}

	/**
	 * Used to make fee payment
	 * @post ("/api/student/{uuid}/payment/{record_id}")
	 * @return Response
	 */
	public function makePayment(FeePaymentRequest $request, $uuid, $record_id) {
		$this->authorize('makePayment', StudentRecord::class);

		$student_record = $this->repo->findByUuidOrFail($uuid, $record_id);

		$this->repo->makePayment($student_record, $this->request->all());

		return $this->success(['message' => trans('finance.fee_paid')]);
	}

	/**
	 * Used to get payment detail
	 * @get ("/api/student/{uuid}/fee/{record_id}/{fee_record_id}")
	 * @return Response
	 */
	public function getPaymentDetail($uuid, $record_id, $fee_record_id) {
		$this->authorize('listFee', StudentRecord::class);

		$student_record = $this->repo->findByUuidOrFail($uuid, $record_id);

		return $this->success($this->repo->getPaymentDetail($student_record, $fee_record_id));
	}

	/**
	 * Used to print fee receipt
	 * @post ("/api/student/{uuid}/fee/{record_id}/{fee_record_id}/{transaction_id}/print")
	 * @return Response
	 */
	public function printReceipt($uuid, $record_id, $fee_record_id, $transaction_id) {
		$this->authorize('listFee', StudentRecord::class);

		$student_record = $this->repo->findByUuidOrFail($uuid, $record_id);

		$student_record->load('transportRouteStudent', 'transportRouteStudent.transportRouteDetail', 'transportRouteStudent.transportRouteDetail.transportRoute', 'transportRouteStudent.transportRouteDetail.transportStoppage');

		$transactions = $this->repo->getReceipt($student_record, $fee_record_id, $transaction_id);

		$student_record->load(['student', 'student.parent', 'admission', 'batch', 'batch.course']);

		return view('print.student.fee-receipt', compact('transactions', 'student_record'))->render();
	}

	/**
	 * Used to cancel empty payment
	 * @get ("/api/student/{uuid}/fee/{record_id}/{fee_record_id}/cancel")
	 * @return Response
	 */
	public function cancelEmptyPayment($uuid, $record_id, $fee_record_id) {
		$this->authorize('cancelPayment', StudentRecord::class);

		$student_record = $this->repo->findByUuidOrFail($uuid, $record_id);

		$this->repo->cancelEmptyPayment($student_record, $fee_record_id);

		return $this->success(['message' => trans('finance.fee_payment_cancelled')]);
	}

	/**
	 * Used to cancel payment
	 * @get ("/api/student/{uuid}/fee/{record_id}/{fee_record_id}/{transaction_id}/cancel")
	 * @return Response
	 */
	public function cancelPayment($uuid, $record_id, $fee_record_id, $transaction_id) {
		$this->authorize('cancelPayment', StudentRecord::class);

		$student_record = $this->repo->findByUuidOrFail($uuid, $record_id);

		request()->validate([
			'cancellation_remarks' => 'required|min:20',
		]);

		$params = $this->request->all();

		$this->repo->cancelPayment($student_record, $fee_record_id, $transaction_id, $params);

		return $this->success(['message' => trans('finance.fee_payment_cancelled')]);
	}

	/**
	 * Used to update student record
	 * @get ("/api/student/{uuid}/record/{record_id}")
	 * @return Response
	 */
	public function updateRecord(RecordUpdateRequest $request, $uuid, $record_id) {
		$this->authorize('update', StudentRecord::class);

		$student_record = $this->repo->findByUuidOrFail($uuid, $record_id);

		$this->repo->updateRecord($student_record, $this->request->all());

		return $this->success(['message' => trans('student.updated')]);
	}

	/**
	 * Used to get id card pre requisite
	 * @get ("/api/student/id-card/pre-requisite")
	 * @return Response
	 */
	public function idCardPreRequisite() {
		$this->authorize('idCard', StudentRecord::class);

		return $this->success($this->repo->getIdCardPreRequisite());
	}

	/**
	 * Used to generate id card
	 * @get ("/student/id-card/{batch_id}")
	 * @return Response
	 */
	public function generateIdCard() {
		$this->authorize('idCard', StudentRecord::class);

		if (!request('id_card_template_id') || !request('batch_id')) {
			return $this->error(['message' => trans('general.missing_parameter')]);
		}

		$data = $this->repo->fetchBatchWiseStudent(['batch_id' => request('batch_id')]);

		$id_card_template = $this->repo->validateIdCardTemplate(request('id_card_template_id'));

		$data['id_card_template'] = $id_card_template;

		return view()->first(['custom-print.student.id-card', 'print.student.id-card'], $data);
	}

	/**
	 * Used to get roll number pre requisite
	 * @get ("/api/student/roll/number/pre-requisite")
	 * @return Response
	 */
	public function rollNumberPreRequisite() {
		$this->authorize('rollNumber', StudentRecord::class);

		return $this->success($this->repo->getRollNumberPreRequisite());
	}

	/**
	 * Used to fetch students for given batch
	 * @post ("/api/student/fetch")
	 * @return Response
	 */
	public function fetchBatchWiseStudent() {
		return $this->success($this->repo->fetchBatchWiseStudent($this->request->all()));
	}

	/**
	 * Used to store roll number
	 * @post ("/api/student/roll/number")
	 * @return Response
	 */
	public function storeRollNumber() {
		$this->authorize('rollNumber', StudentRecord::class);

		$this->repo->storeRollNumber($this->request->all());

		return $this->success(['message' => trans('student.roll_number_updated')]);
	}
}
