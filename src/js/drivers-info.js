import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from '/app.js';

document.addEventListener('DOMContentLoaded', async () => {
    await loadDriversData();
});

async function loadDriversData() {
    const driversTableBody = document.querySelector('#driversTable tbody');
    driversTableBody.innerHTML = "";

    try {
        const querySnapshot = await getDocs(collection(db, "drivers"));
        querySnapshot.forEach((doc) => {
            const driverData = doc.data();
            const row = driversTableBody.insertRow();
            row.insertCell(0).innerText = driverData.firstName;
            row.insertCell(1).innerText = driverData.middleInitials || "N/A";
            row.insertCell(2).innerText = driverData.lastName;
            row.insertCell(3).innerText = driverData.gender;
            row.insertCell(4).innerText = driverData.age;
            row.insertCell(5).innerText = driverData.userType;
            row.insertCell(6).innerText = driverData.contactNumber;
            row.insertCell(7).innerText = driverData.emailAddress;
            row.insertCell(8).innerText = driverData.address;
            row.insertCell(9).innerText = driverData.plateNumber;
            row.insertCell(10).innerText = driverData.vehicleType;
            row.insertCell(11).innerText = driverData.vehicleColor;

            const showQRBtn = document.createElement('button');
            showQRBtn.innerText = "Show QR";
            showQRBtn.onclick = () => showQrPopup(doc.id);
            row.insertCell(12).appendChild(showQRBtn);
        });
    } catch (error) {
        console.error("Error loading driver data:", error);
    }
}

async function showQrPopup(docId) {
    try {
        const driverRef = doc(db, "drivers", docId);
        const driverSnap = await getDoc(driverRef);

        if (driverSnap.exists()) {
            const driverData = driverSnap.data();
            document.getElementById("userType").innerText = `User Type: ${driverData.userType}`;
            document.getElementById("driverName").innerText = `Driver Name: ${driverData.firstName} ${driverData.lastName}`;
            document.getElementById("plateNumber").innerText = `Plate Number: ${driverData.plateNumber}`;

            const qrCanvas = document.getElementById("qrCodeCanvas");
            const context = qrCanvas.getContext("2d");
            const qrImage = new Image();
            qrImage.src = driverData.qrCode;
            qrImage.onload = () => {
                context.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
                context.drawImage(qrImage, 0, 0, qrCanvas.width, qrCanvas.height);
            };

            document.getElementById("qrPopup").style.display = "flex";

            document.getElementById("downloadQRBtn").onclick = () => {
                const link = document.createElement("a");
                link.href = qrCanvas.toDataURL("image/png");
                link.download = "driver_qrcode.png";
                link.click();
            };
        } else {
            alert("Driver data not found.");
        }
    } catch (error) {
        console.error("Error fetching driver data:", error);
    }
}

document.getElementById("closePopupBtn").onclick = () => {
    document.getElementById("qrPopup").style.display = "none";
};
