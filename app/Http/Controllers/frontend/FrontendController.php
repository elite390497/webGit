<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Repositories\Frontend\FrontendRepository;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FrontendController extends Controller {
	protected $request;
	protected $repo;
	protected $upload;

	/**
	 * Instantiate a new controller instance.
	 *
	 * @return void
	 */
	public function __construct(
		Request $request,
		FrontendRepository $repo,
		UploadRepository $upload
	) {
		$this->request = $request;
		$this->repo = $repo;
		$this->upload = $upload;
	}

	/**
	 * Used to get menu list for frontend
	 * @get ("/api/frontend/menu/list")
	 * @return Response
	 */
	public function listMenu() {
		$menus = $this->repo->listMenu();

		return $this->success(compact('menus'));
	}

	/**
	 * Used to get Page content
	 * @get ("/api/frontend/page/{slug}/content")
	 * @param ({
	 *      @Parameter("slug", type="string", required="true", description="Slug of Menu"),
	 * })
	 * @return Response
	 */
	public function getContent($slug) {
		$page = $this->repo->getPageContent($slug);

		$events = ($slug == 'home') ? $this->repo->listEvent() : [];

		$blocks = ($page->getOption('show_blocks')) ? $this->repo->listBlock() : [];

		$articles = ($page->getOption('show_latest_articles')) ? $this->repo->listArticle() : [];

		$attachments = $this->upload->getAttachment('frontend-page', $page->id);

		return $this->success(compact('page', 'attachments', 'events', 'blocks', 'articles'));
	}

	/**
	 * Used to get Block for frontend
	 */
	public function getBlock($uuid) {
		$block = $this->repo->getBlock($uuid);

		$attachments = $this->upload->getAttachment('frontend-block', $block->id);

		return $this->success(compact('block', 'attachments'));
	}

	/**
	 * Used to list Articles for frontend
	 */
	public function listArticle() {
		$articles = $this->repo->paginateArticle($this->request->all());

		$article_types = $this->repo->listArticleTypes();

		return $this->success(compact('articles', 'article_types'));
	}

	/**
	 * Used to get Article for frontend
	 */
	public function getArticle($uuid) {
		$article = $this->repo->getArticle($uuid);

		$attachments = $this->upload->getAttachment('article', $article->id);

		return $this->success(compact('article', 'attachments'));
	}

	/**
	 * Used to list Events for frontend
	 */
	public function listEvent() {
		$events = $this->repo->paginateEvent($this->request->all());

		return $this->success(compact('events'));
	}

	/**
	 * Used to get Event for frontend
	 */
	public function getEvent($uuid) {
		$event = $this->repo->getEvent($uuid);

		$attachments = $this->upload->getAttachment('event', $event->id);

		return $this->success(compact('event', 'attachments'));
	}

	/**
	 * Used to get Teacher list for frontend
	 */
	public function listTeacher() {
		return $this->success($this->repo->listTeacher());
	}

	/**
	 * Used to get Calendar event list for frontend
	 */
	public function getCalendarEvent() {
		return $this->success($this->repo->getCalendarEvent());
	}

	/**
	 * Get online registration pre requisite
	 * @return array
	 */
	public function getOnlineRegistrationPreRequisite() {
		return $this->success($this->repo->getOnlineRegistrationPreRequisite());
	}
}
