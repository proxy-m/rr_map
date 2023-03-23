<?php
session_start();

$_REQUEST = $_POST + $_GET; // Приоритет значений POST над GET, без COOKIE, чтобы избежать двузначности конфигурации сервера.

global $in;
$in = array('email', 'login', 'pass', 'key'=>'string',
	'id'=>'integer', 'uid'=>'string', 'tz',
	'aresIDS'=>'array', 'listIDS'=>'array', 'senderResumeDate'=>'integer', 'senderTimeInterval'=>'integer', 
    'topic'=>'string', 'field'=>'string', 'where'=>'string', 'limit'=>'integer',
	'attribute', 'active', 'encoding'=>'string', 'format', 'g-recaptcha-response',
); // разрешенные входные параметры

/**
 * Соединение с БД
 */
function connect () {
	$db_host		= "localhost";
//	$db_port		= 3307; // optional
//	$db_user		= "root";
//	$db_password	= "";
//	$db_dname	= "sendy";
	
	try {
		///$connectConfig = "mysql:host=$db_host;dbname=$db_dname" . (isset($db_port) && $db_port > 0 ? ";port=$db_port" : "");
        $connectConfig = "sqlite:./data/raundrank0.sqlite" . (isset($db_port) && $db_port > 0 ? ";port=$db_port" : "");
		$db = new PDO($connectConfig); ///, $db_user, $db_password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8") );
		$db2 = null;
//		try {
//			if (startsWith($connectConfig, "mysql:")) {
//				$db2 = new mysqli("$db_host", $db_user, $db_password, "$db_dname", $db_port);
//			}
//		} catch (Exception $e2) {
//		}
		//if(DEBUG) 
		$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
		//else $db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
		$GLOBALS['db'] = $db;
		$GLOBALS['db2'] = $db2;
	} catch (PDOException $e) {
		echo ($e->getMessage());
	}
	///PreExecSQL("SET @@lc_time_names='ru_RU'",array());
}

define('KEY', 'tk34hdrfv');
define('DEBUG', true); // флаг разработки

define('EMAIL_REGEX', '^([a-zA-Z0-9_.+-])+@[a-zA-Z0-9-]+\.([a-zA-Z0-9-]{2,5}\.)?[a-zA-Z0-9-]{2,5}$'); // упрощенный e-mail regex
define('PHONE_REGEX', '((8|\+7)-?)?\(?\d{3,5}\)?-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}((-?\d{1})?-?\d{1})?'); // русский телефон regex

//Ошибки
if (DEBUG){
	error_reporting( E_ALL | E_STRICT );
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	ini_set('ignore_repeated_errors', 0);
//	ini_set('error_prepend_string', '<div id="php-error" class="php-error">');	
//	ini_set('error_append_string', '</div>');	
} else {
	error_reporting( E_ALL | E_STRICT );
	ini_set('display_errors', 0);
	ini_set('display_startup_errors', 0);
	ini_set('ignore_repeated_errors', 1);
//	ini_set('error_log', $_SERVER['DOCUMENT_ROOT'].'/PHP_errors.log');
}
ini_set('html_errors', 1);
ini_set('log_errors', 1);


function disConnect (){
	$GLOBALS['db'] = null;
	$GLOBALS['db2'] = null;
}

/**
 * Выполнение запроса к БД.
 * $sql запрос, который может содержать параметры (?)
 * $arr массив значений парметров (если они есть)
 * $logAndStop для возможности быстрого отладочного вывода запроса без xdebug [false - не выводить ничего, true - выводить запрос, null - выводить запрос и ответ]
 * Возвращает результат запроса SQL, если он есть.
 */
function PreExecSQL ($sql, $arr=array(), $logAndStop=false) {
	if(empty($sql)) return false;
    $good = false;
    try {
		$good = false;
		if (!startsWith(strtoupper(trim($sql)), 'DELIMITER ')) {
			$STH = $GLOBALS['db']->prepare($sql);
			$STH->execute($arr);
			if (($logAndStop || $logAndStop === null) && !$good) {
				vecho(array($arr, $sql));
				if ($logAndStop === null) {
					vecho('<br/>' . json_encode($STH->fetchall(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE));
					$STH->execute($arr); // предыдущий отладочный вывод может отчилаться, если содержимое базы менялось
				}
			}
			$good = true;
		} else {
			$STH = false;
		}
    } finally {
		/*if (!$good && !empty($GLOBALS['db2']) && method_exists($GLOBALS['db2'], 'multi_query') && method_exists($GLOBALS['db2'], 'real_escape_string')) {
			$STH = $GLOBALS['db2'];
			foreach ($arr as $x) {
				if (empty($x)) {
					if ($x === null || $x === false || $x === 0) {
						$sql = str_replace_first('?', '' . $x, $sql);
					} else {
						$sql = str_replace_first('?', '\'' . $x . '\'', $sql);
					}
				} else {
					if ($x === true || is_numeric($x)) {
						$sql = str_replace_first('?', '' . $x, $sql);
					} else if (is_array($x) || is_object($x)) {
						$sql = str_replace_first('?', '\'' . json_encode($x) . '\'', $sql);
					} else if (is_string($x)) {
						$sql = str_replace_first('?', '\'' . $STH->real_escape_string(''.$x) . '\'', $sql);
					} else {
						$sql = str_replace_first('?', '' . $x, $sql);
					}
				}			
			}
			if ($logAndStop || $logAndStop === null) {
				vecho(array($arr, $sql));
			}
			
			$STH->multi_query($sql);
			$good = true;
			$STH = $STH->use_result();
			if ($STH) {
				return $STH;
			} else {
				return false;
			}
		}*/
        if (($logAndStop || $logAndStop === null) && !$good) {
            vecho(array($arr, $sql));
        }
    }
	return $STH;
}

//function PreExecSQL_one ($sql, $arr=array(), $logAndStop=false) {
//    return (empty($sql) || !is_array($arr)) ? false : PreExecSQL($sql, $arr, $logAndStop)->fetch(PDO::FETCH_ASSOC);
//}

function PreExecSQL_all ($sql, $arr=array(), $logAndStop=false) {
	$STH = (empty($sql) || !is_array($arr)) ? false : PreExecSQL($sql, $arr, $logAndStop);
	if ($STH && method_exists($STH, 'fetchall')) { // pdo db
		return $STH->fetchall(PDO::FETCH_ASSOC);
	} else if ($STH && method_exists($STH, 'fetch_all')) { // mysqli db2
		///$STH = $STH->fetch_all();
		while ($result[] = $STH->fetch_assoc()) {}
		$STH->free();
		return $result;
	} else {
		return $STH;
	}
}

function ExecSQL ($sql) {
	if (empty($sql)) {
		return false;
	}
	$STH = $GLOBALS['db']->query($sql);
	return $STH;
}

function str_replace_first ($search, $replace, $subject) {
	$pos = strpos($subject, $search);
	if ($pos !== false) {
		return substr_replace($subject, $replace, $pos, strlen($search));
	}
	return $subject;
}

/**
 * Проверка на локальный запуск сервера.
 * (Можно использовать для отключения проверки капча/captcha.)
 */
function isLocal () {
	$client_ip0 = $_SERVER['REMOTE_ADDR'];
	return (($_SERVER['SERVER_NAME'] == 'localhost' || $_SERVER['SERVER_NAME'] == '127.0.0.1') && ($client_ip0 == '127.0.0.1' || $client_ip0 == '::1' || $_SERVER['SERVER_ADDR'] == $client_ip0));	
}

/**
 * Преобразование и фильтрация параметров для приёма с клиента
 * @param array $arr входные данные
 * @param array $in необходимые данные
 * @return array
 */
function fieldIn ($arr, $in) {
	$res = array();
	foreach ($in as $v => $type) {
		if (gettype($v) == 'integer') {
			$v = $type;
			unset($type);
		}
		if (!isset($arr["$v"])) {
			$res["$v"] = false;
			continue;
		}
		if (!isset($type)) {
			$type = autoType($arr["$v"]);
		}
		if ($type === 'array') {
			$arr["$v"] = strToArray($arr["$v"]);
		} else if ($type != 'string') {
			if ($type === 'integer' || $type === 'boolean') {
				if (empty($arr["$v"]) || ''.$arr["$v"] === 'false' || ''.$arr["$v"] === '' || $arr["$v"] === false) {
					$arr["$v"] = 0;
				} else if (''.$arr["$v"] === 'true' || $arr["$v"] === true){
					$arr["$v"] = 1;
				}
			}
			settype($arr["$v"], $type);	//преобразование типа
		} else {
			$arr["$v"] = htmlspecialchars_decode(str_replace('\\"', '"', $arr["$v"]));	//декодирование
		}
		$res["$v"] = $arr["$v"];
	}
	return $res;
}

function autoType (&$data) {
		if (gettype($data) == 'integer' || (string)((int)$data) == $data) { // for int
			$type = 'integer';
		} elseif (gettype($data) == 'double' || (string)((double)$data) == $data) { // for double, float, real
			$type = 'double';
		} else {
			$type = 'string';
		}
		return $type;	
}

function strToArray ($str, array $delimiters = array(',', ' ')) {
	if (empty($str) || is_array($str) || !is_string($str) || strlen(trim($str)) == 0) {
		return $str;
	}
	
	$strTest = $str;
	$strTest = str_replace(array_merge([',', ';', '.', ':', '!', '¡'], ['"', "'", '`'], [' ', '\t', '\r', '\n', '\v', '\xC2\xA0', '\xC2\xAD', '\xC2\xA0', '\xC2\x85', '\xE2\x80\xA8', '\xE2\x80\xA8'], $delimiters), ' ', $strTest); // удаление обычных разделителей, кроме скобок
	$strTest = strtolower(trim(preg_replace('/\s+/', '', $strTest)));
	if (startsWith($strTest, 'array(') && endsWith($strTest, ')')) { // для поддержки круглых скобок, помимо обычных квадратных для json
		$str = trim($str);
		$str = substr($str, strlen('array'));
		$str = trim($str);
		$str = substr($str, strlen('('), strlen($str) - 1 - strlen(')'));
		
		$strTest = $str;
		$strTest = str_replace(array_merge([',', ';', '.', ':', '!', '¡'], ['"', "'", '`'], [' ', '\t', '\r', '\n', '\v', '\xC2\xA0', '\xC2\xAD', '\xC2\xA0', '\xC2\x85', '\xE2\x80\xA8', '\xE2\x80\xA8'], $delimiters), ' ', $strTest); // удаление обычных разделителей, кроме скобок
		$strTest = strtolower(trim(preg_replace('/\s+/', '', $strTest)));
	}
	$delimiters = array_merge([], $delimiters);
	if (preg_match('/^[0-9]+$/', $strTest)) { // only digits, spaces and simple delimiters in $str		
		$str = trim($str);
		$was = false;
		$result = array();
		foreach ($delimiters as $i => $delim) {
			$resultNew = explode($delim, $str);
			if (count($resultNew) > 0 && endsWith($str, $delim)) {
				unset($resultNew[count($resultNew) - 1]);
			}
			if (count($resultNew) > 0 && startsWith($str, $delim)) {
				unset($resultNew[0]);
			}
			if (count($resultNew) > count($result)) {
				$result = $resultNew;
				$was = $i;
			}
		}
		
		if ($was === false) {
			return array($str);
		} else {
			unset($delimiters[$was]);
		}
		$result = array_values($result);
		foreach ($result as $i => $subStr) {
			$result[$i] = '' . $result[$i];
			$result[$i] = trim(str_replace($delimiters, '', $result[$i]));
			$type = autoType($result[$i]);
			if ($type != 'string') {
				settype($result[$i], $type);
			}
		}
		return $result;
	} else {
		$result = json_decode($str, true);
		return $result;
	}	
}

/**
 * Редирект
 */
function redirect ($url) {
	header('Location: http://'.$_SERVER['HTTP_HOST'].'/'.$url);
}

/**
 * Проверка, что строка $haystack начинается с $needle
 */
function startsWith ($haystack, $needle) {
    return substr_compare($haystack, $needle, 0, strlen($needle)) === 0;
}

/**
 * Проверка, что строка $haystack заканчивается на $needle
 */
function endsWith ($haystack, $needle) {
    return substr_compare($haystack, $needle, -strlen($needle)) === 0;
}

function decodeSimple ($str, $encoding) {
	if ($encoding) {
		$encoding = strtoupper($encoding);
	}
	if ($encoding === 'UTF8') {
		$encoding = 'UTF-8';
	} else if ($encoding === 'UCS-2') {
		$encoding = 'UCS-2BE';
	} else if ($encoding === 'CP1251' || $encoding === 'WINDOWS-1251') {
		$encoding = 'CP1251';
	}
		
	header('Access-Control-Allow-Origin: *');	
	if (!$encoding || $encoding == '' || !(startsWith($encoding, 'UTF-') || startsWith($encoding, 'UCS-') || $encoding ==='CP1251' || $encoding ==='KOI8-R')) {
		header('Content-Type: application/json; charset=' . ('UTF-8'));
		return $str;
	} else {
		header('Content-Type: application/json; charset=' . ($encoding ?? 'UTF-8'));
	}
	
	return preg_replace_callback('/\\\\u([0-9a-fA-F]{4})/', function ($match) use ($encoding) {
		try {
			return mb_convert_encoding(pack('H*', $match[1]), $encoding ?? 'UTF-8', 'UTF-16BE');
		} catch (Exception $e) {
			return mb_convert_encoding(pack('H*', $match[1]), $encoding ?? 'UTF-8', 'UCS-2BE');
		}
	}, $str);
}

function jsonToDebug ($jsonText = '') {
    $arr = json_decode($jsonText, true);
    $html = "";
    if ($arr && is_array($arr)) {
        $html .= _arrayToHtmlTableRecursive($arr);
    }
    return $html;
}

function _arrayToHtmlTableRecursive ($arr) {
    $str = "<table><tbody>";
    foreach ($arr as $key => $val) {
        $str .= "<tr>";
        $str .= "<td>$key</td>";
        $str .= "<td>";
        if (is_array($val)) {
            if (!empty($val)) {
                $str .= _arrayToHtmlTableRecursive($val);
            }
        } else {
            $str .= "<strong>$val</strong>";
        }
        $str .= "</td></tr>";
    }
    $str .= "</tbody></table>";

    return $str;
}

/**
 * Вывод для отладки
 */
function vecho ($v) {
	$p = print_r($v,true);
	echo ''.$p.'<script>console.log(`'.$p.'`);</script>';
}

?>

<?php
	/**
	 * Функция производит частичную свёртку таблицы $tableData с суммированием по столбцу $groupKey.
	 * $primaryKeys может указать несколько колонок, которые определяют уникальность для возможности группировки. 
	 * (Например, совокуность id, title и link.)
	 */
	function reduceGroupingByPrimary ($tableData, $groupKey, array $primaryKeys) {
		if (!is_array($tableData) || empty($groupKey) || strlen($groupKey) <= 0 || count($primaryKeys) < 1) {
			return null;
		}
		$primaryKeysFound = array();
		$resultData = array();
		foreach ($tableData as $row) {
			$primaryKeysArray = array();
			foreach ($primaryKeys as $key) {
				$primaryKeysArray[] = '' . $row[$key];
			}
			$primaryKeysStr = implode(',', $primaryKeysArray);
			if (isset($resultData[$primaryKeysStr])) {
				$groupValue = $resultData[$primaryKeysStr][$groupKey] + $row[$groupKey];
				$resultData[$primaryKeysStr] = array_merge(array(), $row, array($groupKey => $groupValue));
			} else {
				$resultData[$primaryKeysStr] = array_merge(array(), $row);
			}
		}
		return array_values($resultData);
	}

function timestampToIntSec ($timestamp) {
	return intval(substr("" . $timestamp, 0, 10));
}

/**
 * Перезапуск капельной серии.
 */
function main () {
	global $in;
	$argv = fieldIn($_REQUEST, $in);
	
	if ($argv['key'] !== KEY) {
		http_response_code(403);
		die('Forbidden');
		return;
	}
    if (empty($argv['topic']) || trim($argv['topic']) != $argv['topic'] || strtolower($argv['topic']) != $argv['topic'] || strlen($argv['topic']) < 3 || strlen($argv['topic']) > 255) {
        http_response_code(404);
		die('Not found');
		return;
    }
	
	date_default_timezone_set(!empty($argv['tz']) ? $argv['tz'] : 'Europe/Minsk'); //date_default_timezone_set('Etc/GMT-3');
	
	connect();
		
	if ($argv['format'] !== 'json') {		
?>
<style type="text/css">
	table {
		width: 100%;
		margin-bottom: 20px;
		border: 1px solid #dddddd;
		border-collapse: collapse; 
	}
	table th {
		font-weight: bold;
		padding: 5px;
		background: #efefef;
		border: 1px solid #dddddd;
	}
	table td {
		border: 1px solid #dddddd;
		padding: 5px;
		min-width: 100px;
	}
</style>
<div id="main">
<?php
	} else {
// set headers		
	}

    
	
	$first = false;
    if ($argv['format'] !== 'json') {
        $first = true;
    }
	
    $arr1 = array();
    
	if ($argv['topic'] == 'country') {
        $sql1 = "SELECT id_country, Country, Region, New_Region, RegList1, RegList2, Flag, id_reg, id_newreg, id_reg1, id_reg2, cntr_iso, code_cntr, reg_iso, code_reg, cntr_code, cord, scale FROM " . $argv['topic'];
    } else if ($argv['topic'] == 'univ') {
        $sql1 = 'SELECT t1.id_univ,t2.[Univ name],t3.Country AS Economy,t3.Region,t3.Flag,t2.Logo,t2.Location,t2.Foundation,t2.[Short name],t2.Type,t2.Web_site,t2.cord,t2.nm_page,t2.Faculty,t2.Students,t1.Faculty AS Faculty_rur,t1.Students AS Students_rur,t1.O_CR,t1.O_WR,t1.O_WS,t1.O_TR,t1.O_TS,t1.O_RR,t1.O_RS,t1.O_IR,t1.O_IS,t1.O_FR,t1.O_FS,t4.League AS O_OL,t9.O_80p,t9.O_O_s,t10.O_T_s,t11.O_R_s,t12.O_I_s,t13.O_F_s,t4.Color1 AS O_Color1,t4.Color3 AS O_Color3,t4.Color4 AS O_Color4,t5.Color1 AS T_Color1,t5.Color3 AS T_Color3,t5.Color4 AS T_Color4,t6.Color1 AS R_Color1,t6.Color3 AS R_Color3,t6.Color4 AS R_Color4,t7.Color1 AS I_Color1,t7.Color3 AS I_Color3,t7.Color4 AS I_Color4,t8.Color1 AS F_Color1,t8.Color3 AS F_Color3,t8.Color4 AS F_Color4 FROM rur AS t1 JOIN Univ AS t2 ON t1.id_univ = t2.id_univ JOIN Country AS  t3 ON t2.id_country = t3.id_country JOIN League AS t4 ON t1.id_OL = t4.id_leag JOIN League AS t5 ON t1.id_TL = t5.id_leag JOIN League AS t6 ON t1.id_RL = t6.id_leag JOIN League AS t7 ON t1.id_IL = t7.id_leag JOIN League AS t8 ON t1.id_FL = t8.id_leag JOIN picleag AS t9 ON t1.id_OL = t9.id_leag AND t1.id_subj = t9.id_subj JOIN picleag AS t10 ON t1.id_TL = t10.id_leag AND t1.id_subj = t10.id_subj JOIN picleag AS t11 ON t1.id_RL = t11.id_leag AND t1.id_subj = t11.id_subj JOIN picleag AS t12 ON t1.id_IL = t12.id_leag AND t1.id_subj = t12.id_subj JOIN picleag AS t13 ON t1.id_FL = t13.id_leag AND t1.id_subj = t13.id_subj JOIN year AS t14 ON t1.id_year = t14.id_year JOIN Subject AS t15 ON t1.id_subj = t15.id_subj'; //' WHERE t14.id_year = '.$year.' AND t15.id_subj = '.$subj;
    } else {
        $sql1 = 'SELECT 1';
    }

    $sql1 .= (!empty($argv['where']) ? (' WHERE ' . $argv['where']) : ('') );
    $sql1 .= (!empty($argv['limit']) ? (' LIMIT ' . $argv['limit']) : (' LIMIT -1') );
	$STH1 = PreExecSQL_all($sql1, $arr1, $first);
	if ($first) {
		echo '<hr/>';
	}
	$first = false;
    
    
    if (!empty($argv['field'])) {
        $resultJSON = array_map(function ($row) use ($argv) {
            return $row[$argv['field']];
        }, $STH1);
    } else {
        $resultJSON = $STH1;
    }
    
    
	if ($argv['format'] !== 'json') {
		echo jsonToDebug(json_encode($resultJSON));
        echo '<hr/>';
	} else {
		if ($argv['encoding'] && $argv['encoding'] != '') {
			echo decodeSimple(json_encode($resultJSON), $argv['encoding']);
		} else {
			decodeSimple(' ', $argv['encoding']);
			echo json_encode($resultJSON);
		}
	}
	
	if ($argv['format'] !== 'json') {
        
?>
</div>
<?php		
	}
}

main();
disConnect();
?>

