// Book Now buttons

var app = angular.module('studySpaceApp', []);

app.controller('RoomController', function($scope) {
    $scope.rooms = [];
    $scope.loading = true;

    fetch('http://localhost:5000/api/rooms')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            $scope.$apply(function() {
                $scope.rooms = data;
                $scope.loading = false;
            });
        })
        .catch(function(error) {
            $scope.$apply(function() {
                $scope.loading = false;
                $scope.error = 'Unable to load rooms.';
            });
            console.log(error);
        });
});

const buttons = document.querySelectorAll(".book-btn");

buttons.forEach(function(button) {
    button.addEventListener("click", function() {
        const roomName = button.parentElement.querySelector("h3").textContent;

        document.getElementById("selectedRoom").value = roomName;

        document.getElementById("booking").scrollIntoView({
            behavior: "smooth"
        });
    });
});

// Booking Form
const bookingForm = document.getElementById("bookingForm");
const bookingList = document.getElementById("bookingList");

// Load saved bookings
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

// Display bookings
function displayBookings() {
    bookingList.innerHTML = "<p>Loading bookings...</p>";

    fetch("http://localhost:5000/api/bookings")
        .then(response => response.json())
        .then(data => {
            bookingList.innerHTML = "";

            if (data.length === 0) {
                bookingList.innerHTML = `
                    <div class="empty-bookings">
                        <p>You haven't made any bookings yet.</p>
                    </div>
                `;
                return;
            }

            data.forEach(function (booking) {
                const card = document.createElement("div");
                card.className = "booking-card";

                card.innerHTML = `
                    <h3>${booking.room?.roomName || "Study Room"}</h3>
                    <p><strong>Student:</strong> ${booking.student?.name || "Student"}</p>
                    <p><strong>Date:</strong> ${String(booking.bookingDate).slice(0, 10)}</p>
                    <p><strong>Time:</strong> ${booking.startTime} - ${booking.endTime}</p>
                    <p><strong>Status:</strong> ${booking.status}</p>
                `;

                bookingList.appendChild(card);
            });
        })
        .catch(error => {
            bookingList.innerHTML = "<p>Unable to load bookings.</p>";
            console.log(error);
        });
}

// Submit Booking
bookingForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const email = document.getElementById("studentEmail").value.trim();
    const room = document.getElementById("selectedRoom").value;
    const date = document.getElementById("bookingDate").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const studentId = localStorage.getItem("studentId");

    if (!studentId) {
    alert("Please register first!");
    return;
    }

    if (endTime <= startTime) {
        alert("End time must be later than start time!");
        return;
    }

    const bookingData = {
    student: studentId,
    room: room,
    bookingDate: date,
    startTime: startTime,
    endTime: endTime
    };

fetch("http://localhost:5000/api/bookings", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(bookingData)
})
.then(response => response.json())
.then(data => {
    if (data.booking) {
        alert("Booking submitted successfully!");
        bookingForm.reset();
        displayBookings();
    } else {
        alert(data.message || "Booking failed.");
    }
})
.catch(error => {
    alert("Error submitting booking.");
    console.log(error);
});



    document.getElementById("myBookings").scrollIntoView({
        behavior: "smooth"
    });
});

// Display saved bookings on page load
displayBookings();

// Student Registration
const registrationForm = document.getElementById("registrationForm");

registrationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("registrationMessage").textContent = data.message;

        if (data.user) {
            localStorage.setItem("studentId", data.user.id);
            localStorage.setItem("studentName", data.user.name);
            localStorage.setItem("studentEmail", data.user.email);

            registrationForm.reset();
        }
    })
    .catch(error => {
        document.getElementById("registrationMessage").textContent =
            "Registration failed. Please try again.";

        console.log(error);
    });
});
