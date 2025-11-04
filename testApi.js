// testApi.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/graphql";

async function testGraphQL() {
    try {
        // --- GraphQL query ---
        const query = `            
            mutation CreateProperty {
                createUser(
                    input: {
                        email: "123@123.com"
                        password: "123"
                        fullName: "ashok k"
                        phone: "123"
                        role: ADMIN
                    }
                ) {
                    id
                    email
                    fullName
                    phone
                    role
                    createdAt
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
