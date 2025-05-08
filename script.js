 const firebaseConfig = {
    // Thêm thông tin cấu hình Firebase của bạn ở đây
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const rows = [
    { seats: 12, taken: [], name: 'A' },
    { seats: 12, taken: [], name: 'B' },
    { seats: 12, taken: [], name: 'C' },
    { seats: 12, taken: [], name: 'D' },
    { seats: 10, taken: [], name: 'E' },
    { seats: 10, taken: [], name: 'F' },
    { seats: 10, taken: [], name: 'G' },
    { seats: 12, taken: [], name: 'H' },
    { seats: 12, taken: [], name: 'I' }
];

let selectedSeats = [];

function renderSeatingChart() {
    const chartDiv = document.getElementById('seating-chart');
    chartDiv.innerHTML = '';

    rows.forEach((row) => {
        const rowDiv = document.createElement('div');
        for (let seatIndex = 0; seatIndex < row.seats; seatIndex++) {
            const seatId = `${row.name}${seatIndex + 1}`;
            const seatDiv = document.createElement('div');
            seatDiv.className = 'seat available';
            seatDiv.id = seatId;
            seatDiv.textContent = seatId;

            seatDiv.onclick = () => {
                if (seatDiv.classList.contains('available')) {
                    seatDiv.classList.remove('available');
                    seatDiv.classList.add('taken');
                    selectedSeats.push(seatId);
                } else {
                    alert('Ghế này đã được đặt!');
                }
            };

            rowDiv.appendChild(seatDiv);
        }
        chartDiv.appendChild(rowDiv);
    });
}

document.getElementById('submit').onclick = () => {
    const email = document.getElementById('email').value;
    if (selectedSeats.length === 0) {
        alert('Vui lòng chọn ít nhất một ghế!');
        return;
    }
    if (!validateEmail(email)) {
        alert('Vui lòng nhập địa chỉ email hợp lệ!');
        return;
    }

    db.collection("reservations").add({
        email: email,
        seats: selectedSeats
    })
    .then(() => {
        const confirmationDiv = document.getElementById('confirmation');
        confirmationDiv.innerHTML = `<h3>Xác nhận đặt ghế thành công!</h3>
                                      <p>Email: ${email}</p>
                                      <p>Ghế đã đặt: ${selectedSeats.join(', ')}</p>`;
        selectedSeats = [];
        renderSeatingChart();
    })
    .catch((error) => {
        console.error("Lỗi khi lưu dữ liệu: ", error);
    });
};

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

renderSeatingChart();
