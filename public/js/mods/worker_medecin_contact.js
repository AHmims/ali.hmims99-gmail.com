document.getElementsByClassName('navIconBox')[0].parentElement.setAttribute('href', '/medecin/notifications');
document.getElementsByClassName('navIconBox')[1].parentElement.setAttribute('href', '/medecin/contact');
document.getElementsByClassName('navIconBox')[1].setAttribute('class', 'navIconBox notifSelected');
// 
document.getElementById('msgSend').addEventListener('click', () => {
    sendMsg(document.getElementById('msgInput').value);
    // 
    let msg = {
        date: new Date(Date.now()),
        content: document.getElementById('msgInput').value,
        type: 'Text',
        room: {
            id: null,
            sender: null,
            receiver: null
        }
    }
    createMsgBox(msg, 'sentMessage');
    document.getElementById('msgInput').value = "";
});
// 
document.getElementById('msgVideo').addEventListener('click', () => {
    document.getElementById('chatSection').style.display = "none";
    document.getElementById('videoSection').style.display = "block";
});
// 
document.getElementById('videoControl-btnEnd').addEventListener('click', () => {
    document.getElementById('chatSection').style.display = "flex";
    document.getElementById('videoSection').style.display = "none";
});
// 
document.getElementById('patientSubmit').addEventListener('click', () => {
    document.getElementsByClassName('submitPopupBg')[0].style.display = "flex";
});
document.getElementById('popup-btnSubmit').addEventListener('click', () => {
    document.getElementsByClassName('submitPopupBg')[0].style.display = "none";
});
// 
document.getElementsByClassName('submitPopupBg')[0].addEventListener('click', (e) => {
    if (e.target == document.getElementsByClassName('submitPopupBg')[0])
        document.getElementsByClassName('submitPopupBg')[0].style.display = "none";
});
// 
document.getElementById('msgVideo').addEventListener('click', () => {
    streaminit();
});
// 
if (!sessionStorage.getItem('user_M'))
    window.location.href = "/";
// 
$.post('/getActivePatients', {
    medecinId: sessionStorage.getItem('user_M')
}, (response) => {
    response = JSON.parse(response);
    // 
    console.log(response);
    displayPatientsList(response);
});
// 
// 
function displayReceivedMsg(msg) {
    console.log(msg);
    createMsgBox(msg, 'receivedMessage');
}

function displayPatientsList(patients) {
    // document.getElementById('patientsList').innerHTML = "";
    patients.forEach((patient, i) => {
        if (!boxExists(patient)) {
            let box = createContactBox(patient, i);
            document.getElementById('patientsList').appendChild(box);
        }
    });
}
// 
function createMsgBox(msg, type) {
    var container = document.createElement('div');
    container.setAttribute('class', `messageContainer ${type}`);
    var txt = document.createElement('span');
    txt.innerText = msg.content;
    // 
    container.appendChild(txt);
    document.getElementsByClassName('chatSectionMessages')[0].appendChild(container);
}

function createContactBox(patient, index) {
    let cont = document.createElement('div');
    cont.setAttribute('class', 'patientContact');
    // 
    let avatar = document.createElement('div');
    avatar.setAttribute('class', 'patientContactAvatar');
    let status = document.createElement('div');
    let statsClasses = ["statusOffline", "statusOnline"];
    status.setAttribute('class', `patientContactStatus ${statsClasses[+patient.online]}`);
    avatar.appendChild(status);
    // 
    let txtBox = document.createElement('div');
    txtBox.setAttribute('class', 'patientContactInformations');
    // 
    let txtName = document.createElement('span');
    txtName.setAttribute('class', 'patientContactName');
    txtName.innerText = `NomP ${index}`;
    let txtMatr = document.createElement('span');
    txtMatr.setAttribute('class', 'patientContactMatricule');
    txtMatr.innerText = patient.userId;
    // 
    txtBox.appendChild(txtName);
    txtBox.appendChild(txtMatr);
    // 
    cont.appendChild(avatar);
    cont.appendChild(txtBox);
    // 
    cont.addEventListener('click', () => {
        let boxes = document.getElementsByClassName('patientContact');
        Array.from(boxes).forEach(box => {
            box.setAttribute('class', 'patientContact');
        });
        // 
        cont.setAttribute('class', 'patientContact patientSelected');
        switchUser(patient.notifId);
    });
    // 
    if (index == 0) {
        cont.setAttribute('class', 'patientContact patientSelected');
        switchUser(patient.notifId);
    }
    cont.setAttribute('data-notif', patient.notifId);
    // 
    return cont;
}

function boxExists(patient) {
    let boxes = document.getElementsByClassName('patientContact');
    let statsClasses = ["statusOffline", "statusOnline"];
    let exists = false;
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].children[1].children[1].innerText == patient.userId) {
            exists = true;
            // 
            boxes[i].children[0].children[0].setAttribute('class', `patientContactStatus ${statsClasses[+patient.online]}`);
        }
    }
    // 
    return exists;
}
// 