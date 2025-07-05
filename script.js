// Firebase Config (leave this as yours)
const firebaseConfig = {
  apiKey: "AIzaSyAtX4-cXANVUr8IRaFVxiuNQlmCv42fgHA",
  authDomain: "dreadedvcf.firebaseapp.com",
  databaseURL: "https://dreadedvcf-default-rtdb.firebaseio.com",
  projectId: "dreadedvcf",
  storageBucket: "dreadedvcf.firebasestorage.app",
  messagingSenderId: "931259893839",
  appId: "1:931259893839:web:ea17f7761116ded168823a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// DOM references
const form = document.getElementById("vcfForm");
const nameInput = document.getElementById("name");
const numberInput = document.getElementById("number");
const countDisplay = document.getElementById("count");
const downloadBtn = document.getElementById("downloadBtn");

const TARGET_COUNT = 300;

// Helper: Validate phone number format (e.g. +2349012345678)
function isValidPhoneNumber(number) {
  const pattern = /^\+\d{10,15}$/;
  return pattern.test(number);
}

// Load and update count display
function updateCount() {
  db.ref("contacts").once("value", (snapshot) => {
    const data = snapshot.val();
    const count = data ? Object.keys(data).length : 0;
    countDisplay.textContent = count;
    if (count >= TARGET_COUNT) {
      downloadBtn.style.display = "inline-block";
    }
  });
}
updateCount();

// Handle form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const number = numberInput.value.trim();

  // Check for empty input
  if (!name || !number) {
    alert("Please enter both name and number.");
    return;
  }

  // Step 1: Validate number
  if (!isValidPhoneNumber(number)) {
    alert("Invalid number. Use format like: +2349012345678");
    return;
  }

  // Step 2: Check if number already exists in Firebase
  try {
    const snapshot = await db
      .ref("contacts")
      .orderByChild("number")
      .equalTo(number)
      .once("value");

    if (snapshot.exists()) {
      alert("[This Number Has Been Upload Share Site Link To Reach Drop Amount Fast]");
      return;
    }

    // Step 3: Upload new contact
    const contactData = {
      name,
      number,
      timestamp: Date.now()
    };

    await db.ref("contacts").push(contactData);

    alert("✅ Your number has been uploaded successfully!");
    nameInput.value = "";
    numberInput.value = "";
    updateCount();

  } catch (err) {
    console.error(err);
    alert("❌ Upload failed. Please try again.");
  }
});


