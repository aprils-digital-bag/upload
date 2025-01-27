//void function(){

import {initializeApp} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js"
import {getDatabase, ref, set, push} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js"

const firebaseConfig = {
    apiKey: "AIzaSyAlVbqGc-2nqmXWaly8jrY2oQRykm5yMlU",
    authDomain: "aprils-digital-bag.firebaseapp.com",
    databaseURL: "https://aprils-digital-bag-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "aprils-digital-bag",
    storageBucket: "aprils-digital-bag.firebasestorage.app",
    messagingSenderId: "475299865217",
    appId: "1:475299865217:web:627126b03d67619c67e380",
    measurementId: "G-2B2LP39SNG"
};


initializeApp(firebaseConfig)

let database = getDatabase()
let file_reference = ref(database, "files")

document.getElementById("upload").addEventListener("click", function()
{
    if (!file)
        return;
    
    push(file_reference, {
        name: file_name,
        size: file_size,
        data: file_data
    });
});

let file = undefined;
let file_name = undefined;
let file_size = undefined;
let file_data = '';

document.getElementById("file").addEventListener("change", function(event)
{
    file = event.target.files[0];
    
    if (file) {
        file_name = file.name;
        file_size = file.size;
        
        document.getElementById("file-name").textContent = file_name;
        
        if (file_size < 1000)
            document.getElementById("file-size").textContent = file_size + " Bi";
        else if (file_size < 1e4)
            document.getElementById("file-size").textContent =
                Math.floor(file_size / 1000) + "," + (file_size % 1000).toString().padStart(3, "0") + " Bi";
        else if (file_size < 1024 ** 2)
            document.getElementById("file-size").textContent = (file_size / 1024).toFixed(3) + " KBi";
        else if (file_size < 1024 ** 3)
            document.getElementById("file-size").textContent = (file_size / 1024 ** 2).toFixed(3) + " MBi";
        else if (file_size < 1024 ** 4)
            document.getElementById("file-size").textContent = (file_size / 1024 ** 3).toFixed(3) + " MBi";
        
        const reader = new FileReader();
        
        reader.onload = e => {
            const uint8Array = new Uint8Array(e.target.result);
            
            file_data = Array.from(uint8Array).map(byte => String.fromCharCode(byte)).join('');
            
            console.log(file_data);
        };
        
        reader.readAsArrayBuffer(file);
    } else {
        document.getElementById("file-name").textContent = "No file selected."
    };
});

//}()