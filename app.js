firebase.initializeApp(config);
var db = firebase.firestore();

// Initialize user
storage = window.localStorage;

user = storage.getItem('user-sid');
if (user){
} else {
    sid = Math.floor((Math.random() * 999999) + 100000);
    storage.setItem('user-sid', sid)
}

// Create group
sender      = user;
add         = document.getElementById('add');


add.addEventListener('click', function () {

    // Get data
    receiver    = document.getElementById('receiver').value;

    // Connect & insert firestore
    db.collection("group").add({
        sender: user,
        receiver: receiver,
    })
        .then(function(docRef) {
        })
        .catch(function(error) {
        });
});


// Create message

id_sender = null;
id_receiver = null;
send.addEventListener('click', function () {


    // Get data
    receiver    = document.getElementById('contact').value;
    text        = document.getElementById('text').value;
    send        = document.getElementById('send');
    date        = Date.now();
    dateObj     = new Date();
    month       = dateObj.getUTCMonth() + 1;
    day         = dateObj.getUTCDate();
    year        = dateObj.getUTCFullYear();
    newdate     = year + "-" + month + "-" + day;

    // search if group exist
    db.collection("group").where('sender','==', user).where('receiver', '==', receiver).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            id_sender = doc.id;
        });
    });

    db.collection("group").where('sender','==', receiver).where('receiver', '==', user).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            id_receiver = doc.id;
        });
    });

    if (id_sender != null) {
        db.collection("group").doc(id_sender.toString()).collection('messages').add({
            sender: user,
            receiver: receiver,
            text: text,
            date: newdate
        })
            .then(function(docRef) {
            })
            .catch(function(error) {
            });
    }else if (id_receiver != null) {
        db.collection("group").doc(id_receiver.toString()).collection('messages').add({
            sender: user,
            receiver: receiver,
            text: text,
            date: newdate
        })
            .then(function(docRef) {
            })
            .catch(function(error) {
            });
    }else{
    }
});

db.collection("group")
    .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
                console.log("New city: ", change.doc.data());
                document.getElementById('contact-list').innerHTML += '<li>' + change.doc.data().receiver + '</li>'
            }
            if (change.type === "modified") {
                console.log("Modified city: ", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("Removed city: ", change.doc.data());
            }
        });
    });




