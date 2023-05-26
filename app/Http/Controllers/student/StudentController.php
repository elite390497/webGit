<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Exports\Student\ExportStudents;
use Maatwebsite\Excel\Facades\Excel;
use App\Http\Requests\Student\StudentRequest;
use App\Http\Requests\Student\UserLoginRequest;
use App\Models\Student\Student;
use App\Models\Student\StudentRecord;
use App\Repositories\Student\StudentRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StudentController extends Controller {
	protected $request;
	protected $repo;

	/**
	 * Instantiate a new controller instance.
	 *
	 * @return void
	 */
	public function __construct(
		Request $request,
		StudentRepository $repo
	) {
		$this->request = $request;
		$this->repo = $repo;

		$this->middleware('prohibited.test.mode')->only(['updateUserLogin']);
	}

	/**
	 * Used to get pre requisites
	 * @get ("/api/student/pre-requisite")
	 * @return Response
	 */
	public function preRequisite() {
		$this->authorize('preRequisite', Student::class);

		return $this->success($this->repo->getPreRequisite());
	}

	/**
	 * Used to get all Students
	 * @get ("/api/student")
	 * @return Response
	 */
	public function index() {
		$this->authorize('list', StudentRecord::class);

        if (request('action') == 'excel') {
            $student_records = $this->repo->paginate($this->request->all());

            return Excel::download(new ExportStudents($student_records), 'Students.xlsx');
        }

		$student_records = $this->repo->paginate($this->request->all());

		$filters = $this->repo->getFilters();

		return $this->success(compact('student_records', 'filters'));
	}

	/**
	 * Used to print all Admissions
	 * @post ("/api/students/print")
	 * @return Response
	 */
	public function print() {
		$this->authorize('list', StudentRecord::class);

		$student_records = $this->repo->print(request('filter'));

		$filter = request('filter');

		return view('print.student.admission', compact('student_records', 'filter'))->render();
	}

	/**
	 * Used to generate pdf all Admissions
	 * @post ("/api/students/pdf")
	 * @return Response
	 */
	public function pdf() {
		$this->authorize('list', StudentRecord::class);

		$student_records = $this->repo->print(request('filter'));

		$filter = request('filter');

		$uuid = Str::uuid();
		$pdf = \PDF::loadView('print.student.admission', compact('student_records', 'filter'))->save('../storage/app/downloads/' . $uuid . '.pdf');

		return $uuid;
	}

	/**
	 * Used to get Student detail
	 * @get ("/api/student/{uuid}")
	 * @param ({
	 *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student"),
	 * })
	 * @return Response
	 */
	public function show($uuid) {
		$this->authorize('show', Student::class);

		$student = $this->repo->findByUuidOrFail($uuid);

		$student->load(['studentRecords' => function ($q) {
			$q->orderBy('date_of_entry', 'desc');
		}, 'studentRecords.batch', 'studentRecords.batch.course', 'parent', 'studentRecords.admission', 'studentRecords.academicSession', 'user', 'parent.user']);

		return $this->ok($student);
	}

	/**
	 * Used to update student's detail
	 * @patch ("/api/student/{uuid}")
	 * @param ({
	 *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student")
	 * })
	 * @return Response
	 */
	public function update(StudentRequest $request, $uuid) {
		$this->authorize('update', Student::class);

		$student = $this->repo->findByUuidOrFail($uuid);

		$student = $this->repo->update($student, $this->request->all());

		return $this->success(['message' => trans('student.updated')]);
	}

	/**
	 * Used to update student's parent
	 * @patch ("/api/student/{uuid}/parent")
	 * @param ({
	 *      @Parameter("uuid", type="string", required="true", description="Unique Id of Student")
	 * })
	 * @return Response
	 */
	public function updateParent(Request $request, $uuid) {
		$this->authorize('update', Student::class);

		request()->validate([
			'student_parent_id' => 'required',
		], [], [
			'student_parent_id' => trans('student.parent'),
		]);

		$student = $this->repo->findByUuidOrFail($uuid);

		$student = $this->repo->updateParentId($student, $this->request->all());

		return $this->success(['message' => trans('student.updated')]);
	}

	/**
	 * Used to update photo
	 * @post ("/api/student/{type}/photo/{uuid}")
	 * @param ({
	 *      @Parameter("uuid", type="integer", required="true", description="Unique Id of User"),
	 *      @Parameter("image", type="file", required="true", description="Image File to be uploaded"),
	 * })
	 * @return Response
	 */
	public function uploadPhoto($type, $uuid) {
		$this->authorize('update', Student::class);

		$student = $this->repo->findByUuidOrFail($uuid);

		if (!in_array($type, ['self', 'first-guardian', 'second-guardian'])) {
			return $this->error(['message' => trans('general.invalid_action')]);
		}

		if ($type == 'self') {
			$field = 'student_photo';
			$image = $student->student_photo;
		} elseif ($type == 'first-guardian') {
			$field = 'first_guardian_photo';
			$image = $student->Parent->first_guardian_photo;
		} elseif ($type == 'second-guardian') {
			$field = 'second_guardian_photo';
			$image = $student->Parent->second_guardian_photo;
		}

		$image = str_replace('storage/', '', $image);

		if ($image && \Storage::disk('public')->exists($image)) {
			\Storage::disk('public')->delete($image);
		}

		$file = \Storage::disk('public')->putFile('student-photo', request()->file('image'));
		$img = \Image::make(\Storage::disk('public')->get($file));
		$img->resize(null, 200, function ($constraint) {
			$constraint->aspectRatio();
		})->stream();
		\Storage::disk('public')->put($file, $img);

		if ($type == 'self') {
			$student->student_photo = 'storage/' . $file;
			$student->save();
		} elseif ($type == 'first-guardian') {
			$student->Parent->first_guardian_photo = 'storage/' . $file;
			$student->Parent->save();
		} elseif ($type == 'second-guardian') {
			$student->Parent->second_guardian_photo = 'storage/' . $file;
			$student->Parent->save();
		}

		return $this->success(['message' => trans('student.photo_uploaded'), 'image' => 'storage/' . $file]);
	}

	/**
	 * Used to remove photo
	 * @delete ("/api/student/{type}/photo/remove/{uuid}")
	 * @param ({
	 *      @Parameter("uuid", type="string", required="true", description="Unique Id of User"),
	 * })
	 * @return Response
	 */
	public function removePhoto($type, $uuid) {
		$this->authorize('update', Student::class);

		$student = $this->repo->findByUuidOrFail($uuid);

		if (!in_array($type, ['self', 'first-guardian', 'second-guardian'])) {
			return $this->error(['message' => trans('general.invalid_action')]);
		}

		if ($type == 'self') {
			$field = 'student_photo';
			$image = $student->student_photo;
		} elseif ($type == 'first-guardian') {
			$field = 'first_guardian_photo';
			$image = $student->Parent->first_guardian_photo;
		} elseif ($type == 'second-guardian') {
			$field = 'second_guardian_photo';
			$image = $student->Parent->second_guardian_photo;
		}

		$image = str_replace('storage/', '', $image);

		if (!$image) {
			return $this->error(['message' => trans('student.no_photo_uploaded')]);
		}

		if (\Storage::disk('public')->exists($image)) {
			\Storage::disk('public')->delete($image);
		}

		if ($type == 'self') {
			$student->student_photo = null;
			$student->save();
		} elseif ($type == 'first-guardian') {
			$student->Parent->first_guardian_photo = null;
			$student->Parent->save();
		} elseif ($type == 'second-guardian') {
			$student->Parent->second_guardian_photo = null;
			$student->Parent->save();
		}

		$student->save();

		return $this->success(['message' => trans('student.photo_removed')]);
	}

	/**
	 * Used to update user login for student and parent
	 * @patch ("/api/student/{uuid}/user/login")
	 * @param ({
	 *      @Parameter("uuid", type="string", required="true", description="Unique Id of User"),
	 * })
	 * @return Response
	 */
	public function updateUserLogin(UserLoginRequest $request, $uuid) {
		$this->authorize('updateUserLogin', Student::class);

		$student = $this->repo->findByUuidOrFail($uuid);

		$student = $this->repo->updateUserLogin($student, $this->request->all());

		return $this->success(['message' => trans('student.updated')]);
	}

	/**
	 * Used to get siblings
	 * @patch ("/api/student/{uuid}/sibling")
	 * @param ({
	 *      @Parameter("uuid", type="string", required="true", description="Unique Id of User"),
	 * })
	 * @return Response
	 */
	public function sibling($uuid) {
		$this->authorize('list', Student::class);

		$student = $this->repo->findByUuidOrFail($uuid);

		$parent = $student->Parent;

		$parent->load(['students' => function ($q) use ($student) {
			$q->where('id', '!=', $student->id);
		}, 'students.studentRecords', 'students.studentRecords.batch', 'students.studentRecords.batch.course', 'students.studentRecords.admission']);

		return $this->ok($parent);
	}

	/**
	 * Used to search student by name
	 * @post ("/api/student/search/name")
	 * @param ({
	 *      @Parameter("name", type="string", required="true", description="Name of Student"),
	 * })
	 * @return Response
	 */
	public function searchByName() {
		$this->authorize('search', Student::class);

		return $this->ok($this->repo->searchByName($this->request->all()));
	}

	/**
	 * Used to search student for registration
	 * @post ("/api/student/search/registration")
	 * @param ({
	 *      @Parameter("name", type="string", required="true", description="Name of Student"),
	 * })
	 * @return Response
	 */
	public function searchForRegistration() {
		$this->authorize('search', Student::class);

		return $this->ok($this->repo->searchForRegistration($this->request->all()));
	}

	/**
	 * Used to perform group action on students
	 * @post ("/api/student/group")
	 * @param ({
	 *      @Parameter("ids", type="array", required="true", description="Id of Students"),
	 *      @Parameter("student_group_id", type="integer", required="true", description="Id of Student Group"),
	 *      @Parameter("action", type="string", required="true", description="Action to Perform"),
	 * })
	 * @return Response
	 */
	public function groupAction() {
		$this->authorize('update', Student::class);

		$student = $this->repo->updateGroup($this->request->all());

		return $this->success(['message' => trans('student.updated')]);
	}
}
