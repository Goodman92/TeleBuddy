<?php
	namespace App\Http\Controllers\API;

	use App\Http\Controllers\Controller;
	use Illuminate\Foundation\Auth\AuthenticatesUsers;
	use Illuminate\Support\Facades\Log;
	use Illuminate\Http\Request;
	use Illuminate\Support\Facades\Response;
	use Illuminate\Database\Eloquent;
	use Illuminate\Support\Facades\File;

	use JWTAuth;
	use Tymon\JWTAuthExceptions\JWTAuthExceptions;

	use \App\Models\Company;
	use \App\Models\BusinessLines;


	class CustomerController extends Controller {

		public function __construct() {
			$this->middleware('jwt.auth', ['except' => ['login']]);
		}

		public function index($floor = null, $ceil = null) {
			Log::debug("get Customers");
			Log::debug($floor);
			Log::debug($ceil);

			$companies = Company::with('contactDetails')
								->with('businesslines')
								->has('contactDetails');
			$count = $companies->count();
			$companies = $companies->offset($floor)->limit($ceil)->get();
			$result = array(
				'active' => $count,
				'companies' => $companies
			);

			Log::debug("count ".$count);
			return response()->json($result, 200);
		}

		public function getCities() {
			Log::debug("cities");
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
			Log::debug("lines");
			$lines = BusinessLines::select('name', 'id')
									->orderBy('name', 'asc')
									->get();
			$result = array(
				'lines' => $lines
			);
			return response()->json($result, 200);
		}

		public function getCustomCompanies(Request $request, $floor = null, $ceil = null) {
			$parameters = $request->only('lines_', 'cities_', 'forms_');
			Log::debug("getCustomCompanies");
			Log::debug($floor);
			Log::debug($ceil);
			Log::debug($parameters);
			$companies = Company::with('contactDetails')
								->with('businesslines')
								->has('contactDetails');

			$companies = $this->customWhereInEmpty($companies, $parameters['forms_'], 'companyForm');
			$companies = $this->customWhereInEmpty($companies, $parameters['cities_'], 'city');
			$companies = $this->customWhereInEmpty($companies, $parameters['lines_'], 'businessLine');

			$count = $companies->count();
			$companies = $companies->offset($floor)->limit($ceil)->get();

			$result = array(
				'companies' => $companies,
				'active' => $count
			);

			Log::debug("total count ".$count);


			return response()->json($result, 200);
		}

		public function getDetails() {
			$companyCount = Company::with('contactDetails')
									->with('businessLines')
									->has('contactDetails')
									->count();
			$lineCount = BusinessLines::count();

			$customerCount = 0;
			$previousUpdate = "10-01-2017";
			$result = array(
				'companies' => $companyCount,
				'lines' => $lineCount,
				'customers' => $customerCount,
				'updated' => $previousUpdate
			);

			return response()->json($result, 200);

		}

		public function getList(Request $request) {
			Log::debug("tehää lista");
			$parameters = $request->only('listSize', 'visibilities', 'lines', 'cities', 'forms');
			$size = $parameters['listSize'];

			Log::debug($parameters);

			$companies = Company::with('contactDetails')
								->with('businesslines')
								->has('contactDetails');

			$companies = $this->customWhereInEmpty($companies, $parameters['forms'], 'companyForm');
			$companies = $this->customWhereInEmpty($companies, $parameters['cities'], 'city');
			$companies = $this->customWhereInEmpty($companies, $parameters['lines'], 'businessLine');
			$companies = $companies->limit($size)->get();



			Log::debug($companies);

			$this->generateExcelFile();


/*
			$response = Response::make($xml->asXML(), 200);

			$response->header('Cache-Control', 'public');
			$response->header('Content-Description', 'File Transfer');
			$response->header('Content-Transfer-Encoding', 'binary');
			//$response->header('Content-Type', 'application/pdf');
			//$response->header('Content-Type', 'text/xml');
			$response->header('Content-Type', 'application/force-download');
			//$response->header('Content-Type', 'application/octet-stream');
			//$response->header('Content-Type', 'application/download');
			$response->header('Content-Disposition', 'attachment; filename=test3.xml');

			Log::debug("lista valmis?");
*/			return null;
		}

		private function generateExcelFile() {

			$configuration = array("Nimi", "Y-tunnus", "Toimiala", "Kaupunki", "Puhelin", "Matkapuhelin", "Näkyvyydet");

			$excelXML = new \SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?>
													<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
															 xmlns:x="urn:schemas-microsoft-com:office:excel"
															 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
															 xmlns:html="http://www.w3.org/TR/REC-html40"></Workbook>');
			$workSheet = $excelXML->addChild('Worksheet');
			$workSheet->addAttribute("xmlns:ss:Name", 'Yrityslistaus');
			$table = $workSheet->addChild('Table');
			$column = $table->addChild('Column');

			$column->addAttribute("xmlns:ss:Index", '1');
			$column->addAttribute("xmlns:ss:AutoFitWidth", '0');
			$column->addAttribute("xmlns:ss:Width", '110');

			$row = $table->addChild('Row');
			
			foreach($configuration as $element) {
				$cell = $row->addChild('Cell');
				$data = $cell->addChild('Data', $element);
				$data->addAttribute("xmlns:ss:Type", "String");
			}

			$file= public_path(). "/tlp.xml";
			$excelXML->saveXML('tlp.xml');

		}

		private function customWhereInEmpty(Eloquent\Builder $eloquent, $haystack, $needle) {
			if(!empty($haystack))
				$eloquent = $eloquent->whereIn($needle, $haystack);
			return $eloquent;
		}

	}