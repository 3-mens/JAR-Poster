const firebaseConfig = {
        
}
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const database = firebase.database();

const firestore = firebase.firestore();

const createForm = document.querySelector("#createForm");
const postSubmit = document.querySelector("#postSubmit");
const progressHandler = document.querySelector("#progressHandler");
const progressBar = document.querySelector("#progressBar");

if(createForm != null){
    let d;
    createForm.addEventListener("submit", async(e) =>{
        e.preventDefault();

        if(document.getElementById("title").value != "" && document.getElementById("content").value != "" && document.getElementById("cover").files[0] != ""){
            
            let title = document.getElementById("title").value;
            let details = document.getElementById("content").value;
            let cover = document.getElementById("cover").files[0];
            console.log(cover);

            const storageRef = firebase.storage().ref();
            const storageChild = storageRef.child(cover.name);

            console.log("Uploading file...");
            const postCover = storageChild.put(cover);

            await new Promise((resolve) => {
                postCover.on("state_changed",(snapshot) => {
                    // let progress = (snapshot.bytesTransfrerred / snapshot.totalBytes) * 100;
                    // console.log(Math.trunc(progress));

                    // if(progressHandler != null){
                    //     progressHandler.style.display = true;
                    // }

                    // if(postSubmit != null){
                    //     postSubmit.disabled = true;
                    // }

                    // if(progressBar != null){
                    //     progressBar.value = progress;
                    // }
                }, (error) => {
                    //error
                    console.log(error);
                }, async() => {
                    const downloadURL = await storageChild.getDownloadURL();
                    d = downloadURL;
                    console.log(d);
                    resolve();
                });
            });

            const fileRef = await firebase.storage().refFromURL(d);

            let post = {
                title,
                details,
                cover: d,
                fileref: fileRef.location.path //image.jpg
            }

            await firebase.firestore().collection("posts").add(post);

            console.log("post added successfully");

            if(postSubmit != null){
                window.location.replace("new.html");
                postSubmit.disabled = false;
            }
        }else{
            console.log("must fill all the inputs")
        }


        
    });
}