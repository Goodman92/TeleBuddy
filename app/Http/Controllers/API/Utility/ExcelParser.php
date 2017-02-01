<?php
	namespace App\Http\Controllers\API\Utility;
	use Illuminate\Support\Facades\Log;

	class ExcelParser {

		private $rowNames;
		private $records;
		private $excelXML;

		public function __construct($rows = array(), $records_ = array()) {
			$this->rowNames = $rows;
			$this->records = $records_;
			$this->initializeExcelXML();
		}

		private function initializeExcelXML() {
			$this->excelXML  = new \SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?>
				<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
				xmlns:x="urn:schemas-microsoft-com:office:excel"
				xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
				xmlns:html="http://www.w3.org/TR/REC-html40"></Workbook>');
			$workSheet = $this->excelXML->addChild('Worksheet');
			$workSheet->addAttribute("xmlns:ss:Name", 'Yrityslistaus');
			$table = $workSheet->addChild('Table');
			$column = $table->addChild('Column');

			$column->addAttribute("xmlns:ss:Index", '1');
			$column->addAttribute("xmlns:ss:AutoFitWidth", '0');
			$column->addAttribute("xmlns:ss:Width", '110');


			$row = $table->addChild('Row');
			
			//GENERATE EXCEL COLUMN HEADERS
			foreach($this->rowNames as $key => $value) {
				if(is_array($value)) {
					foreach($value as $secondKey => $secondValue) {
						$cell = $row->addChild('Cell');
						$data = $cell->addChild('Data', $secondKey);
						$data->addAttribute("xmlns:ss:Type", "String");					
					}
				} else {
					$cell = $row->addChild('Cell');
					$data = $cell->addChild('Data', $value);
					$data->addAttribute("xmlns:ss:Type", "String");
				}
			}

			//GENERATE EXCEL COLUMN RECORDS, RECORDS CAN CONTAINT ARRAYS
			foreach($this->records as $key => $value) {
				$row = $table->addChild('Row');
				foreach($this->rowNames as $configKey => $configValue) {
					$conf = $this->recursiveArrayTraverse($configValue, $value[$configKey]);
					$this->generateCellsFromArray($conf, $row);
				}
			}

		}
		public function getExcelXML() {
			return $this->excelXML;
		}

		private function recursiveArrayTraverse($suspect, $record) {
			$res = array();
			if(is_array($suspect)) {
				foreach($suspect as $key => $value) {
					$suspect = $this->recursiveArrayTraverse($key, $record);
					if(is_array($record[$key])) {
						for($i = 0; $i < count($record); $i++) {
							array_push($res, $record[$i][$value[$key]]); 
						}
						return $res;
					}
					array_push($res, $record[$key]); 
				}
				return $res;
			}
			array_push($res, $record);
			return $res;
		}

		private function generateCellsFromArray($record, $row) {
			foreach($record as $key => $value) {
				$cell = $row->addChild('Cell');
				$data = $cell->addChild('Data', htmlspecialchars($value));
				$data->addAttribute("xmlns:ss:Type", "String");		
			}
		}

	}