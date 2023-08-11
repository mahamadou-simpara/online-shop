const imgInputEl = document.getElementById('img-input');
const imgEl = document.getElementById('img');


function displayImgPreview(){
   const files =  imgInputEl.files;


   if(files.length < 0){
    imgEl.style.display = 'none';
    return 
   }
   const img = files[0];

//    const srcImg = URL.createObjectURL(img);

//    console.log(srcImg);

   imgEl.src =  URL.createObjectURL(img)
   imgEl.style.display = 'block'
}



imgInputEl.addEventListener('change', displayImgPreview);