// import store from "@/store";
import Exif from "exif-js";

var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
var chnUnitChar = ["", "十", "百", "千"];
class Common {
  // 时间戳转字符串  type（默认0）
  // 0: 2020-02-24 09:06:25
  // 1: 2020-02-24
  // 2: 2020-02-24 09:06
  // 3: 02/24
  timestampToString(timestamp, type) {
    if (timestamp == null || timestamp == "") {
      return "";
    }

    var date = new Date(timestamp);
    let Y = "";
    let M = "";
    if (type == 3) {
      Y = date.getFullYear() + "/";
      M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "/";
    } else {
      Y = date.getFullYear() + "-";
      M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
    }

    var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var h =
      " " + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours());
    var m =
      ":" +
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
    var s =
      ":" +
      (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());

    if (type == 1) {
      return Y + M + D;
    }
    if (type == 3) {
      return M + D;
    }
    if (type == 2) {
      return Y + M + D + h + m;
    } else {
      return Y + M + D + h + m + s;
    }
  }

  // 判断文件是否为图片类型
  isAssetTypeAnImage(fileName) {
    // 获取最后一个.的位置
    const index = fileName.lastIndexOf(".");
    // 获取后缀
    const ext = fileName.substr(index + 1);

    return (
      [
        "png",
        "jpg",
        "jpeg",
        "bmp",
        "gif",
        "webp",
        "psd",
        "svg",
        "tiff"
      ].indexOf(ext.toLowerCase()) !== -1
    );
  }

  // 判断文件是否为office常用类型 word excel ppt pdf
  isAssetTypeOffice(fileName) {
    // 获取最后一个.的位置
    const index = fileName.lastIndexOf(".");
    // 获取后缀
    const ext = fileName.substr(index + 1);

    return (
      [
        "doc",
        "docx",
        "xls",
        "xlsx",
        "xml",
        "xmls",
        "ppt",
        "pptx",
        "pdf"
      ].indexOf(ext.toLowerCase()) !== -1
    );
  }

  // 判断文件是否为图片类型和文件
  isAssetTypeAnImageOffice(fileName) {
    // 获取最后一个.的位置
    const index = fileName.lastIndexOf(".");
    // 获取后缀
    const ext = fileName.substr(index + 1);

    return (
      [
        "png",
        "jpg",
        "jpeg",
        "bmp",
        "gif",
        "webp",
        "psd",
        "svg",
        "tiff",

        "doc",
        "docx",
        "xls",
        "xlsx",
        "xml",
        "xmls",
        "ppt",
        "pptx",
        "pdf"
      ].indexOf(ext.toLowerCase()) !== -1
    );
  }

  // 判断文件是否为视频常用类型 mp3 wav
  isAssetTypeAudio(fileName) {
    // 获取最后一个.的位置
    const index = fileName.lastIndexOf(".");
    // 获取后缀
    const ext = fileName.substr(index + 1);

    return (
      ["mp4", "3gp", "ogg", "avi", "mov", "rm", "wma"].indexOf(
        ext.toLowerCase()
      ) !== -1
    );
  }

  // file转换Blob
  async videoing(file) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      const rs = reader.readAsArrayBuffer(file.file);
      let blob = null;
      reader.onload = e => {
        if (typeof e.target.result === "object") {
          blob = new Blob([e.target.result], { type: "mp4" });
        } else {
          blob = e.target.result;
        }
        res(blob);
      };
    });
  }

  /** 身份证号合法性验证
  支持15位和18位身份证号
  支持地址编码、出生日期、校验位验证**/
  IdCodeValid(code) {
    var city = {
      11: "北京",
      12: "天津",
      13: "河北",
      14: "山西",
      15: "内蒙古",
      21: "辽宁",
      22: "吉林",
      23: "黑龙江 ",
      31: "上海",
      32: "江苏",
      33: "浙江",
      34: "安徽",
      35: "福建",
      36: "江西",
      37: "山东",
      41: "河南",
      42: "湖北 ",
      43: "湖南",
      44: "广东",
      45: "广西",
      46: "海南",
      50: "重庆",
      51: "四川",
      52: "贵州",
      53: "云南",
      54: "西藏 ",
      61: "陕西",
      62: "甘肃",
      63: "青海",
      64: "宁夏",
      65: "新疆",
      71: "台湾",
      81: "香港",
      82: "澳门",
      91: "国外 "
    };
    var row = {
      pass: true,
      msg: "验证成功"
    };
    if (
      !code ||
      !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(
        code
      )
    ) {
      row = {
        pass: false,
        msg: "身份证号格式错误"
      };
    } else if (!city[code.substr(0, 2)]) {
      row = {
        pass: false,
        msg: "身份证号地址编码错误"
      };
    } else {
      // 18位身份证需要验证最后一位校验位
      if (code.length == 18) {
        code = code.split("");
        // ∑(ai×Wi)(mod 11)
        // 加权因子
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        // 校验位
        var parity = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
        var sum = 0;
        var ai = 0;
        var wi = 0;
        for (var i = 0; i < 17; i++) {
          ai = code[i];
          wi = factor[i];
          sum += ai * wi;
        }
        if (parity[sum % 11] != code[17].toUpperCase()) {
          row = {
            pass: false,
            msg: "身份证号校验位错误"
          };
        }
      }
    }
    return row;
  }

  // 手机号验证
  isPhoneNumber(tel) {
    var reg = /^0?1[2|3|4|5|6|7|8|9][0-9]\d{8}$/;
    return reg.test(tel);
  }

  getBirthday(psidno) {
    var birthdayno, birthdaytemp;
    if (psidno.length == 18) {
      birthdayno = psidno.substring(6, 14);
    } else if (psidno.length == 15) {
      birthdaytemp = psidno.substring(6, 12);
      birthdayno = "19" + birthdaytemp;
    } else {
      return false;
    }
    var birthday =
      birthdayno.substring(0, 4) +
      "-" +
      birthdayno.substring(4, 6) +
      "-" +
      birthdayno.substring(6, 8);
    return birthday;
  }

  // 数字转中文
  noToChinese(num) {
    if (!/^\d*(\.\d*)?$/.test(num)) {
      alert("Number is wrong!");
      return "Number is wrong!";
    }
    var AA = new Array(
      "零",
      "一",
      "二",
      "三",
      "四",
      "五",
      "六",
      "七",
      "八",
      "九"
    );
    var BB = new Array("", "十", "百", "千", "万", "亿", "点", "");
    var a = ("" + num).replace(/(^0*)/g, "").split("."),
      k = 0,
      re = "";
    for (var i = a[0].length - 1; i >= 0; i--) {
      switch (k) {
        case 0:
          re = BB[7] + re;
          break;
        case 4:
          if (
            !new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0])
          ) {
            re = BB[4] + re;
          }
          break;
        case 8:
          re = BB[5] + re;
          BB[7] = BB[5];
          k = 0;
          break;
      }
      if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0)
        re = AA[0] + re;
      if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
      k++;
    }
    if (a.length > 1) {
      //加上小数部分(如果有小数部分)
      re += BB[6];
      for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
    }
    return re;
  }

  // 角色权限是否满足
  // roleProving(roles) {
  //   const myRoles = store.getters.roles;
  //   return myRoles.some(v => roles.indexOf(v) > -1);
  // }

  // 图片压缩
  async imgPreview({ file, base64, isRotateImg }) {
    return new Promise((resolve, reject) => {
      var str = navigator.userAgent.toLowerCase();
      var ver = str.match(/cpu iphone os (.*?) like mac os/);
      if (ver) {
        const iOSVersion = ver[1].replace(/_/g, ".");
        if (iOSVersion < 12) {
          console.log("不压缩");
          resolve({ file: file, base64: "" });
        }
      }

      let Orientation;
      // 去获取拍照时的信息，解决拍出来的照片旋转问题
      // console.log(this.getBrowser());
      if (isRotateImg) {
        Exif.getData(file, function() {
          Orientation = Exif.getTag(this, "Orientation");
          console.log(Orientation);
        });
      }

      // 看支持不支持FileReader
      // if (!file || !window.FileReader) return;
      if (!window.FileReader) return;

      if (base64) {
        const img = new Image();
        img.src = base64;
        if (base64.length <= 200 * 1024) {
          let newFile = dataURLtoFile(base64, "1");
          resolve({ file: newFile, base64: base64 });
        } else {
          img.onload = function() {
            let data = compress(img, Orientation);
            let newFile = dataURLtoFile(data, "1");
            resolve({ file: newFile, base64: data });
          };
        }
      } else if (file) {
        // if (/^image/.test(file.type)) {
        // 创建一个reader
        const reader = new FileReader();
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function() {
          let result = this.result;
          let img = new Image();
          img.src = result;
          //判断图片是否大于200K,是就直接上传，反之压缩图片
          if (this.result.length <= 200 * 1024) {
            const newFile = dataURLtoFile(this.result, file.name);
            resolve({ file: newFile, base64: this.result });
          } else {
            img.onload = function() {
              let data = compress(img, Orientation);
              let newFile = dataURLtoFile(data, file.name);
              resolve({ file: newFile, base64: data });
            };
          }
        };
        // }
      }
    });
  }

  // 判断各种浏览器
  getBrowser() {
    var ua = navigator.userAgent.toLocaleLowerCase();
    // console.log(ua);
    var Browser = null;
    if (ua.match(/msie/) != null || ua.match(/trident/) != null) {
      Browser = "IE";
      browserVersion =
        ua.match(/msie ([\d.]+)/) != null
          ? ua.match(/msie ([\d.]+)/)[1]
          : ua.match(/rv:([\d.]+)/)[1];
      return "IE";
    } else if (ua.match(/firefox/) != null) {
      Browser = "火狐";
      return "FF";
    } else if (ua.match(/ubrowser/) != null) {
      Browser = "UC";
      return "UC";
    } else if (ua.match(/opera/) != null) {
      Browser = "欧朋";
      return "OP";
    } else if (ua.match(/bidubrowser/) != null) {
      Browser = "百度";
      return "baidu";
    } else if (ua.match(/metasr/) != null) {
      Browser = "搜狗";
      return "SG";
    } else if (
      ua.match(/tencenttraveler/) != null ||
      ua.match(/qqbrowse/) != null
    ) {
      Browser = "QQ";
      return "QQ";
    } else if (ua.match(/maxthon/) != null) {
      Browser = "遨游";
      return "AY";
    } else if (ua.match(/chrome/) != null) {
      function _mime(option, value) {
        var mimeTypes = navigator.mimeTypes;
        for (var mt in mimeTypes) {
          // console.log(mimeTypes[mt][option]);
          if (mimeTypes[mt][option] == value) {
            return true;
          }
        }
        return false;
      }
      var is360 = _mime("type", "application/vnd.chromium.remoting-viewer");
      if (is360) {
        Browser = "360";
        return "360";
      } else {
        return "Chrome";
      }
    } else if (ua.match(/safari/) != null) {
      Browser = "Safari";
    }
  }

  // base64转成file
  dataURLtoFile(dataurl, filename) {
    // filename = filename.indexOf(".") < 0 ? filename + ".jpg" : filename;
    var arr = dataurl.split(",");
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  SectionToChinese(section) {
    var strIns = "",
      chnStr = "";
    var unitPos = 0;
    var zero = true;
    while (section > 0) {
      var v = section % 10;
      if (v === 0) {
        if (!zero) {
          zero = true;
          chnStr = chnNumChar[v] + chnStr;
        }
      } else {
        zero = false;
        strIns = chnNumChar[v];
        strIns += chnUnitChar[unitPos];
        chnStr = strIns + chnStr;
      }
      unitPos++;
      section = Math.floor(section / 10);
    }
    return chnStr;
  }

  // 阿拉伯数字转中文
  NumberToChinese(num) {
    var unitPos = 0;
    var strIns = "",
      chnStr = "";
    var needZero = false;

    if (num === 0) {
      return chnNumChar[0];
    }

    while (num > 0) {
      var section = num % 10000;
      if (needZero) {
        chnStr = chnNumChar[0] + chnStr;
      }
      strIns = this.SectionToChinese(section);
      strIns += section !== 0 ? chnUnitSection[unitPos] : chnUnitSection[0];
      chnStr = strIns + chnStr;
      needZero = section < 1000 && section > 0;
      num = Math.floor(num / 10000);
      unitPos++;
    }

    return chnStr;
  }
}

// 压缩
function compress(img, Orientation) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  // 瓦片canvas
  const tCanvas = document.createElement("canvas");
  const tctx = tCanvas.getContext("2d");
  const initSize = img.src.length;
  let width = img.width;
  let height = img.height;
  // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
  let ratio;
  if ((ratio = (width * height) / 2000000) > 1) {
    console.log("大于200万像素");
    ratio = Math.sqrt(ratio);
    width /= ratio;
    height /= ratio;
  } else {
    ratio = 1;
  }
  canvas.width = width;
  canvas.height = height;
  //        铺底色
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // 如果图片像素大于100万则使用瓦片绘制
  let count;
  if ((count = (width * height) / 1000000) > 1) {
    console.log("超过100W像素");
    count = ~~(Math.sqrt(count) + 1); // 计算要分成多少块瓦片
    //            计算每块瓦片的宽和高
    const nw = ~~(width / count);
    const nh = ~~(height / count);
    tCanvas.width = nw;
    tCanvas.height = nh;
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        tctx.drawImage(
          img,
          i * nw * ratio,
          j * nh * ratio,
          nw * ratio,
          nh * ratio,
          0,
          0,
          nw,
          nh
        );
        ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
      }
    }
  } else {
    ctx.drawImage(img, 0, 0, width, height);
  }

  // 修复ios上传图片的时候 被旋转的问题
  if (Orientation && Orientation != "" && Orientation != 1) {
    switch (Orientation) {
      case 6: // 需要顺时针（向左）90度旋转
        rotateImg(img, "left", canvas);
        break;
      case 8: // 需要逆时针（向右）90度旋转
        rotateImg(img, "right", canvas);
        break;
      case 3: // 需要180度旋转
        rotateImg(img, "right", canvas); // 转两次
        rotateImg(img, "right", canvas);
        break;
    }
  }

  // 进行最小压缩
  const ndata = canvas.toDataURL("image/jpeg", 0.3);
  tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
  return ndata;
}

// 图片旋转
function rotateImg(img, direction, canvas) {
  // 最小与最大旋转方向，图片旋转4次后回到原方向
  const min_step = 0;
  const max_step = 3;
  if (img == null) return;
  // img的高度和宽度不能在img元素隐藏后获取，否则会出错
  const height = img.height;
  const width = img.width;
  let step = 2;
  if (step == null) {
    step = min_step;
  }
  if (direction == "right") {
    step++;
    // 旋转到原位置，即超过最大值
    step > max_step && (step = min_step);
  } else {
    step--;
    step < min_step && (step = max_step);
  }
  // 旋转角度以弧度值为参数
  const degree = (step * 90 * Math.PI) / 180;
  const ctx = canvas.getContext("2d");
  switch (step) {
    case 0:
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0);
      break;
    case 1:
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(degree);
      ctx.drawImage(img, 0, -height);
      break;
    case 2:
      canvas.width = width;
      canvas.height = height;
      ctx.rotate(degree);
      ctx.drawImage(img, -width, -height);
      break;
    case 3:
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(degree);
      ctx.drawImage(img, -width, 0);
      break;
  }
}

// base64转成file
function dataURLtoFile(dataurl, filename) {
  // filename = filename.indexOf(".") < 0 ? filename + ".jpg" : filename;
  var arr = dataurl.split(",");
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export default Common;
