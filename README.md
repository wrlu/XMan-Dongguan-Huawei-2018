# Xman-Huawei-Dongguan
## 概述

- 第三届XMan夏令营结营赛，采用AWD比赛模式。（本人的AWD处女赛😂）
- 提交flag方法：

```sh
curl http://172.16.200.20:9000/submit_flag/ -d "flag=xxxx&token=xxxx"
```

- 题目概况：web1、web2、pwn1、pwn2
- IP地址依次是：`172.16.team_id.101-104`，我队`team_id = 23`

## 比赛中遇到的点
### 0x01 web2中后台登录校验绕过
- 文件：`/admin/files/login.php`
- 登录验证成功后，仅写入user的名称为cookie：

```php
//写入登录信息并记住30天
if ($checkbox==1){
setcookie('user',$user,time()+3600*24*30,'/');
}else{
setcookie('user',$user,0,'/');
}
```
- 同时SQL语句可能存在SQL注入漏洞（未验证）：

```php
$query = "SELECT * FROM manage WHERE user='$user'";
```

- 修复方法：增加md5之后的密码为cookie

```php
//写入登录信息并记住30天
if ($checkbox==1){
setcookie('user',$user,time()+3600*24*30,'/');
// [+] Add cookie contains password md5 value.
setcookie('password',$passwords,time()+3600*24*30,'/');
}else{
setcookie('user',$user,0,'/');
// [+] Add cookie contains password md5 value.
setcookie('password',$passwords,0,'/');
}
```

- 文件：`/inc/checklogin.php`
- 校验登录仅检查cookie中是否存在user：

```php
$user=$_COOKIE['user'];
if ($user==""){
header("Location: ?r=login");
exit;	
```

- 修复方法：增加密码MD5的cookie验证

```php
// !! Fixed by wrlu
$user=$_COOKIE['user'];
if ($user==""){
header("Location: ?r=login");
exit;	
}
//===========origin file stop here===========
# [+] Add password hash check here for this file will be included by every administrator pages
ob_start();
$con = mysql_connect("localhost","root","root");
if (!$con) {
	die('Could not connect: ' . mysql_error());
}
mysql_select_db("xh", $con);
$query = "SELECT * FROM manage WHERE user='$user'";
$result = mysql_query($query) or die('SQL语句有误：'.mysql_error());
$users = mysql_fetch_array($result);
if (!mysql_num_rows($result)) {
header("Location: ?r=login");
exit;
}else{
$passwords=$users['password'];
$password=$_COOKIE['password'];
if($password<>$passwords){
header("Location: ?r=login");
exit;	
	}
}
ob_end_flush();
```

### 0x02 web2中存在文件上传漏洞
- 后台头像上传，校验方式为：MIME验证，后缀名黑名单（只有PHP一个），可以修改MIME同时以`*.php3/*.php5`后缀上传。