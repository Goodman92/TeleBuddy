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

	// TEE ERROR HANDLER
	class CustomerController extends Controller {

		private $lockDown;
		public function __construct() {
			$this->middleware('jwt.auth', ['except' => ['login']]);
		}

		public function index($floor = null, $ceil = null) {
			$companies = Company::with('contactDetails')
								->with('businesslines')
								->has('contactDetails');
			$count = $companies->count();
			$companies = $companies->offset($floor)->limit($ceil)->get();
			$result = array(
				'active' => $count,
				'companies' => $companies
			);

			return response()->json($result, 200);
		}

		public function getCities() {
			$cities = Company::select('city')
								->orderBy('city', 'asc')
								->distinct()
								->get();
			$result = array(
				'cities' => $cities
			);
			return response()->json($result, 200);	
		}

		public function getLines() {
			$lines = BusinessLines::select('name', 'id')
									->orderBy('name', 'asc')
									->get();
			$result = array(
				'lines' => $lines
			);
			return response()->json($result, 200);
		}

		public function getCustomCompanies(Request $request, $floor = null, $ceil = null) {
			$parameters = $request->only('lines_', 'cities_');
			$companies = Company::with('contactDetails')
								->with('businesslines')
								->has('contactDetails');

			$companies = $this->customWhereInEmpty($companies, $parameters['cities_'], 'city');
			$companies = $this->customWhereInEmpty($companies, $parameters['lines_'], 'businessLine');

			$count = $companies->count();
			$companies = $companies->offset($floor)->limit($ceil)->get();

			$result = array(
				'companies' => $companies,
				'active' => $count
			);

			return response()->json($result, 200);
		}

		public function getDetails() {
			$companyCount = Company::with('contactDetails')
									->with('businessLines')
									->has('contactDetails')
									->count();
			$lineCount = BusinessLines::count();

			$customerCount = Company::onlyTrashed()->count();
			$previousUpdate = "16-02-2017";
			$result = array(
				'companies' => $companyCount,
				'lines' => $lineCount,
				'customers' => $customerCount,
				'updated' => $previousUpdate
			);

			return response()->json($result, 200);

		}

		public function getList(Request $request) {


			$parameters = $request->only('listSize', 'visibilities', 'lines', 'cities');
			$size = $parameters['listSize'];
			$visibilities = empty($parameters['visibilities']) ? 2 : $parameters['visibilities'];

			$companies = Company::with('contactDetails')
									->with('businesslines')
									->with('visibilities')
									->has('contactDetails');

			$companies = $this->customWhereInEmpty($companies, $parameters['cities'], 'city');
			$companies = $this->customWhereInEmpty($companies, $parameters['lines'], 'businessLine');
			$companies = $companies->has('visibilities', '>=', $visibilities)->inRandomOrder()
										->limit($size)->get()->toArray();


			/* VAIHTOEHTOINEN JOINILLA
			$companies = $companies->leftJoin('company_visibility', 'companies.id', '=', 'company_visibility.company_id')
			->groupBy('company_visibility.company_id')
			->havingRaw('COUNT(company_visibility.companComy_id) > '.$visibilities)->limit($size)->get();
			*/

				
			$xml = $this->generateExcelFile($companies);

			$result = array(
					'data' => $xml
				);

			foreach($companies as $key => $value) {
				Company::find($value['id'])->delete();
			}
				
			return response()->json($result, 200);

		}

		private function generateExcelFile($rows) {

			//MOCK 
			$configuration = array("name" => "Nimi", "businessId" => "Y-tunnus", "businesslines" => array("name" => "Toimiala"), "city" => "Kaupunki", "contact_details" => array("matkapuhelin" => "matkapuhelin", "puhelin" => "puhelin"), "visibilities" => array(array("name")));

			$excelParser = new ExcelParser($configuration, $rows);

			return $excelParser->getExcelXML()->asXML();

		}

		private function customWhereInEmpty(Eloquent\Builder $eloquent, $haystack, $needle) {
			if(!empty($haystack))
				$eloquent = $eloquent->whereIn($needle, $haystack);
			return $eloquent;
		}


	}