import config from './config.js'



const baseUrl = config.baseUrl;
/*
 *
 * 获取 localStorage
 * */

export const getStorage = k => {

  if (!k) {
    throw new Error('请输入key值');
    return;
  }

  return window.localStorage.getItem(k);
}

/*
 *
 * 
 * 设置 localStorage
 * */

export const setStorage = (k, v) => {

  if (!k) {
    throw new Error('请输入key值');
    return;
  }
  if (typeof v !== 'string') {
    v = JSON.stringify(v);
  }
  window.localStorage.setItem(k, v);
}

/*
 * 
 * 删除 localStorage
 * */

export const rmStorage = k => {
  if (!k) {
    throw new Error('请输入key值');
    return;
  }
  window.localStorage.removeItem(k);
}

/*
 * 
 * 删除所有 localStorage
 * */

export const clearStorage = k => {
  window.localStorage.clear();
}

export const dateFrom = function (time, format = 'yyyy-MM-dd HH:mm') {
  if (!time) return "";
  var t = new Date(time);
  var tf = function (i) {
    return (i < 10 ? '0' : '') + i
  };
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear());
        break;
      case 'MM':
        return tf(t.getMonth() + 1);
        break;
      case 'mm':
        return tf(t.getMinutes());
        break;
      case 'dd':
        return tf(t.getDate());
        break;
      case 'HH':
        return tf(t.getHours());
        break;
      case 'ss':
        return tf(t.getSeconds());
        break;
    }
  })
}


/** 下载文件*/
export const downFile = function ({
  fileName,
  fileToken,
  fileType
}) {
  if (!fileName || !fileToken || !fileType) {
    return;
  }

  // var elemIF = document.createElement("iframe");
  // elemIF.src = `${baseUrl}/file/DownloadTempFile?FileName=${fileName}&FileType=${fileType}&FileToken=${fileToken}`;
  // elemIF.style.display = "none";
  // document.body.appendChild(elemIF);
  let _time = new Date().getTime();
  if (!fileName || !fileToken || !fileType) {
    return;
  }
  let name = encodeURI(fileName);
  let sUrl = `${baseUrl}/file/DownloadTempFile?FileName=${name}&FileType=${fileType}&FileToken=${fileToken}&t=${_time}`
  //iOS devices do not support downloading. We have to inform user about this.
  if (/(iP)/g.test(navigator.userAgent)) {
    alert('Your device does not support files downloading. Please try again in desktop browser.');
    return false;
  }
  let isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
  let isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;

  //If in Chrome or Safari - download via virtual link click
  if (isChrome || isSafari) {
    //Creating new link node.
    var link = document.createElement('a');
    link.href = sUrl;
    if (link.download !== undefined) {
      link.download = fileName;
    }
    //Dispatching click event.
    if (document.createEvent) {
      var e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
      return true;
    }
  }
  window.open(sUrl, '_self');
  return true;


}
