// testApi.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/graphql";

async function testGraphQL() {
    try {
        // --- GraphQL query ---
        const query = `            
            query GetAllAgents {
    getAllAgents {
        userId
        agency
        licenseNo
    }
}

        `;

        // --- Send POST request ---
        const response = await axios.post(API_URL, { query });


        console.log("✅ API Response:\n", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("❌ API Test Failed:\n");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testGraphQL();
