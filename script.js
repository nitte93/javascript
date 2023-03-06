let input = document.querySelector("#value");
let normal = document.querySelector("#normal");
let debounced = document.querySelector("#debounced");
let throttled = document.querySelector("#throttled");

// API call to backend(currently a simple console.log)
function ApiCall(value, typeOfCall) {
  console.log("expensive API call with value", value)
  var g = document.createElement('span');
  g.id = 'apicall';
  g.innerHTML = value;
  if(typeOfCall === "normal"){
    normal.append(g)    
  }else if(typeOfCall === "debounced"){
    debounced.append(g)    
  }else if(typeOfCall === "throttled"){
    throttled.append(g)    
  }
}

// debounce implementation
function debounce(callback, delay) {
  let timer = null;
  return function(input) {
    clearTimeout(timer);
    const context = this;
    timer = setTimeout(function() {
      callback.call(this, input, "debounced")
    }, delay)
  }
}

function throttle(callback, delay){
  let isWaiting = false;
  let lastArg = null;
  return function(input){
    if(isWaiting){
      lastArg = input;
      return;
    }
    isWaiting = true;
    const context = this;
    callback.call(context, input, "throttled")
    function cooldown(){
      setTimeout(function(){
        if(lastArg !== null){
          callback.call(context, lastArg, "throttled")
          lastArg = null;
          // reignite the cooldown, because we triggered one more call
          cooldown();
        }else{
          isWaiting = false;
        }
      }, delay)      
    }
    cooldown();
  }
}


input.addEventListener("keyup", function(event) {
  const inputValue = input.value;
  ApiCall(inputValue, "normal")
})

const debouncedApiCall = debounce(ApiCall, 1000);
input.addEventListener("keyup", function(event) {
  const inputValue = input.value;
  debouncedApiCall(inputValue)
})

const throttledApiCall = throttle(ApiCall, 1000);
input.addEventListener("keyup", function(event) {
  const inputValue = input.value;
  throttledApiCall(inputValue)
})



// debounce:
// user Interaction: invoked invoked invoked invoked invoked 
// actual trigger:                                           cooldown callback-triggered

// throttle:
// user Interaction: invoked invoked invoked invoked invoked invoked invoked invoked invoked invoked 
// actual trigger:   callback-triggered cooldown callback-triggered cooldown callback-triggered