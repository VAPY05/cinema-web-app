export function hideAll(){
    let everySection = document.querySelectorAll(`.view-section`);
    everySection.forEach(element =>{
        element.style.display = "none";
    })
}