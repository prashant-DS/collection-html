var template,bt,inp;

window.onload=function(){
    template=document.getElementsByClassName('temp')[0];
    bt=document.getElementsByClassName('addBt')[0];
    bt.addEventListener('click',onClickAddbtn);
    inp=document.getElementsByClassName('inp')[0];

    document.getElementsByClassName('clrall')[0].addEventListener('click',onClickCallBtn);
    document.getElementsByClassName('clrcomp')[0].addEventListener('click',onClickCcBtn);

    document.querySelector(".inp").addEventListener('keydown',e=>{if(e.keyCode==13)onClickAddbtn();})

}

function onClickAddbtn(){
    var str=inp.value;
    if(inp.value=="")
        return;
    inp.value=""

    var newtask=template.cloneNode(true);
    newtask.style.display="flex";
    newtask.children[1].innerHTML=str;
    template.parentNode.appendChild(newtask);
    newtask.scrollIntoView({behavior:"smooth"});
}

function onClickCallBtn(){
    var t=0;
    var arr=document.querySelectorAll('.temp');
    arr[1].scrollIntoView(true);
    for(let i of arr)
        if(i!=template)
            setTimeout(()=>{onClickCrossbtn(i.lastChild,500+100*(arr.length-2))},100*t++);
}

function onClickCcBtn(){
    var t=0;
    for(let i of document.querySelectorAll('.chkbox:checked'))
        setTimeout(()=>{onClickCrossbtn(i)},100*t++);
}

function onClickChkbox(box){
    box.parentNode.children[1].style.textDecoration = "line-through";
}

function onClickCrossbtn(box,delafter=500){
    box.parentNode.classList.add('removing');
    box.parentNode.scrollIntoView({behavior:"smooth"});
    setTimeout(()=>{box.parentNode.parentNode.removeChild(box.parentNode);},delafter);
}