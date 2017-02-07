<?php
	namespace App\Http\Controllers\API;

	use App\Http\Controllers\Controller;
	use Illuminate\Foundation\Auth\AuthenticatesUsers;
	use Illuminate\Support\Facades\Log;
	use Illuminate\Http\Request;
	use Illuminate\Support\Facades\Response;
	use Illuminate\Database\Eloquent;
	use Illuminate\Support\Facades\File;
	use Carbon\Carbon;

	use JWTAuth;
	use Tymon\JWTAuthExceptions\JWTAuthExceptions;

	use \App\Models\Company;
	use \App\Models\BusinessLines;
	use \App\Http\Controllers\Api\Utility\ExcelParser;


	class ClientController extends Controller {

		public function __construct() {
			$this->middleware('jwt.auth');
		}

		public function index() {
			$this->doRestoreCheck();
			$clients = $this->getTrashedClients();

			$result = array(
				'companies' => $clients
			);

			return response()->json($result, 200);
		}

		public function delete(Request $request) {
			$clients = $request->only('clients');

			foreach($clients['clients'] as $key => $value) {
				Company::withTrashed()->find($value['id'])->restore();
			}
		}

		private function doRestoreCheck() {
			$currentDate = Carbon::now();

			$clients = Company::onlyTrashed();

			foreach($clients->get()->toArray() as $key => $value) {
				$carbonStamp = Carbon::parse($value['deleted_at'])->addMonths(4);
				if($currentDate->gte($carbonStamp)) {
					Company::withTrashed()->find($value['id'])->restore();
				}
			}
		}

		public function add($id) {
			$client = Company::where('businessId', $id);
			$statusCode = 400;

			if(!$client->get()->isEmpty()) {
				$client->delete();
				$statusCode = 200;
			}

			$clients = $this->getTrashedClients();

			$result = array(
				'companies' => $clients
			);

			Log::debug($statusCode);

			return response()->json($result, $statusCode);

		}

		private function getTrashedClients() {
			$companies = Company::onlyTrashed()
								->with('contactDetails')
								->with('businesslines')
								->has('contactDetails');
			$count = $companies->count();
			$companies = $companies->get();

			return $companies;
		}

	}