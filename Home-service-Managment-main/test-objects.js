// Test Objects for Service Request Controller

// 1. Sample Service Providers (to be added to ServiceSchema collection)
const sampleProviders = [
  {
    id: 1,
    name: "John's Plumbing Services",
    skills: "Plumbing, Pipe Repair, Water Heater Installation",
    availability: "yes"
  },
  {
    id: 2,
    name: "Sarah's Electrical Works",
    skills: "Electrical Wiring, Light Installation, Circuit Repair",
    availability: "no"
  },
  {
    id: 3,
    name: "Mike's Cleaning Service",
    skills: "House Cleaning, Deep Cleaning, Office Cleaning",
    availability: "yes"
  }
];

// 2. Test Objects for Creating Service Requests

// Test Case 1: Valid request with available provider
const createRequestTest1 = {
  // URL: POST /requests/1
  // req.params: { providerId: "1" }
  // req.body:
  body: {
    customerName: "Alice Johnson",
    serviceType: "Plumbing",
    notes: "Kitchen sink is leaking, needs urgent repair"
  }
};

// Test Case 2: Request with unavailable provider (should fail)
const createRequestTest2 = {
  // URL: POST /requests/2
  // req.params: { providerId: "2" }
  // req.body:
  body: {
    customerName: "Bob Smith",
    serviceType: "Electrical",
    notes: "Need to install new ceiling fan"
  }
};

// Test Case 3: Request with non-existent provider (should fail)
const createRequestTest3 = {
  // URL: POST /requests/999
  // req.params: { providerId: "999" }
  // req.body:
  body: {
    customerName: "Carol Davis",
    serviceType: "Gardening",
    notes: "Lawn maintenance required"
  }
};

// 3. Test Objects for Updating Service Requests

// Test Case 1: Update to in-progress
const updateRequestTest1 = {
  // URL: PUT /requests/:requestId
  // req.params: { requestId: "actual_mongodb_id_here" }
  // req.body:
  body: {
    status: "in-progress",
    notes: "Technician arrived and started work"
  }
};

// Test Case 2: Update to completed (should save to user schema)
const updateRequestTest2 = {
  // URL: PUT /requests/:requestId
  // req.params: { requestId: "actual_mongodb_id_here" }
  // req.body:
  body: {
    status: "completed",
    notes: "Work completed successfully. Sink is now working properly."
  }
};

// 4. Sample Users (to be added to UserSchema collection for testing)
const sampleUsers = [
  {
    name: "Alice Johnson",
    contact: "555-0101",
    address: "123 Main St, City, State",
    serviceHistory: []
  },
  {
    name: "Bob Smith",
    contact: "555-0102",
    address: "456 Oak Ave, City, State",
    serviceHistory: []
  }
];

// 5. API Testing Examples using curl or Postman

const apiTestExamples = {
  
  // Create Service Request (Available Provider)
  createRequest_Available: {
    method: "POST",
    url: "http://localhost:3000/requests/1",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      customerName: "Alice Johnson",
      serviceType: "Plumbing",
      notes: "Kitchen sink is leaking, needs urgent repair"
    })
  },

  // Create Service Request (Unavailable Provider - should fail)
  createRequest_Unavailable: {
    method: "POST",
    url: "http://localhost:3000/requests/2",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      customerName: "Bob Smith",
      serviceType: "Electrical",
      notes: "Need to install new ceiling fan"
    })
  },

  // Update Request to Completed
  updateRequest_Complete: {
    method: "PUT",
    url: "http://localhost:3000/requests/REPLACE_WITH_ACTUAL_REQUEST_ID",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      status: "completed",
      notes: "Work completed successfully"
    })
  },

  // Get All Active Requests
  getActiveRequests: {
    method: "GET",
    url: "http://localhost:3000/requests/active"
  },

  // Get Completed Requests
  getCompletedRequests: {
    method: "GET",
    url: "http://localhost:3000/requests/completed"
  },

  // Get Requests by Provider
  getProviderRequests: {
    method: "GET",
    url: "http://localhost:3000/requests/provider/1"
  },

  // Get Requests by Customer
  getCustomerRequests: {
    method: "GET",
    url: "http://localhost:3000/requests/customer/Alice Johnson"
  }
};

// 6. Expected Response Examples

const expectedResponses = {
  
  // Successful Request Creation
  createSuccess: {
    success: true,
    message: "Service request created successfully",
    data: {
      _id: "mongodb_generated_id",
      customerName: "Alice Johnson",
      providerId: 1,
      serviceType: "Plumbing",
      status: "pending",
      startTime: "2025-08-11T06:55:25.000Z",
      notes: "Kitchen sink is leaking, needs urgent repair",
      createdAt: "2025-08-11T06:55:25.000Z"
    }
  },

  // Failed Request (Unavailable Provider)
  createFailure_Unavailable: {
    success: false,
    message: "Service provider is not available at the moment"
  },

  // Failed Request (Provider Not Found)
  createFailure_NotFound: {
    success: false,
    message: "Service provider not found"
  },

  // Successful Update to Completed
  updateSuccess_Completed: {
    success: true,
    message: "Service request updated successfully",
    data: {
      _id: "mongodb_generated_id",
      customerName: "Alice Johnson",
      providerId: 1,
      serviceType: "Plumbing",
      status: "completed",
      startTime: "2025-08-11T06:55:25.000Z",
      endTime: "2025-08-11T08:30:15.000Z",
      notes: "Work completed successfully",
      createdAt: "2025-08-11T06:55:25.000Z"
    }
  }
};

// 7. MongoDB Commands to Insert Test Data

const mongoCommands = `
// Insert sample providers
db.services.insertMany([
  {
    id: 1,
    name: "John's Plumbing Services",
    skills: "Plumbing, Pipe Repair, Water Heater Installation",
    availability: "yes"
  },
  {
    id: 2,
    name: "Sarah's Electrical Works",
    skills: "Electrical Wiring, Light Installation, Circuit Repair",
    availability: "no"
  },
  {
    id: 3,
    name: "Mike's Cleaning Service",
    skills: "House Cleaning, Deep Cleaning, Office Cleaning",
    availability: "yes"
  }
]);

// Insert sample users
db.users.insertMany([
  {
    name: "Alice Johnson",
    contact: "555-0101",
    address: "123 Main St, City, State",
    serviceHistory: []
  },
  {
    name: "Bob Smith",
    contact: "555-0102",
    address: "456 Oak Ave, City, State",
    serviceHistory: []
  }
]);
`;

module.exports = {
  sampleProviders,
  createRequestTest1,
  createRequestTest2,
  createRequestTest3,
  updateRequestTest1,
  updateRequestTest2,
  sampleUsers,
  apiTestExamples,
  expectedResponses,
  mongoCommands
};

console.log("Test Objects for Service Request Controller");
console.log("==========================================");
console.log("\n1. First, insert sample providers and users into your database");
console.log("\n2. Test creating requests with different provider IDs");
console.log("   - Provider ID 1: Available (should succeed)");
console.log("   - Provider ID 2: Unavailable (should fail)");
console.log("   - Provider ID 999: Non-existent (should fail)");
console.log("\n3. Test updating requests to completed status");
console.log("   - This should automatically save to user's serviceHistory");
console.log("\n4. Test all the GET endpoints to retrieve requests");
