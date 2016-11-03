function imageManipulate_multiscale(img, widthList)
{
  imgUrls = [];

  jQuery.each(widthList, function() {
    var canvas = document.createElement('canvas');
    var MAX_WIDTH = this;
    var MAX_HEIGHT = this;
    var width = img.width;
    var height = img.height;

    if (width > height) {
      if (width > MAX_WIDTH) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    } else {
      if (height > MAX_HEIGHT) {

        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    }
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    imgUrls[this] = canvas.toDataURL("image/jpeg");
  });

  return imgUrls;
}






function makeThumb(img)
{


var canvas = document.createElement('canvas'); 
var MAX_WIDTH = 100;
var MAX_HEIGHT = 100;
var width = img.width;
var height = img.height;
 
if (width > height) {
  if (width > MAX_WIDTH) {

  
   width *= MAX_HEIGHT / height;
    height = MAX_HEIGHT;


  //  height *= MAX_WIDTH / width;
   // width = MAX_WIDTH;
  }
} else {
  if (height > MAX_HEIGHT) {

    height *= MAX_WIDTH / width;
  width = MAX_WIDTH;

  //  width *= MAX_HEIGHT / height;
   // height = MAX_HEIGHT;
  }
}
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext("2d");
ctx.drawImage(img, 0, 0, width, height);
return canvas.toDataURL("image/jpeg");


}


function scaleImage(img)
{


var canvas = document.createElement('canvas'); 
var MAX_WIDTH = 800;
var MAX_HEIGHT = 800;
var width = img.width;
var height = img.height;
 
if (width > height) {
  if (width > MAX_WIDTH) {
    height *= MAX_WIDTH / width;
    width = MAX_WIDTH;
  }
} else {
  if (height > MAX_HEIGHT) {
    width *= MAX_HEIGHT / height;
    height = MAX_HEIGHT;
  }
}
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext("2d");
ctx.drawImage(img, 0, 0, width, height);
return canvas.toDataURL("image/jpeg");


}