<?php
declare(strict_types=1);
/*
 * TELLURIS EXP-013 — OPTIONAL private OpenAI adapter.
 * NOT part of the static website/public deployment. Deploy deliberately at
 * /api/telluris-ai.php ONLY after verifying PHP/cURL/TLS, disk permission,
 * secret server environment, rate limiting, host and production QA.
 * Disabled by default. NEVER store a secret inside web root or Git.
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, private');
header('X-Content-Type-Options: nosniff');
function reply(int $status, string $message): never {
 http_response_code($status);
 echo json_encode(['error'=>$message], JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);
 exit;
}
if (($_SERVER['REQUEST_METHOD']??'')!=='POST') reply(405,'POST required');
if (getenv('TELLURIS_AI_ENABLED')!=='1') reply(503,'AI server is not configured');
$host=strtolower($_SERVER['HTTP_HOST']??'');
if ($host!=='projecturiel.earth') reply(403,'Host is not allowed');
$origin=$_SERVER['HTTP_ORIGIN']??'';
if ($origin!=='https://projecturiel.earth') reply(403,'Same-origin browser requests only');
if (($_SERVER['HTTP_X_TELLURIS_REQUEST']??'')!=='source-brief-v1') reply(403,'Browser request header required');
if ((int)($_SERVER['CONTENT_LENGTH']??0)>10000) reply(413,'Request too large');
$key=getenv('OPENAI_API_KEY');$model=getenv('TELLURIS_AI_MODEL');
if (!$key||!$model||!function_exists('curl_init')) reply(503,'AI service is unavailable');
$raw=file_get_contents('php://input',false,null,0,10001);
if (!is_string($raw)||strlen($raw)>10000) reply(413,'Request too large');
$data=json_decode($raw,true);
$codes=['T2M','T2M_MAX','T2M_MIN','PRECTOTCORR','RH2M','QV2M','WS10M','WD10M','U10M','V10M','PS','CLOUD_AMT','ALLSKY_SFC_SW_DWN','ALLSKY_SFC_LW_DWN','ALLSKY_SRF_ALB','EVPTRNS','GWETTOP','GWETROOT'];
if (!is_array($data)||($data['schema']??'')!=='telluris.ai.source_brief.v1'
    ||!in_array($data['code']??null,$codes,true)
    ||!in_array($data['lang']??null,['es','en'],true)
    ||!is_array($data['siteA']??null)
    ||!is_array($data['siteA']['annual']??null)
    ||count($data['siteA']['annual'])<10
    ||count($data['siteA']['annual'])>50)
 reply(422,'Invalid source brief');
foreach (['siteA','siteB'] as $site) {
 if(!isset($data[$site])) continue;
 if(!is_array($data[$site])||!is_array($data[$site]['annual']??null)||count($data[$site]['annual'])>50)
  reply(422,'Invalid observation array');
 foreach($data[$site]['annual'] as $point)
  if(!is_array($point)||count($point)!==2||!is_int($point[0])||
    $point[0]<1981||$point[0]>2025||!is_numeric($point[1])||!is_finite((float)$point[1]))
   reply(422,'Invalid observation');
}
// Public anonymous service: conservative per-IP and global fixed-window limits.
// The operator must ALSO set account spend limits. A proxy/CDN may affect IP precision.
$folder=sys_get_temp_dir().'/telluris_ai_throttle_v1';
if(!is_dir($folder)&&!@mkdir($folder,0700,true)) reply(503,'Throttling unavailable');
$ip=$_SERVER['REMOTE_ADDR']??'unknown';
$hour=gmdate('Y-m-d-H');$day=gmdate('Y-m-d');
$limits=[
 [$folder.'/i_'.hash('sha256',$ip.'|'.$hour),3],
 [$folder.'/g_'.hash('sha256',$day),60]
];
foreach($limits as [$path,$limit]){
 $handle=@fopen($path,'c+');
 if(!$handle) reply(503,'Throttling unavailable');
 if(!flock($handle,LOCK_EX)){fclose($handle);reply(503,'Throttling unavailable');}
 $content=stream_get_contents($handle);
 $count=(int)trim((string)$content);
 if($count>=$limit){flock($handle,LOCK_UN);fclose($handle);reply(429,'AI request limit reached');}
 ftruncate($handle,0);rewind($handle);fwrite($handle,(string)($count+1));
 fflush($handle);flock($handle,LOCK_UN);fclose($handle);
}
// Browser evidence is user-controllable; not independently NASA authenticated.
// The model is permitted to explain only and never to recalculate or claim
// scientific significance, hazard probability, causal attribution or forecasts.
$system="You are a cautious bilingual Earth-science interpretation assistant for TELLURIS, an independent educational project. The JSON evidence was sent by the browser and NOT independently authenticated by the server. No research finding is independently verified here. Do not invent NASA data, dates, source URLs, statistical significance, climate causes, prediction, localized emergency guidance or precise risk estimates. Do not recalculate numerical measurements. In the user's language, organize your answer with five concise headings: (1) Observed evidence, (2) Possible influences to TEST, (3) Conditional considerations if the pattern persisted (NOT a forecast), (4) Suggested short-term checks, (5) Longer-term monitoring or planning options. Clearly state limitations. Never treat correlation as causation, and don't imply NASA endorsement. Limit 450 words.";
$payload=['model'=>$model,'instructions'=>$system,'input'=>[
 ['role'=>'user','content'=>json_encode($data,JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE)]],
 'max_output_tokens'=>900];
$ch=curl_init('https://api.openai.com/v1/responses');
curl_setopt_array($ch,[
 CURLOPT_POST=>true,CURLOPT_HTTPHEADER=>[
   'Authorization: Bearer '.$key,'Content-Type: application/json'],
 CURLOPT_POSTFIELDS=>json_encode($payload),CURLOPT_RETURNTRANSFER=>true,
 CURLOPT_CONNECTTIMEOUT=>5,CURLOPT_TIMEOUT=>25,CURLOPT_FOLLOWLOCATION=>false,
 CURLOPT_SSL_VERIFYPEER=>true,CURLOPT_SSL_VERIFYHOST=>2
]);
$body=curl_exec($ch);$status=(int)curl_getinfo($ch,CURLINFO_HTTP_CODE);
curl_close($ch);
if(!is_string($body)||$status<200||$status>=300) reply(502,'AI provider unavailable; deterministic guidance is still available');
$json=json_decode($body,true);$pieces=[];
foreach(($json['output']??[]) as $entry)
 foreach(($entry['content']??[]) as $segment)
  if(($segment['type']??'')==='output_text' && is_string($segment['text']??null))$pieces[]=$segment['text'];
$analysis=trim(implode("\n",$pieces));
if($analysis===''||strlen($analysis)>15000) reply(502,'AI response unavailable');
echo json_encode(['analysis'=>$analysis,'status'=>'model_generated_not_scientifically_validated'],
 JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
