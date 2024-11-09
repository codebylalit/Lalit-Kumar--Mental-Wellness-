import { ChatBubbleLeftIcon, PhoneIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";

const ConnectDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [location, setLocation] = useState("");
  const [specialty, setSpecialty] = useState("");

  const doctorsData = [
    {
      name: "Dr. John Doe",
      specialty: "Cardiologist",
      location: "Delhi",
      contactNumber: "123-456-7890",
    },
    {
      name: "Dr. Jane Smith",
      specialty: "Dermatologist",
      location: "Mumbai",
      contactNumber: "234-567-8901",
    },
    {
      name: "Dr. Emily White",
      specialty: "Pediatrician",
      location: "Bangalore",
      contactNumber: "345-678-9012",
    },
    {
      name: "Dr. Michael Brown",
      specialty: "Orthopedic",
      location: "Chennai",
      contactNumber: "456-789-0123",
    },
    {
      name: "Dr. Linda Green",
      specialty: "Neurologist",
      location: "Delhi",
      contactNumber: "567-890-1234",
    },
    {
      name: "Dr. Robert Lee",
      specialty: "Gastroenterologist",
      location: "Mumbai",
      contactNumber: "678-901-2345",
    },
    {
      name: "Dr. Olivia Davis",
      specialty: "General Surgeon",
      location: "Bangalore",
      contactNumber: "789-012-3456",
    },
    {
      name: "Dr. David Johnson",
      specialty: "Orthopedic",
      location: "Chennai",
      contactNumber: "890-123-4567",
    },
    {
      name: "Dr. Sophia Martinez",
      specialty: "Endocrinologist",
      location: "Delhi",
      contactNumber: "901-234-5678",
    },
    {
      name: "Dr. William Harris",
      specialty: "Cardiologist",
      location: "Mumbai",
      contactNumber: "012-345-6789",
    },
    {
      name: "Dr. Abigail Clark",
      specialty: "Dermatologist",
      location: "Bangalore",
      contactNumber: "123-456-7891",
    },
    {
      name: "Dr. Henry Walker",
      specialty: "Pediatrician",
      location: "Chennai",
      contactNumber: "234-567-8902",
    },
    {
      name: "Dr. Isabella Allen",
      specialty: "Gastroenterologist",
      location: "Delhi",
      contactNumber: "345-678-9013",
    },
    {
      name: "Dr. Daniel Thomas",
      specialty: "General Surgeon",
      location: "Mumbai",
      contactNumber: "456-789-0124",
    },
    {
      name: "Dr. Emma Scott",
      specialty: "Ophthalmologist",
      location: "Bangalore",
      contactNumber: "567-890-1235",
    },
    {
      name: "Dr. James Nelson",
      specialty: "Neurologist",
      location: "Chennai",
      contactNumber: "678-901-2346",
    },
    {
      name: "Dr. Ava Carter",
      specialty: "Psychiatrist",
      location: "Delhi",
      contactNumber: "789-012-3457",
    },
    {
      name: "Dr. Lucas Lewis",
      specialty: "Urologist",
      location: "Mumbai",
      contactNumber: "890-123-4568",
    },
    {
      name: "Dr. Mia King",
      specialty: "Dermatologist",
      location: "Bangalore",
      contactNumber: "901-234-5679",
    },
    {
      name: "Dr. Mason Wright",
      specialty: "Pediatrician",
      location: "Chennai",
      contactNumber: "012-345-6780",
    },
    {
      name: "Dr. Ethan Young",
      specialty: "Cardiologist",
      location: "Delhi",
      contactNumber: "123-456-7892",
    },
    {
      name: "Dr. Harper Adams",
      specialty: "Endocrinologist",
      location: "Mumbai",
      contactNumber: "234-567-8903",
    },
    {
      name: "Dr. Alexander Baker",
      specialty: "Orthopedic",
      location: "Bangalore",
      contactNumber: "345-678-9014",
    },
    {
      name: "Dr. Charlotte Gonzalez",
      specialty: "General Surgeon",
      location: "Chennai",
      contactNumber: "456-789-0125",
    },
  ];

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  // Function to redirect to WhatsApp chat (using the same phone number)
  const handleWhatsApp = (phoneNumber) => {
    window.location.href = `https://wa.me/${phoneNumber.replace(/\D/g, "")}`; // Strip non-digit characters for WhatsApp link
  };

  useEffect(() => {
    // Set the initial list of doctors
    setDoctors(doctorsData);
  }, []);

  useEffect(() => {
    // Filter doctors based on location and specialty
    const filtered = doctorsData.filter(
      (doctor) =>
        (location
          ? doctor.location.toLowerCase().includes(location.toLowerCase())
          : true) &&
        (specialty
          ? doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
          : true)
    );
    setFilteredDoctors(filtered);
  }, [location, specialty]);

  const handleConnect = (doctor) => {
    setSelectedDoctor(doctor);
    setIsConnecting(true);
  };

  const handleCloseConnection = () => {
    setIsConnecting(false);
    setSelectedDoctor(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-semibold text-center">
        Connect with Doctors
      </h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Specialty (e.g., 'Cardiologist')"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Doctor List */}
      <div className="space-y-4">
        {filteredDoctors.map((doctor, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-600">{doctor.name}</h3>
            <p className="text-gray-600">Specialty: {doctor.specialty}</p>
            <p className="text-gray-600">Location: {doctor.location}</p>

            <div className="mt-4 flex gap-4">
              <button
                onClick={() => handleCall(doctor.contactNumber)}
                className="flex items-center bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
              >
                <PhoneIcon className="h-5 w-5 mr-2" />
                Call
              </button>
              <button
                onClick={() => handleWhatsApp(doctor.contactNumber)}
                className="flex items-center bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none"
              >
                <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                WhatsApp
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Connection Modal */}
      {isConnecting && selectedDoctor && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-2xl  font-semibold">
              Connecting to {selectedDoctor.name}
            </h3>
            <p className="text-gray-600">
              Specialty: {selectedDoctor.specialty}
            </p>
            <p className="text-gray-600">Location: {selectedDoctor.location}</p>
            <p className="text-gray-600">
              Contact: {selectedDoctor.contactNumber}
            </p>
            <button
              onClick={handleCloseConnection}
              className="mt-4 w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none"
            >
              Close Connection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectDoctors;
