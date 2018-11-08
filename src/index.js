document.addEventListener("DOMContentLoaded",()=>{

  const dogBar = document.getElementById('dog-bar')
  const dogInfo = document.getElementById('dog-info')
  const filter = document.getElementById('filter-div')
  fetch('http://localhost:3000/pups')
  .then((response)=>response.json())
  .then((json)=>{
    dogBar.innerHTML+=renderDogsBar(json)}
  )
  dogBar.addEventListener('click',(e)=>{

    if(e.target.localName === 'span'){
      fetchDog(e.target.dataset.id).then((obj)=>{
        dogInfo.innerHTML = renderDogPic(obj)
        dogInfo.dataset.id = obj.id;
      })
    }
  })
  dogInfo.addEventListener('click',(e)=>{
    if(e.target.localName === 'button'){
      fetchDog(e.target.parentElement.dataset.id).then((obj)=>{
        if (e.target.innerText == "Good Dog!"){
          fetch(`http://localhost:3000/pups/${obj.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({isGoodDog:true})
          })
          .then((response)=>response.json())
          .then((json)=>{
            console.log(json)
            e.target.innerText = "Bad Dog!"})
        }
        else{
          fetch(`http://localhost:3000/pups/${obj.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({isGoodDog:false})
          })
          .then((response)=>response.json())
          .then((json)=>{
            console.log(json)
            e.target.innerText = "Good Dog!"})
        }
      })
    }
  })
  filter.addEventListener('click',(e)=>{
    if(e.target.localName === 'button'){
      console.log("clicked!");
      console.log(e.target.innerText === 'Filter good dogs: OFF');
      if(e.target.innerText === 'Filter good dogs: OFF'){
        fetch('http://localhost:3000/pups')
        .then((response)=>response.json())
        .then((json)=>{
          dogBar.innerHTML=renderGoodDogs(json)
          e.target.innerText = 'Filter good dogs: ON'
        })
      }else if(e.target.innerText === 'Filter good dogs: ON'){
        console.log("flipped-on");
        fetch('http://localhost:3000/pups')
        .then((response)=>response.json())
        .then((json)=>{
          dogBar.innerHTML=renderDogsBar(json)
          e.target.innerText = 'Filter good dogs: OFF'
        })
      }
    }
  })

  function renderDogsBar(dogArr){
    return dogArr.map((dog)=>{
      return renderSingleDogBar(dog)
    }).join('')
  }
  function renderSingleDogBar(dog){
    return `<span data-id = "${dog.id}">${dog.name}</span>`
  }
  function renderDogPic(dogObj){
    return `<img src="${dogObj.image}">
    <h2>${dogObj.name}</h2>
    <button>${dogObj.isGoodDog ? "Bad Dog!":"Good Dog!"}</button>`
  }
  function fetchDog(id){
    return fetch(`http://localhost:3000/pups/${id}`)
    .then((response)=>response.json())
    .then((json)=>json)
  }
  function renderGoodDogs(dogArr){
     return dogArr.filter((dog)=>dog.isGoodDog).map((dog)=>{
      return renderSingleDogBar(dog)
    }).join('')
  }
})
