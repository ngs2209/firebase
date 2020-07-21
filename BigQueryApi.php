<?php
require __DIR__ . '/vendor/autoload.php';

$path=__DIR__ .'/pregnancy-my-a26ad61697f0.json';

putenv('GOOGLE_APPLICATION_CREDENTIALS='.$path);

use Google\Cloud\BigQuery\BigQueryClient;

class BigQueryApi{

	private $bigQuery;

	function __construct() {
		$argv = array( "service_account",
		"mamanet-pregnancy-my",
		);
		// get the project ID as the first argument
		if (2 != count($argv)) {
			die("Usage: php stackoverflow.php YOUR_PROJECT_ID\n");
		}
		//echo "<pre>";print_r($argv);exit;

		$projectId = $argv[1];
		$this->bigQuery = new BigQueryClient([
			'projectId' => $projectId,
		]);
	}


	function runBigQuery($query){
		$queryJobConfig = $this->bigQuery->query($query);
		$queryResults = $this->bigQuery->runQuery($queryJobConfig);

		$resultArray=[];

		if ($queryResults->isComplete()) {

			$i = 0;
			$rows = $queryResults->rows();

			foreach ($rows as $row) {
				array_push($resultArray,$row);
			}
			
		} else {
			throw new Exception('The query failed to complete');
		}

		return $resultArray;
	}

	function getLikes($from_date=null,$to_date=null){
		$query = "SELECT * from `mamanet-pregnancy-my.analytics_201825153.events_*` WHERE event_name = 'article_like_and_dislike' AND REGEXP_EXTRACT(_TABLE_SUFFIX, r'[0-9]+')  BETWEEN '$from_date' AND '$to_date'";

		return $this->runBigQuery($query);
	}

	function getShares($from_date=null,$to_date=null){
		// $query = "SELECT event_name, param from `mamanet-pregnancy-my.analytics_201825153.events_*`, UNNEST(event_params) AS param WHERE event_name = 'screen_view' AND  (param.key = 'firebase_screen' OR param.key = 'firebase_previous_id' OR param.key = 'firebase_screen_class' OR param.key = 'firebase_previous_screen') AND _TABLE_SUFFIX BETWEEN '20200504' AND '20200507' limit 10";

		$query = "SELECT * from `mamanet-pregnancy-my.analytics_201825153.events_*` WHERE event_name = 'share' AND REGEXP_EXTRACT(_TABLE_SUFFIX, r'[0-9]+') BETWEEN '$from_date' AND '$to_date'";




		return $this->runBigQuery($query);
	}
}



function group_by($key, $data) {
    $result = array();

    foreach($data as $val) {
        if(array_key_exists($key, $val)){
            $result[$val[$key]][] = $val;
        }else{
            $result[""][] = $val;
        }
    }

    return $result;
}

$bigQueryApi = new BigQueryApi();

$getActionName=$fromDate=$toDate='';

if(isset($_GET['action'])){
	$getActionName=$_GET['action'];
}

if(isset($_GET['fromDate'])){
	$fromDate=date('Ymd',strtotime($_GET['fromDate']))  ;
}

if(isset($_GET['toDate'])){
	$toDate=date('Ymd',strtotime($_GET['toDate']));
}

$result=[];

//call based on action names
if(!empty($getActionName)){
	if($getActionName == 'likes'){
		$result=$bigQueryApi->getLikes($fromDate,$toDate);
	}else if($getActionName == 'shares'){
		$result=$bigQueryApi->getShares($fromDate,$toDate);
	}else{
		
	}
}


//echo "<pre>";print_r($result);exit;


$array1=[];

foreach ($result as $key => $value) {
$array2=[];
	foreach ($value['event_params']  as $key1 => $value1) {
		$array2[$value1['key']]= ($value1['value']['string_value'])?$value1['value']['string_value']:$value1['value']['int_value'];
	}
	
$array1[]=$array2;
}


//echo "<pre>";print_r($array1);


$temp_array=[];

$groupedArray=group_by('articleId',$array1);
$i=0;


foreach ($groupedArray as $key => $value) {
	$temp_array[$i]['articleId']=$value[0]['articleId'];
		
$temp_array[$i]['category']='';
$catArray=[];

foreach ($value as $key1 => $value1) {
	if(isset($value1['category'])){
		if (!in_array($value1['category'], $catArray))
		{
			array_push($catArray,$value1['category']);	
		}
	}
}
$temp_array[$i]['category'].=implode(",",$catArray);

$temp_array[$i]['subcategory']='';

		$subcatArray=[];

		foreach ($value as $key1 => $value1) {
			if(isset($value1['subcategory1'])){
				if (!in_array($value1['subcategory1'], $subcatArray))
				{
					array_push($subcatArray,$value1['subcategory1']);	
				}
			}
		}
$temp_array[$i]['subcategory'].=implode(",",$subcatArray);

if(isset($value[0]['articleTitle'])){
	$temp_array[$i]['articleTitle']=$value[0]['articleTitle'];
}
if(isset($value[0]['articleTtitle'])){
	$temp_array[$i]['articleTitle']=$value[0]['articleTtitle'];
}

//check the action if shares then take count

if($_GET['action'] == 'shares'){
	
	$temp_array[$i]['count']=count($value);
}else if($_GET['action'] == 'likes'){
	$temp_array[$i]['stage']=$value[0]['stage'];
	$temp_array[$i]['isLike']=$value[0]['isLike'];
	$likeGroupedArray=group_by('isLike',$value);

	$temp_array[$i]['likedCount']=0;
	$temp_array[$i]['disLikeCount']=0;

	if(isset($likeGroupedArray['true'])){
		$temp_array[$i]['likedCount']=count($likeGroupedArray['true']);
	}

	if(isset($likeGroupedArray['false'])){
		$temp_array[$i]['disLikeCount']=count($likeGroupedArray['false']);
	}

	
}

	$i++;
}

//echo "<pre>";print_r($temp_array);exit;

$responseArray=[
	'aaData'=>$temp_array,
	'iTotalRecords'=>count($temp_array),
	'iTotalDisplayRecords'=>count($temp_array)
];

print_r(json_encode($responseArray));exit;
?>