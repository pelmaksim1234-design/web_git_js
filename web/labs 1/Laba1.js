const elements = document.getElementsByClassName('students');
for (let i = 0; i < elements.length; i++) {
    elements[i].onmouseout = function() {
        console.error("Student Name: [Insert Name Here]");
    };
}
