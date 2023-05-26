<?php
namespace App\Repositories\Frontend;

use App\Models\Post\Article;
use App\Models\Frontend\Menu;
use App\Models\Calendar\Event;
use App\Models\Frontend\Block;
use App\Models\Calendar\Holiday;
use App\Models\Employee\Employee;
use App\Models\Academic\AcademicSession;
use App\Models\Configuration\Post\ArticleType;
use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Employee\Designation;
use App\Repositories\Configuration\CustomFieldRepository;
use App\Repositories\Configuration\Academic\CourseGroupRepository;

class FrontendRepository {
	protected $article_type;
	protected $menu;
	protected $page;
	protected $block;
	protected $article;
	protected $event;
	protected $designation;
	protected $employee;
	protected $holiday;
	protected $academic_session;
	protected $course_group;
	protected $custom_field;

	/**
	 * Instantiate a new instance.
	 *
	 * @return void
	 */
	public function __construct(
		ArticleType $article_type,
		Menu $menu,
		Block $block,
		Article $article,
		Event $event,
		Designation $designation,
		Employee $employee,
		Holiday $holiday,
		AcademicSession $academic_session,
		CourseGroupRepository $course_group,
		CustomFieldRepository $custom_field
	) {
		$this->article_type = $article_type;
		$this->menu = $menu;
		$this->block = $block;
		$this->article = $article;
		$this->event = $event;
		$this->designation = $designation;
		$this->employee = $employee;
		$this->holiday = $holiday;
		$this->academic_session = $academic_session;
		$this->course_group = $course_group;
		$this->custom_field = $custom_field;
	}

	/**
	 * Get all menu list ordered by position.
	 *
	 * @return Menu
	 */
	public function listMenu() {
		return $this->menu->info()->mainMenu()->headerOrFooterMenu()->orderBy('position', 'asc')->get();
	}

	/**
	 * Find page with given slug or throw an error.
	 *
	 * @param string $slug
	 * @return Page
	 */
	public function getPageContent($slug, $field = 'message') {
		$menu = $this->menu->filterBySlug($slug)->first();

		if (!$menu) {
			throw ValidationException::withMessages([$field => trans('frontend.could_not_find_page')]);
		}

		$page = $menu->Page;

		if (!$page || optional($page)->is_draft) {
			throw ValidationException::withMessages([$field => trans('frontend.could_not_find_page')]);
		}

		return $page;
	}

	/**
	 * Get all block list order by position
	 *
	 * @return Block
	 */
	public function listBlock() {
		return $this->block->info()->filterByIsDraft(0)->orderBy('position', 'asc')->get();
	}

	/**
	 * Get block.
	 *
	 * @return Block
	 */
	public function getBlock($uuid) {
		$block = $this->block->filterByUuid($uuid)->filterByIsDraft(0)->first();

		if (!$block) {
			throw ValidationException::withMessages(['message' => trans('post.could_not_find_block')]);
		}

		return $block;
	}

	/**
	 * Get article list.
	 *
	 * @return Array
	 */
	public function paginateArticle($params = array()) {
		$page_length = gv($params, 'page_length', config('config.page_length'));
		$article_type_id = gv($params, 'article_type_id');

		return $this->article->with(['user:id', 'user.employee:id,user_id,first_name,middle_name,last_name,photo', 'user.employee.employeeDesignations:id,employee_id,designation_id,date_effective,date_end', 'user.employee.employeeDesignations.designation:id,name,employee_category_id', 'user.employee.employeeDesignations.designation.employeeCategory:id,name', 'articleType'])->filterByArticleTypeId($article_type_id)->filterByPublic()->orderBy('date_of_article', 'desc')->paginate($page_length);
	}

	/**
	 * Get article type list.
	 *
	 * @return Array
	 */
	public function listArticleTypes() {
		return $this->article_type->all()->pluck('name', 'id')->all();
	}

	/**
	 * Get article list.
	 *
	 * @return Array
	 */
	public function listArticle() {
		$article_types = $this->article_type->get();

		$articles = array();

		foreach ($article_types as $article_type) {
			$articles[$article_type->name] = $this->article->with('articleType')->filterByArticleTypeId($article_type->id)->filterByPublic()->latest()->take(5)->get();
		}

		return $articles;
	}

	/**
	 * Get article.
	 *
	 * @return Article
	 */
	public function getArticle($uuid) {
		// $page = $this->getPageContent('articles');

		$article = $this->article->with(['user:id', 'user.employee:id,user_id,first_name,middle_name,last_name,photo', 'user.employee.employeeDesignations:id,employee_id,designation_id,date_effective,date_end', 'user.employee.employeeDesignations.designation:id,name,employee_category_id', 'user.employee.employeeDesignations.designation.employeeCategory:id,name', 'articleType'])->filterByUuid($uuid)->filterByPublic()->first();

		if (!$article) {
			throw ValidationException::withMessages(['message' => trans('post.could_not_find_article')]);
		}

		return $article;
	}

	/**
	 * Get event list.
	 *
	 * @return Event
	 */
	public function listEvent() {
		return $this->event->with('eventType')->filterByAudience('everyone')->upcomingAndLive()->orderBy('start_date','asc')->take(5)->get();
	}

	/**
	 * Get event list.
	 *
	 * @return Array
	 */
	public function paginateEvent($params = array()) {
		$page_length = gv($params, 'page_length', config('config.page_length'));

		return $this->event->with('eventType')->upcomingAndLive()->orderBy('start_date', 'asc')->paginate($page_length);
	}

	/**
	 * Get event.
	 *
	 * @return Event
	 */
	public function getEvent($uuid) {
		// $page = $this->getPageContent('events');

		$query = $this->event->info()->filterByUuid($uuid)->upcomingAndLive();

		if (!\Auth::check()) {
			$query->filterByAudience('everyone');
		}

		$event = $query->first();

		if (!$event) {
			throw ValidationException::withMessages(['message' => trans('calendar.could_not_find_event')]);
		}

		return $event;
	}

	/**
	 * Get teacher list.
	 *
	 * @return Employee
	 */
	public function listTeacher() {
		$page = $this->getPageContent('teachers');

		$designations = $this->designation->filterByIsTeachingEmployee(1)->get();

		$columns = ['id', 'first_name', 'middle_name', 'last_name', 'photo'];

		if (config('config.show_teacher_contact_number')) {
			array_push($columns, 'contact_number');
		}

		if (config('config.show_teacher_email')) {
			array_push($columns, 'email');
		}

		$teachers = array();
		foreach ($designations as $designation) {
			$query = $this->employee->select($columns)->with('employeeDesignations:id,employee_id,designation_id,date_effective,date_end', 'employeeDesignations.designation:id,name,employee_category_id', 'employeeDesignations.designation.employeeCategory:id,name', 'employeeTerms:id,date_of_joining,employee_id');

			$query->whereHas('employeeDesignations', function ($q) use ($designation) {
				$q->where('date_effective', '<=', date('Y-m-d'))->where(function ($q1) {
					$q1->where('date_end', '=', null)->orWhere(function ($q2) {
						$q2->where('date_end', '!=', null)->where('date_end', '>=', date('Y-m-d'));
					});
				})->where('designation_id', $designation->id);
			});

			$teachers[$designation->name] = $query->get();
		}

		return compact('teachers');
	}

	/**
	 * Get calendar event list.
	 *
	 * @return Array
	 */
	public function getCalendarEvent() {
		$holidays = $this->holiday->all();

		$events = $this->event->filterByAudience('everyone')->get();

		return compact('holidays', 'events');
	}

	/**
	 * Get online registration pre requisite
	 * @return array
	 */
	public function getOnlineRegistrationPreRequisite() {
		$academic_session = $this->academic_session->whereIsDefault(1)->first();

		$list = getVar('list');
		$genders = generateTranslatedSelectOption(isset($list['gender']) ? $list['gender'] : []);
		$guardian_relations = generateTranslatedSelectOption(isset($list['relations']) ? $list['relations'] : []);

		if (!$academic_session) {
			$courses = array();
			return compact('courses', 'genders','guardian_relations');
		}

		$courses = $this->course_group->getCourseOptionWithDetail($academic_session->id);

        $custom_fields = $this->custom_field->listAllByForm('student_online_registration');

		return compact('courses', 'genders', 'custom_fields', 'guardian_relations');
	}
}
