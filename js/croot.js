import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { addCSS } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";
import {
    setInner,
    show,
    hide,
    getFileSize
} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.0.6/croot.js";

// Add SweetAlert2 CSS
addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

document.addEventListener("DOMContentLoaded", function() {
    // Cancel Button
    const cancelButton = document.getElementById("cancelButton");
    if (cancelButton) {
        cancelButton.addEventListener("click", function() {
            Swal.fire({
                title: "Are you sure?",
                text: "The change won't be saved",
                showDenyButton: true,
                confirmButtonText: "Yes",
                denyButtonText: "Nevermind",
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.setItem("cancelToast", "true");
                    window.location.href = "index.html";
                }
            });
        });
    }

    // Form Submit for Petapedia
    const form = document.getElementById("locationForm");
    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();

            const token = getCookie("login");
            const longitude = parseFloat(document.getElementById("long").value);
            const latitude = parseFloat(document.getElementById("lat").value);

            if (isNaN(longitude) || isNaN(latitude) || longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
                Swal.fire("Error", "Please enter valid longitude and latitude values within valid ranges.", "error");
                return;
            }

            const requestData = { long: longitude, lat: latitude };

            fetch("https://asia-southeast2-awangga.cloudfunctions.net/petabackend/data/gis/lokasi", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "login": token,
                },
                body: JSON.stringify(requestData),
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then((error) => {
                        Swal.fire("Error", `Failed to fetch data: ${JSON.stringify(error)}`, "error");
                    });
                }
            }).then((result) => {
                if (result) {
                    document.getElementById("province").value = result.province || "";
                    document.getElementById("district").value = result.district || "";
                    document.getElementById("sub_district").value = result.sub_district || "";
                    document.getElementById("village").value = result.village || "";
                    Swal.fire("Success", "Data successfully fetched from GIS.", "success");
                }
            }).catch((error) => {
                Swal.fire("Error", "An unexpected error occurred. Please try again.", "error");
            });
        });
    }

    // Save Button for Region Data
    const saveButton = document.getElementById("saveButton");
    if (saveButton) {
        saveButton.addEventListener("click", function() {
            uploadImage();

            const province = document.getElementById("province").value;
            const district = document.getElementById("district").value;
            const sub_district = document.getElementById("sub_district").value;
            const village = document.getElementById("village").value;
            const lat = parseFloat(document.getElementById("lat").value);
            const lon = parseFloat(document.getElementById("long").value);
            const nama_tempat = document.getElementById("nama_tempat").value;
            const lokasi = document.getElementById("lokasi").value;
            const fasilitas = document.getElementById("fasilitas").value;
            const imageInput = document.getElementById("gambar");

            if (!province || !district || !sub_district || !village || isNaN(lon) || isNaN(lat) || !nama_tempat || !lokasi || !fasilitas) {
                Swal.fire("Error", "All fields are required.", "error");
                return;
            }

            const regionData = {
                province: province,
                district: district,
                sub_district: sub_district,
                village: village,
                lat: lat,
                lon: lon,
                nama_tempat: nama_tempat,
                lokasi: lokasi,
                fasilitas: fasilitas,
                imageInput: imageInput
            };

            fetch("https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/gis/lokasi", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(regionData),
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    Swal.fire("Error", "Failed to save data.", "error");
                }
            }).then((result) => {
                if (result) {
                    Swal.fire("Success", `Data successfully saved: ${JSON.stringify(result)}`, "success");
                }
            }).catch((error) => {
                Swal.fire("Error", `An error occurred: ${error.message}`, "error");
            });
        });
    }

    // Image Upload
    const gambarInput = document.getElementById('gambar');
    if (gambarInput) {
        gambarInput.addEventListener("change", function() {
            uploadImage();
        });
    }
});

function uploadImage() {
    const gambar = document.getElementById('gambar');
    if (!gambar || gambar.files.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Silakan pilih file gambar terlebih dahulu"
        });
        return;
    }

    const gambarinput = document.getElementById('gambar');
    if (gambarinput) {
        hide("gambar");
    } else {
        console.error("Element with ID 'gambar' not found");
    }

    let besar = getFileSize("gambar");
    setInner("isi", besar);

    postFile(target_url, "gambar", "img", renderToHtml);
}

function renderToHtml(result) {
    console.log(result);
    setInner("isi", "https://parkirgratis.github.io/filegambar/" + result.response);
    show("gambar");
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) {
            return value;
        }
    }
    return null;
}
