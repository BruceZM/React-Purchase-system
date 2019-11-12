import md5 from 'md5';

export default function randomNameUpload(file_name){
    var name = md5(file_name + Math.random()*1000)
    return name
}