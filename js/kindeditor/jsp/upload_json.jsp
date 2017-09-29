<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.*,java.io.*" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="org.apache.commons.fileupload.*" %>
<%@ page import="org.apache.commons.fileupload.disk.*" %>
<%@ page import="org.apache.commons.fileupload.servlet.*" %>
<%@ page import="com.alibaba.fastjson.JSONObject" %>
<%@ page import="com.util.File.CreateFileUtil" %>
<%@ page import="com.qiniu.util.Auth" %>
<%@ page import="com.qiniu.common.Zone" %>
<%@ page import="com.qiniu.storage.Configuration" %>
<%@ page import="com.qiniu.storage.UploadManager" %>
<%@ page import="com.qiniu.http.Response" %>
<%

    /**
     * KindEditor JSP
     *
     * 本JSP程序是演示程序，建议不要直接在实际项目中使用。
     * 如果您确定直接使用本程序，使用之前请仔细确认相关安全设置。
     *
     */
//上传到七牛后保存的文件名
    String key = String.valueOf(new Date().getTime()) + ".png";
    String filePath = "";
//设置文件保存和取出路径
    String Url = request.getRequestURL().toString();
    Url = Url.substring(0, Url.indexOf("/", Url.indexOf("/") + 2));


//文件保存目录路径
    String savePath = "";
    File file = new File(request.getSession().getServletContext()
            .getRealPath("/")).getParentFile();
    savePath = file.getCanonicalPath() + "/img/New";

//文件保存目录URL
    String saveUrl = Url + "/img/New";

//定义允许上传的文件扩展名
    HashMap<String, String> extMap = new HashMap<String, String>();
    extMap.put("image", "gif,jpg,jpeg,png,bmp");
    extMap.put("flash", "swf,flv");
    extMap.put("media", "swf,flv,mp3,wav,wma,wmv,mid,avi,mpg,asf,rm,rmvb");
    extMap.put("file", "doc,docx,xls,xlsx,ppt,htm,html,txt,zip,rar,gz,bz2");

//最大文件大小
    long maxSize = 1000000;

    response.setContentType("text/html; charset=UTF-8");

    if (!ServletFileUpload.isMultipartContent(request)) {
        out.println(getError("请选择文件。"));
        return;
    }
//检查目录
    File uploadDir = new File(savePath);
    if (!uploadDir.isDirectory()) {
        CreateFileUtil.createDir(savePath);
        out.println(getError("上传目录不存在。" + savePath));
        return;
    }
//检查目录写权限
    if (!uploadDir.canWrite()) {
        out.println(getError("上传目录没有写权限。"));
        return;
    }

    String dirName = request.getParameter("dir");
    if (dirName == null) {
        dirName = "image";
    }
    if (!extMap.containsKey(dirName)) {
        out.println(getError("目录名不正确。"));
        return;
    }
//创建文件夹
    savePath += dirName + "/";
    saveUrl += dirName + "/";
    File saveDirFile = new File(savePath);
    if (!saveDirFile.exists()) {
        saveDirFile.mkdirs();
    }
    SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
    String ymd = sdf.format(new Date());
    savePath += ymd + "/";
    saveUrl += ymd + "/";
    File dirFile = new File(savePath);
    if (!dirFile.exists()) {
        dirFile.mkdirs();
    }

    FileItemFactory factory = new DiskFileItemFactory();
    ServletFileUpload upload = new ServletFileUpload(factory);
    upload.setHeaderEncoding("UTF-8");
    List items = upload.parseRequest(request);
    Iterator itr = items.iterator();
    while (itr.hasNext()) {
        FileItem item = (FileItem) itr.next();
        String fileName = item.getName();
        long fileSize = item.getSize();
        if (!item.isFormField()) {
            //检查文件大小
            if (item.getSize() > maxSize) {
                out.println(getError("上传文件大小超过限制。"));
                return;
            }

            //检查扩展名
            String fileExt = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
            if (!Arrays.<String>asList(extMap.get(dirName).split(",")).contains(fileExt)) {
                out.println(getError("上传文件扩展名是不允许的扩展名。\n只允许" + extMap.get(dirName) + "格式。"));
                return;
            }

            SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");
            String newFileName = df.format(new Date()) + "_" + new Random().nextInt(1000) + "." + fileExt;
            try {
                File uploadedFile = new File(savePath, newFileName);
                item.write(uploadedFile);
                //System.out.print("++++++++++++++"+savePath+newFileName);
                filePath = savePath + newFileName;
            } catch (Exception e) {
                out.println(getError("上传文件失败。"));
                return;
            }

            JSONObject obj = new JSONObject();
            obj.put("error", 0);
            obj.put("url", "http://ojlnw4poy.bkt.clouddn.com/" + key);
            out.println(obj.toJSONString());
        }
    }
    //设置好账号的ACCESS_KEY和SECRET_KEY
    String ACCESS_KEY = "tSI5_rYArb3DLHmjEbLrHkbVE91CJC17RTWW_A9f";
    String SECRET_KEY = "H5aRu0hhtrQFgpHTKAOKYnQL7IUouMmVNz94hSDD";
    //要上传的空间
    String bucketname = "qianmo-official";

    //上传文件的路径
    String FilePath = filePath;

    //密钥配置
    Auth auth = Auth.create(ACCESS_KEY, SECRET_KEY);

    ///////////////////////指定上传的Zone的信息//////////////////
    // 自动识别要上传的空间(bucket)的存储区域是华东、华北、华南。
    Zone z = Zone.autoZone();
    Configuration c = new Configuration(z);

    //创建上传对象
    UploadManager uploadManager = new UploadManager(c);

    //简单上传，使用默认策略，只需要设置上传的空间名就可以了

    Response res = uploadManager.put(FilePath, key, auth.uploadToken(bucketname));
    File file1 = new File(filePath);
    file1.delete();
%>
<%!
    private String getError(String message) {
        JSONObject obj = new JSONObject();
        obj.put("error", 1);
        obj.put("message", message);
        return obj.toJSONString();
    }
%>