function populateText() {
    var dropdown = document.getElementById("dropdown");
    var selectedOption = dropdown.options[dropdown.selectedIndex].value;
  
    // Check if the text for the selected option is stored in local storage
    var text1 = localStorage.getItem(selectedOption + "-text1");
    var text2 = localStorage.getItem(selectedOption + "-text2");
    var text3 = localStorage.getItem(selectedOption + "-text3");
    var text4 = localStorage.getItem(selectedOption + "-text4");
  
    // If the text is stored in local storage, restore it
    if (text1) {
      document.getElementById("text1").value = text1;
    } else {
      document.getElementById("text1").value = "";
    }
    if (text2) {
      document.getElementById("text2").value = text2;
    } else {
      document.getElementById("text2").value = "";
    }
    if (text3) {
      document.getElementById("text3").value = text3;
    } else {
      document.getElementById("text3").value = "";
    }
    if (text4) {
      document.getElementById("text4").value = text4;
    } else {
      document.getElementById("text4").value = "";
    }
  }
  
  // Save the text for the selected option when the text entry spaces are changed
  document.getElementById("text1").addEventListener("change", function() {
    var dropdown = document.getElementById("dropdown");
    var selectedOption = dropdown.options[dropdown.selectedIndex].value;
    localStorage.setItem(selectedOption + "-text1", document.getElementById("text1").value);
  });
  document.getElementById("text2").addEventListener("change", function() {
    var dropdown = document.getElementById("dropdown");
    var selectedOption = dropdown.options[dropdown.selectedIndex].value;
    localStorage.setItem(selectedOption + "-text2", document.getElementById("text2").value);
  });
  document.getElementById("text3").addEventListener("change", function() {
    var dropdown = document.getElementById("dropdown");
    var selectedOption = dropdown.options[dropdown.selectedIndex].value;
    localStorage.setItem(selectedOption + "-text3", document.getElementById("text3").value);
  });
  document.getElementById("text4").addEventListener("change", function() {
    var dropdown = document.getElementById("dropdown");
    var selectedOption = dropdown.options[dropdown.selectedIndex].value;
    localStorage.setItem(selectedOption + "-text4", document.getElementById("text4").value);
  });
  