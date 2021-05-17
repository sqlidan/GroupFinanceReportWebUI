import fetch from 'utils/fetch';

//上传文件
export function AnnexImportUpload(obj) {
    return fetch({
      url: '/DBService/api/services/app/ImportFile/AnnexImportUpload',
      method: 'post',
      data: obj
    });
  }

  
//没有扩展名的文件处理
export function AddFileExtension(obj) {
  return fetch({
    url: '/DBService/api/ImportMessage/AddFileExtension',
    method: 'post',
    data: obj
  });
}